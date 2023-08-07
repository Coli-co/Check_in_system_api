const employeesWithClockinEarliestForSpecificDate = async (req, res) => {
  try {
    const { date } = req.query

    const query = `
    SELECT *
      FROM employees
      WHERE clockIn = $1
      ORDER BY clockIn ASC
      LIMIT 5;
      `
    const { rows } = await pool.query(query, [date])
    if (rows.length === 0) {
      return res.status(200).json({ data: [] })
    }
    return res.status(200).json({ data: rows })
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = employeesWithClockinEarliestForSpecificDate
