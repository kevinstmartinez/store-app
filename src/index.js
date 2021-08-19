import express from 'express'
import morgan from 'morgan'
import cors from 'cors'


const app = express()

const port = 4000 || process.env.PORT

app.use(morgan)
app.use(express.json())

app.listen(port, () =>{
  console.log(`Listening on port ${port}`)
})
