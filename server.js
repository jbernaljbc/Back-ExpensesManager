var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var config = require('./config')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var port = process.env.PORT || 8080
var router = express.Router()

const Pool = require('pg').Pool
const pool = new Pool({
  user: config.user,
  host: config.host,
  database: config.database,
  password: config.password,
  port: config.port,
})

router.post('/expenses', function (req, res) {
  const { name, amount, user } = req.body
  pool.query('INSERT INTO expenses (name, amount, "user", created_at, paidup) VALUES ($1, $2, $3, now(), false)', [name, amount, user], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json({
      status: 'success'
    })
  })
})

router.post('/expenses/paid-up', (req, res) => {
  pool.query('UPDATE expenses SET paidup=true, paidup_created_at=now() WHERE paidup=false', [], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json({
      status: 'success'
    })
  })
})

router.get('/expenses/list', function (req, res) {
  pool.query("SELECT id, name, amount, \"user\", to_char(created_at at time zone 'utc' at time zone 'america/santiago','DD-MM-YYYY HH24:MI') as created_at FROM expenses WHERE paidup = false ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
})

app.use('/api', router)
app.listen(port)
console.log('Magic happens on port ' + port)