const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const routes = require('./routes')
const {
  GetSuccess,
  CreatedSuccess,
  BadRequestError,
  NotFoundError,
  InternalServerError
} = require('./middleware/custom-responses-handler')

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.json())

app.use(routes)

// Error middleware
app.use((err, req, res, next) => {
  if (
    err instanceof BadRequestError ||
    err instanceof NotFoundError ||
    err instanceof InternalServerError
  ) {
    return res.status(err.statusCode).json({ error: err.message })
  } else if (err instanceof GetSuccess || err instanceof CreatedSuccess) {
    return res.status(err.statusCode).json({ data: err.data })
  } else {
    console.error(err)
    return res.status(500).json({ error: 'An unexpected error occurred' })
  }
})

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`)
})
