const {
  processEmployeeData,
  transStringToInteger
} = require('../helpers/employee-data-helper')

describe('processEmployeeData', () => {
  it('should process employee data correctly', () => {
    const data = [
      { employeenumber: 1, clockin: 1641345360000, clockout: 1641374400000 },
      { employeenumber: 2, clockin: 1541345360000, clockout: 1541346360000 }
    ]

    const result = processEmployeeData(data)

    expect(result).toEqual([
      {
        employeenumber: 1,
        clockin: 1641345360000,
        clockout: 1641374400000,
        totalWorkTime: 8.07,
        rest: 1.5
      },
      {
        employeenumber: 2,
        clockin: 1541345360000,
        clockout: 1541346360000,
        totalWorkTime: 0.28,
        rest: 1.5
      }
    ])
  })

  it('should process employee data correctly when clockin is null', () => {
    const data = [{ employeenumber: 5, clockin: null, clockout: 1641373980000 }]

    const result = processEmployeeData(data)

    expect(result).toEqual([
      {
        employeenumber: 5,
        clockin: null,
        clockout: 1641373980000,
        totalWorkTime: 0,
        rest: 1.5
      }
    ])
  })

  it('should process employee data correctly when clockout is null', () => {
    const data = [{ employeenumber: 3, clockin: 1641373980000, clockout: null }]

    const result = processEmployeeData(data)

    expect(result).toEqual([
      {
        employeenumber: 3,
        clockin: 1641373980000,
        clockout: null,
        totalWorkTime: 0,
        rest: 1.5
      }
    ])
  })
})

describe('transStringToInteger', () => {
  it('should transfer properties of clockin & clockout to integer type', () => {
    const data = [
      {
        employeenumber: 3,
        clockin: '1541373980000',
        clockout: '1541373980000'
      },
      { employeenumber: 4, clockin: '1641373980000', clockout: null },
      { employeenumber: 5, clockin: null, clockout: '1641373980000' }
    ]
    const result = transStringToInteger(data)
    expect(result).toEqual([
      {
        employeenumber: 3,
        clockin: 1541373980000,
        clockout: 1541373980000
      },
      { employeenumber: 4, clockin: 1641373980000, clockout: null },
      { employeenumber: 5, clockin: null, clockout: 1641373980000 }
    ])
  })
})
