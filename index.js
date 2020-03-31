const express = require('express')
const monk = require('monk')
const pages = require('./pages')

const port = process.env.PORT || 3000
const host = 'http://localhost:3000' || process.env.HOST
const dbName = process.env.DB_NAME || 'pick-one'
const connectionString =
  process.env.CONNECTION_STRING || 'mongodb://127.0.0.1:27017'

const collection = monk(`${connectionString}/${dbName}`).get('data')

const app = express()

app.use(express.static('public'))
app.use(express.json())

app.post('/createForm', (req, res) => {
  console.log(req.body)

  collection
    .insert(req.body)
    .then(result => {
      console.log(result)
      const id = result._id
      res.send(`${host}/form/${id}`)
    })
    .catch(err => {
      res.status(500).send()
    })
})

app.get('/form/:id', (req, res) => {
  const id = req.params.id
  collection.findOne({ _id: id }).then(result => {
    res.send(pages.form(result))
  })
})

app.post('/submitForm', (req, res) => {
  if (req.body && req.body.results) {
    const data = req.body

    collection.findOne({ _id: data.id }).then(init => {
      console.log(init)

      if (!init.results) {
        init.results = []
      }

      init.results.push(...data.results)

      collection.update({ _id: data.id }, { $set: init })

      res.send(init)
    })
  } else {
    collection.findOne({ _id: req.body.id }).then(init => {
      res.send(init)
    })
  }
})

app.use('/', (req, res) => {
  res.send(pages.home)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
