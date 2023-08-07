const pool = require('../config/pg-connect')

async function createTable() {
  try {
    const query = `CREATE TABLE employees (
                    id SERIAL PRIMARY KEY,
                    employeeNumber INT NOT NULL,
                    clockIn BIGINT CHECK (clockIn >= 0),
                    clockOut BIGINT CHECK (clockIn >= 0)
                  );`
    await pool.query(query)
    console.log('Create table successfully.')
  } catch (err) {
    console.log('Create table wrong:', err)
  }
  pool.end()
}

createTable()
