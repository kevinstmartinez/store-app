const express = require('express')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')
//init
const app = express()
//sett
app.set('port', process.env.PORT || 4000)
app.set('views', path.join(__dirname, 'views'))
app.engine(
  '.hbs',
  exphbs({
    defaultLayout: 'main',
    //join directory
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars'),
  })
)
app.set('view engine', '.hbs')
//Middelwares
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json)
//Global variables
app.use((req, res, next) => {
  next()
})
//Routes
app.use(require('./routes'))
app.use(require('./routes/authentication'))
app.use('/links',require('./routes/links'))
//Public files
app.use(express.static(path.join(__dirname, 'public')))
//Starting server
app.listen(app.get('port'), () => {
  console.log('Server on Port', app.get('port'))
})
