console.log('index.js loaded')

const formBuilder = document.getElementById('form-builder')

if (formBuilder) {
  console.log('form builder')
  formBuilder.innerHTML = form
}

const groupBy = (xs, key) => {
  return xs.reduce(function(rv, x) {
    ;(rv[x[key]] = rv[x[key]] || []).push(x)
    return rv
  }, {})
}

const form = `<div class="w-full p-10">
<div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="questions">
      Question
    </label>
    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="questions" type="text" placeholder="What would you like your question to be?">
  </div>
  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="answers">
      Answers
    </label>
    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="answers" type="text" placeholder="Separate possible answers with a comma">
    <p class="text-red-500 text-xs italic" id="error"></p>
  </div>
      <button class="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="button" onclick="createField()">
      Next Question
    </button>
</div>`

let questionList = []

const renderQuestions = () => {
  const html = `${questionList.map(q => {
    const answers = `<div class="py-4">${q.answers.map(a => {
      return `<span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">${a}</span>`
    })}</div>`

    return `<div class="px-10 text-lg"><div class="pb-4">${q.question}</div><div class="pb-4">${answers}</div></div>`
  })}`

  document.getElementById('results').innerHTML = html
}

const createField = () => {
  const question = document.getElementById('questions')
  const answers = document.getElementById('answers')
  const error = document.getElementById('error')

  console.log(question)
  console.log(answers)

  if (question.value && answers.value && answers.value.split(',').length > 1) {
    console.log('valid')

    questionList.push({
      question: question.value,
      answers: answers.value.split(','),
    })

    error.innerHTML = ''
    question.value = ''
    answers.value = ''

    renderQuestions()
  } else {
    error.innerHTML =
      'You must have at least two possible answers and a question'
  }
}

const createForm = () => {
  console.log('create form')

  if (questionList.length > 0) {
    fetch('/createForm', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ form: questionList }),
    })
      .then(response => response.text())
      .then(link => {
        console.log('Success:', link)

        document.getElementById(
          'form-builder'
        ).innerHTML = `<p class="p-10 text-center text-lg">Form Successfully created, you can share <a class="text-blue-500 font-bold" href="${link}">This Link</a> to submit and view submissions</p>`

        document.getElementById('createForm').outerHTML = ''
      })
      .catch(error => {
        document.getElementById(
          'form-builder'
        ).innerHTML = `<p class="p-10 text-red-500 text-center text-lg">An Error Occurred: ${error}</p>`
      })
  }
}

const answerCountToHtml = answerCount => {
  console.log(answerCount)
  return Object.keys(answerCount)
    .sort((a, b) => (answerCount[a] > answerCount[b] ? -1 : 1))
    .map(
      key =>
        `<div class="pb-2">
        <span class="font-bold py-5">${answerCount[key]}</span>
          <span class="py-5">${key}</span>
        </div>`
    )
    .join('')
}

const questionResultToHtml = result => {
  return result
    .map(
      el => `<div class="pb-5">
          <p class="text-lg">${el.question}</p>
        ${answerCountToHtml(el.occurence)}
        </div>
    `
    )
    .join('')
}

const submitForm = () => {
  console.log('submit form')

  var body = document.getElementById('layout')

  const data = []

  document.querySelectorAll('select').forEach(el => {
    data.push({
      id: el.id,
      value: el.value,
    })
  })

  console.log(data)

  fetch('/submitForm', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: document.getElementById('id-holder').innerText,
      results: data,
    }),
  })
    .then(response => response.json())
    .then(json => {
      console.log('Success:', json)

      var results = []
      json.form
        .map(f => json.results.filter(r => r.id == f.question))
        .forEach(q => {
          var occurrence = function(array) {
            'use strict'
            var result = {}
            if (array instanceof Array) {
              array.forEach(function(v, i) {
                if (!result[v]) {
                  result[v] = [i]
                } else {
                  result[v].push(i)
                }
              })
              Object.keys(result).forEach(function(v) {
                result[v] = result[v].length
              })
            }
            return result
          }

          var question = q[0].id

          var answers = q.map(q => q.value)

          results.push({ question, occurence: occurrence(answers) })
        })

      console.log(results)

      body.innerHTML = questionResultToHtml(results)

      // document.getElementById('createForm').outerHTML = ''
    })
    .catch(error => {
      body.innerHTML = `<p class="p-10 text-red-500 text-center text-lg">An Error Occurred: ${error}</p>`
    })
}

const viewResults = () => {
  console.log('submit form')

  var body = document.getElementById('layout')

  const data = []

  document.querySelectorAll('select').forEach(el => {
    data.push({
      id: el.id,
      value: el.value,
    })
  })

  console.log(data)

  fetch('/submitForm', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: document.getElementById('id-holder').innerText,
    }),
  })
    .then(response => response.json())
    .then(json => {
      console.log('Success:', json)

      var results = []
      json.form
        .map(f => json.results.filter(r => r.id == f.question))
        .forEach(q => {
          var occurrence = function(array) {
            'use strict'
            var result = {}
            if (array instanceof Array) {
              array.forEach(function(v, i) {
                if (!result[v]) {
                  result[v] = [i]
                } else {
                  result[v].push(i)
                }
              })
              Object.keys(result).forEach(function(v) {
                result[v] = result[v].length
              })
            }
            return result
          }

          var question = q[0].id

          var answers = q.map(q => q.value)

          results.push({ question, occurence: occurrence(answers) })
        })

      console.log(results)

      body.innerHTML = `<div class="p-10"><h1 class="text-xl pb-10">Results: </h1>${questionResultToHtml(
        results
      )}</div>`

      // document.getElementById('createForm').outerHTML = ''
    })
    .catch(error => {
      body.innerHTML = `<p class="p-10 text-red-500 text-center text-lg">An Error Occurred: ${error}</p>`
    })
}
