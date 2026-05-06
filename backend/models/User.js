// backend/models/User.js
const pool = require('../config/database');

class User {
  static async create(userData) {
    const { first_name, last_name, email, password, role } = userData;
    const query = `
      INSERT INTO users (first_name, last_name, email, password, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, first_name, last_name, email, role
    `;
    const values = [first_name, last_name, email, password, role];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, userData) {
    const fields = [];
    const values = [];
    let index = 1;

    if (userData.first_name !== undefined) {
      fields.push(`first_name = $${index}`);
      values.push(userData.first_name);
      index++;
    }
    if (userData.last_name !== undefined) {
      fields.push(`last_name = $${index}`);
      values.push(userData.last_name);
      index++;
    }
    if (userData.email !== undefined) {
      fields.push(`email = $${index}`);
      values.push(userData.email);
      index++;
    }
    if (userData.password !== undefined) {
      fields.push(`password = $${index}`);
      values.push(userData.password);
      index++;
    }
    if (userData.role !== undefined) {
      fields.push(`role = $${index}`);
      values.push(userData.role);
      index++;
    }
    if (userData.profile_image !== undefined) {
      fields.push(`profile_image = $${index}`);
      values.push(userData.profile_image);
      index++;
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    const query = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = $${index}
      RETURNING id, first_name, last_name, email, role, profile_image
    `;
    values.push(id);

    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

module.exports = User;