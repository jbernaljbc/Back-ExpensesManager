var express = require('express')
var app = express()
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var port = process.env.PORT || 8080
var router = express.Router()

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: '192.168.0.22',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
})

router.get('/', function (req, res) {
  res.json({ message: 'hooray! welcome to our api!' })
})

router.post('/expenses', function (req, res) {
  const { name, amount, user } = req.body
  pool.query('INSERT INTO expenses (name, amount, "user") VALUES ($1, $2, $3)', [name, amount, user], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json({
      status: 'success'
    })
  })
})

router.get('/expenses/list', function (req, res) {
  pool.query('SELECT * FROM expenses ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
})

app.use('/api', router)
app.listen(port)
console.log('Magic happens on port ' + port)