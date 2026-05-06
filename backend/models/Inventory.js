const pool = require('../config/database');

class Inventory {
  static async create(data) {
    const { reference, serial_number, type, assigned_to, owner, employee_id } = data;
    const query = `
      INSERT INTO inventory (reference, serial_number, type, assigned_to, owner, employee_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [reference, serial_number, type, assigned_to, owner, employee_id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll(userId, role) {
    let query = 'SELECT i.*, u.first_name, u.last_name FROM inventory i LEFT JOIN users u ON i.employee_id = u.id';
    let values = [];
    if (role !== 'Admin' && role !== 'RH') {
      query += ' WHERE i.employee_id = $1';
      values = [userId];
    }
    const result = await pool.query(query, values);
    return result.rows;
  }

  static async findById(id, userId, role) {
    let query = 'SELECT i.*, u.first_name, u.last_name FROM inventory i LEFT JOIN users u ON i.employee_id = u.id WHERE i.id = $1';
    let values = [id];
    if (role !== 'Admin' && role !== 'RH') {
      query += ' AND i.employee_id = $2';
      values.push(userId);
    }
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async update(id, data, userId, role) {
    const fields = [];
    const values = [];
    let index = 1;

    if (data.reference !== undefined) {  // CORRIGÉ
      fields.push(`reference = $${index}`);
      values.push(data.reference);
      index++;
    }
    if (data.serial_number !== undefined) {
      fields.push(`serial_number = $${index}`);
      values.push(data.serial_number);
      index++;
    }
    if (data.type !== undefined) {
      fields.push(`type = $${index}`);
      values.push(data.type);
      index++;
    }
    if (data.assigned_to !== undefined) {
      fields.push(`assigned_to = $${index}`);
      values.push(data.assigned_to);
      index++;
    }
    if (data.owner !== undefined) {
      fields.push(`owner = $${index}`);
      values.push(data.owner);
      index++;
    }
    if (data.employee_id !== undefined) {
      fields.push(`employee_id = $${index}`);
      values.push(data.employee_id);
      index++;
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    let query = `
      UPDATE inventory
      SET ${fields.join(', ')}
      WHERE id = $${index}
    `;
    values.push(id);
    if (role !== 'Admin' && role !== 'RH') {
      query += ` AND employee_id = $${index + 1}`;
      values.push(userId);
    }
    query += ' RETURNING *';

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id, userId, role) {
    let query = 'DELETE FROM inventory WHERE id = $1';
    let values = [id];
    if (role !== 'Admin' && role !== 'RH') {
      query += ' AND employee_id = $2';
      values.push(userId);
    }
    await pool.query(query, values);
  }

  static async getEmployees() {
    const query = 'SELECT id, first_name, last_name FROM users';
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = Inventory;