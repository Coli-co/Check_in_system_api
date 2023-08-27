const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const routes = require('./routes')
const {
  GetSuccessResponse,
  CreatedSuccessResponse,
  BadRequestError,
  NotFoundError
} = require('./middleware/custom-responses-handler')

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.json())

app.use(routes)

// Error middleware
app.use((err, req, res, next) => {
  if (err instanceof BadRequestError || err instanceof NotFoundError) {
    return res.status(err.statusCode).json({ error: err.message })
  } else if (err instanceof GetSuccessResponse) {
    return res.status(err.statusCode).json({ data: err.data })
  } else if (err instanceof CreatedSuccessResponse) {
    return res.status(err.statusCode).json({ message: err.message })
  } else {
    console.error(err)
    return res.status(500).json({ error: 'An unexpected error occurred' })
  }
})

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`)
})
