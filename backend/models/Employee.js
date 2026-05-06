const pool = require('../config/database');

class Employee {
  static async create(employeeData) {
    const { first_name, last_name, email, phone, position, department, salary, hire_date, responsable, matricule } = employeeData;
    const query = `
      INSERT INTO employees (first_name, last_name, email, phone, position, department, salary, hire_date, responsable, matricule)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, first_name, last_name, email, phone, position, department, salary, hire_date, responsable, matricule
    `;
    const values = [first_name, last_name, email, phone, position, department, salary, hire_date, responsable, matricule];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = 'SELECT id, first_name, last_name, email, phone, position, department, salary, hire_date, responsable, matricule FROM employees';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT id, first_name, last_name, email, phone, position, department, salary, hire_date, responsable, matricule FROM employees WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, employeeData) {
    const { first_name, last_name, email, phone, position, department, salary, hire_date, responsable, matricule } = employeeData;
    const query = `
      UPDATE employees
      SET first_name = $1, last_name = $2, email = $3, phone = $4, position = $5, department = $6, salary = $7, hire_date = $8, responsable = $9, matricule = $10
      WHERE id = $11
      RETURNING id, first_name, last_name, email, phone, position, department, salary, hire_date, responsable, matricule
    `;
    const values = [first_name, last_name, email, phone, position, department, salary, hire_date, responsable, matricule, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM employees WHERE id = $1';
    await pool.query(query, [id]);
  }
}

module.exports = Employee;