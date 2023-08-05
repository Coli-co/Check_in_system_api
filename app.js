const express = require('express')
const app = express()
const port = 3000

app.get('/test', (req, res) => {
  console.log('Test api.')
  res.send('Hello world!')
})

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`)
})
