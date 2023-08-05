const pool = require('../config/pg-connect')

async function createTable() {
  try {
    const query = `CREATE TABLE employees (
                    id SERIAL PRIMARY KEY,
                    employeeNumber INT NOT NULL,
                    clockIn TIMESTAMP,
                    clockOut TIMESTAMP
                  );`
    await pool.query(query)
    console.log('Create table successfully.')
  } catch (err) {git
    console.log('Create table wrong:', err)
  }
  pool.end()
}

createTable()
