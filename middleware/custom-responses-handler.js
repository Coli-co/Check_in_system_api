class GetSuccessResponse {
  constructor(data) {
    this.statusCode = 200
    this.data = data
  }
}
class CreatedSuccessResponse {
  constructor(message) {
    this.statusCode = 201
    this.message = message
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

module.exports = {
  GetSuccessResponse,
  CreatedSuccessResponse,
  BadRequestError,
  NotFoundError
}
