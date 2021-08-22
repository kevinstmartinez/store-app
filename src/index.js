import express from 'express'
import morgan from 'morgan'

import register from './routes/authentication.routes'
const app = express()

const port = 4000 || process.env.PORT

app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(require('./routes'))
app.use('/auth', register)


app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
