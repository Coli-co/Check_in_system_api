class GetSuccess extends Error {
  constructor(data) {
    super()
    this.statusCode = 200
    this.data = data
  }
}
class CreatedSuccess extends Error {
  constructor(data) {
    super()
    this.statusCode = 201
    this.data = data
  }
}

class BadRequestError extends Error {
  constructor(message) {
    super(message)
    this.name = 'BadRequestError'
    this.statusCode = 400
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message)
    this.name = 'NotFoundError'
    this.statusCode = 404
  }
}

class InternalServerError extends Error {
  constructor(message) {
    super(message)
    this.name = 'InternalServerError'
    this.statusCode = 500
  }
}

module.exports = {
  GetSuccess,
  CreatedSuccess,
  BadRequestError,
  NotFoundError,
  InternalServerError
}
