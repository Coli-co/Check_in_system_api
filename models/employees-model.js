const pool = require('../config/pg-connect')

async function clockinAndClockout(employeeNumber, clockIn, clockOut) {
  try {
    const query =
      'INSERT INTO employees (employeeNumber, clockIn, clockOut) VALUES ($1, $2, $3)'
    const res = await pool.query(query, [employeeNumber, clockIn, clockOut])
    console.log('New employee data inserted successfully.')
    return res.rowCount === 1
  } catch (err) {
    console.log('Inserting data error:', err)
  }
  pool.end()
}

async function employeesForSpecificDateRange(start, end) {
  try {
    const query = `
        SELECT *
        FROM employees
        WHERE (DATE_TRUNC('day', COALESCE(TO_TIMESTAMP(NULLIF(clockin, 0) / 1000.0), TO_TIMESTAMP(NULLIF(clockout, 0) / 1000.0))) >= DATE_TRUNC('day', TO_TIMESTAMP($1 / 1000.0)))
          AND (DATE_TRUNC('day', COALESCE(TO_TIMESTAMP(NULLIF(clockin, 0) / 1000.0), TO_TIMESTAMP(NULLIF(clockout, 0) / 1000.0))) <= DATE_TRUNC('day', TO_TIMESTAMP($2 / 1000.0) + INTERVAL '1 day - 1 second'));
        `
    const { rows } = await pool.query(query, [start, end])

    console.log('Get employeesForSpecificDateRange data successfully.')

    return rows
  } catch (err) {
    console.log('Get employeesForSpecificDateRange data err:', err)
  }
  pool.end()
}

async function employeesForSpecificDate(date) {
  try {
    const query = `
      SELECT *
      FROM employees
      WHERE DATE_TRUNC('day', COALESCE(TO_TIMESTAMP(NULLIF(clockin, 0) / 1000.0), TO_TIMESTAMP(NULLIF(clockout, 0) / 1000.0))) = DATE_TRUNC('day', TO_TIMESTAMP($1 / 1000.0));
      `

    const { rows } = await pool.query(query, [date])

    console.log('Get employeesForSpecificDate data successfully.')

    return rows
  } catch (err) {
    console.log('Get employeesForSpecificDate data err:', err)
  }
  pool.end()
}

async function findEmployeeExistOrNot(employeenumber) {
  try {
    const sql = 'SELECT * FROM employees WHERE employeenumber = $1'
    const { rows } = await pool.query(sql, [employeenumber])
    if (rows.length > 0) {
      console.log('Employee exist in database.')
    }
    return rows
  } catch (err) {
    console.log('No employee in database:', err)
  }
  pool.end()
}

async function fillInClockoutData(id, clockOut) {
  try {
    const clockInSQL = 'UPDATE employees SET clockout = $2 WHERE id = $1'
    const res = await pool.query(clockInSQL, [id, clockOut])
    return res.rowCount === 1
  } catch (err) {
    console.log('Update clockout data err:', err)
  }
  pool.end()
}

async function fillInClockinData(id, clockIn) {
  try {
    const clockOutSQL = 'UPDATE employees SET clockin = $2 WHERE id = $1'
    const res = await pool.query(clockOutSQL, [id, clockIn])
    return res.rowCount === 1
  } catch (err) {
    console.log('Update clockin data err:', err)
  }
  pool.end()
}

async function employeesWithNoClockout(startDate, endDate) {
  try {
    const query = `
      SELECT *
      FROM employees
      WHERE clockOut IS NULL
      AND  TO_TIMESTAMP( clockIn / 1000.0) >= TO_TIMESTAMP($1 / 1000.0)
      AND  TO_TIMESTAMP( clockIn / 1000.0) <= TO_TIMESTAMP($2 / 1000.0) + INTERVAL '1 day - 1 second';
    `
    const { rows } = await pool.query(query, [startDate, endDate])
    if (rows.length > 0) {
      console.log('Get no clockout employee data successfully.')
    }
    return rows
  } catch (err) {
    console.log('Get no clockout employee data err:', err)
  }
  pool.end()
}

async function employeesWithClockinEarliest(date) {
  try {
    const query = `
      SELECT *
      FROM employees
      WHERE clockin IS NOT NULL
        AND DATE_TRUNC('day', TO_TIMESTAMP(clockin / 1000.0)) = DATE_TRUNC('day', TO_TIMESTAMP($1 / 1000.0))
      ORDER BY clockin
      LIMIT 5;
    `
    const { rows } = await pool.query(query, [date])
    if (rows.length > 0) {
      console.log('Get clockin earliest employees data successfully.')
    }
    return rows
  } catch (err) {
    console.log('Get clockin earliest employees data err:', err)
  }
  pool.end()
}

module.exports = {
  fillInClockinData,
  fillInClockoutData,
  clockinAndClockout,
  findEmployeeExistOrNot,
  employeesWithNoClockout,
  employeesForSpecificDate,
  employeesWithClockinEarliest,
  employeesForSpecificDateRange
}
