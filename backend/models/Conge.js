// backend/models/Conge.js
const pool = require('../config/database');

class Conge {
  // Créer une demande de congé
  static async create(congeData) {
    const { user_id, type_conge, date_debut, date_fin, motif } = congeData;
    
    const nombre_jours_reels = await this.calculerJoursTravailles(date_debut, date_fin);
    
    const solde = await this.getSolde(user_id);
    let soldeDisponible = 0;
    
    if (type_conge === 'conges_payes') {
      soldeDisponible = solde.conges_payes;
    } else if (type_conge === 'maladie') {
      soldeDisponible = solde.conges_maladie;
    } else if (type_conge === 'rtt') {
      soldeDisponible = solde.rtt;
    }
    
    if (soldeDisponible < nombre_jours_reels) {
      throw new Error(`Solde insuffisant pour ${type_conge}. Restant: ${soldeDisponible} jours`);
    }
    
    const query = `
      INSERT INTO conges (user_id, type_conge, date_debut, date_fin, nombre_jours_demande, nombre_jours_reels, jours_restant, motif)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [user_id, type_conge, date_debut, date_fin, nombre_jours_reels, nombre_jours_reels, nombre_jours_reels, motif];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByUser(user_id) {
    const query = 'SELECT * FROM conges WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [user_id]);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM conges WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findAll() {
    const query = `
      SELECT c.*, u.first_name, u.last_name, u.email 
      FROM conges c 
      JOIN users u ON c.user_id = u.id 
      ORDER BY c.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // ✅ MODIFIÉ : Vérifie si l'utilisateur est Admin ou RH
  static async canUserManageConges(user_role) {
    return user_role === 'Admin' || user_role === 'RH';
  }

  // ✅ MODIFIÉ : updateStatut avec vérification des droits
  static async updateStatut(id, statut, user_role) {
    // Vérifier si l'utilisateur a le droit de gérer les congés
    const canManage = await this.canUserManageConges(user_role);
    if (!canManage) {
      throw new Error('Seul un administrateur ou RH peut approuver/refuser un congé');
    }
    
    const conge = await this.findById(id);
    if (!conge) return null;
    
    if (statut === 'approuve' && conge.statut !== 'approuve') {
      if (conge.type_conge === 'conges_payes') {
        await this.updateSolde(conge.user_id, -conge.nombre_jours_reels, 'conges_payes');
      } else if (conge.type_conge === 'maladie') {
        await this.updateSolde(conge.user_id, -conge.nombre_jours_reels, 'conges_maladie');
      } else if (conge.type_conge === 'rtt') {
        await this.updateSolde(conge.user_id, -conge.nombre_jours_reels, 'rtt');
      }
    }
    
    if ((statut === 'refuse' || statut === 'annule') && conge.statut === 'approuve') {
      if (conge.type_conge === 'conges_payes') {
        await this.updateSolde(conge.user_id, conge.nombre_jours_reels, 'conges_payes');
      } else if (conge.type_conge === 'maladie') {
        await this.updateSolde(conge.user_id, conge.nombre_jours_reels, 'conges_maladie');
      } else if (conge.type_conge === 'rtt') {
        await this.updateSolde(conge.user_id, conge.nombre_jours_reels, 'rtt');
      }
    }
    
    const query = 'UPDATE conges SET statut = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [statut, id]);
    return result.rows[0];
  }

  static async getSolde(user_id) {
    const query = 'SELECT * FROM soldes_conges WHERE user_id = $1';
    let result = await pool.query(query, [user_id]);
    
    if (result.rows.length === 0) {
      const insertQuery = `
        INSERT INTO soldes_conges (user_id, conges_payes, rtt, conges_maladie, annee) 
        VALUES ($1, 18, 0, 180, EXTRACT(YEAR FROM CURRENT_DATE))
        RETURNING *
      `;
      result = await pool.query(insertQuery, [user_id]);
    }
    
    return result.rows[0];
  }

  static async updateSolde(user_id, delta, type = 'conges_payes') {
    let colonne = 'conges_payes';
    if (type === 'conges_maladie') {
      colonne = 'conges_maladie';
    } else if (type === 'rtt') {
      colonne = 'rtt';
    }
    
    const query = `
      UPDATE soldes_conges 
      SET ${colonne} = ${colonne} + $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [delta, user_id]);
    return result.rows[0];
  }

  static async calculerJoursTravailles(date_debut, date_fin) {
    const debut = new Date(date_debut);
    const fin = new Date(date_fin);
    let jours = 0;
    
    const joursFeriesMaroc = [
      '01-01', '01-11', '01-14', '05-01', '07-30', 
      '08-14', '08-20', '08-21', '10-31', '11-06', '11-18'
    ];
    
    const annee = debut.getFullYear();
    const fetesMobiles = await this.getFetesMobilesMaroc(annee);
    
    for (let d = new Date(debut); d <= fin; d.setDate(d.getDate() + 1)) {
      const jourSemaine = d.getDay();
      const jourMois = `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      
      if (jourSemaine === 0 || jourSemaine === 6) continue;
      if (joursFeriesMaroc.includes(jourMois)) continue;
      
      const dateStr = d.toDateString();
      let estFerieMobile = false;
      
      if (fetesMobiles.aidElFitr) {
        if (dateStr === fetesMobiles.aidElFitr[0]?.toDateString() ||
            dateStr === fetesMobiles.aidElFitr[1]?.toDateString()) {
          estFerieMobile = true;
        }
      }
      
      if (!estFerieMobile && fetesMobiles.aidElAdha) {
        if (dateStr === fetesMobiles.aidElAdha[0]?.toDateString() ||
            dateStr === fetesMobiles.aidElAdha[1]?.toDateString()) {
          estFerieMobile = true;
        }
      }
      
      if (!estFerieMobile && fetesMobiles.mouharram) {
        if (dateStr === fetesMobiles.mouharram.toDateString()) {
          estFerieMobile = true;
        }
      }
      
      if (!estFerieMobile && fetesMobiles.aidMawlid) {
        if (dateStr === fetesMobiles.aidMawlid.toDateString()) {
          estFerieMobile = true;
        }
      }
      
      if (estFerieMobile) continue;
      
      jours++;
    }
    
    return jours;
  }

  static async getFetesMobilesMaroc(annee) {
    const fetesApprox = {
      2024: {
        aidElFitr: [new Date(2024, 3, 10), new Date(2024, 3, 11)],
        aidElAdha: [new Date(2024, 5, 16), new Date(2024, 5, 17)],
        mouharram: new Date(2024, 6, 7),
        aidMawlid: new Date(2024, 8, 15)
      },
      2025: {
        aidElFitr: [new Date(2025, 2, 30), new Date(2025, 2, 31)],
        aidElAdha: [new Date(2025, 5, 6), new Date(2025, 5, 7)],
        mouharram: new Date(2025, 5, 26),
        aidMawlid: new Date(2025, 8, 4)
      },
      2026: {
        aidElFitr: [new Date(2026, 2, 20), new Date(2026, 2, 21)],
        aidElAdha: [new Date(2026, 4, 27), new Date(2026, 4, 28)],
        mouharram: new Date(2026, 5, 16),
        aidMawlid: new Date(2026, 7, 25)
      },
      2027: {
        aidElFitr: [new Date(2027, 2, 9), new Date(2027, 2, 10)],
        aidElAdha: [new Date(2027, 4, 16), new Date(2027, 4, 17)],
        mouharram: new Date(2027, 5, 5),
        aidMawlid: new Date(2027, 7, 14)
      }
    };
    
    return fetesApprox[annee] || fetesApprox[2025];
  }
}

module.exports = Conge;