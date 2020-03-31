const layout = content => `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pick One</title>
</head>

<body>
  ${content}
</body>
<link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet">
<script src="/index.js"></script>

</html>`

const home = layout(`
<h1 class="text-xl px-10 pt-10">Build your Form</h1>
  <div id="form-builder"></div>
  <div id="results"></div>
<div class="py-5 px-10">
  <button id="createForm" class="shadow bg-green-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="button" onclick="createForm()">
  Build My Form
</button>
</div>  
`)

const form = ({ form, _id }) =>
  console.log(form) ||
  layout(`
  <div id="layout">
  <div class="px-10 my-5 text-xl"><h1 id="id-holder" class="text-lg pb-2">${_id}</h1></div>
  ${form
    .map(
      q => `<div class="px-10 my-5"><h1 class="text-xl pb-2">${
        q.question
      }</h1><div class="inline-block relative">
  <select id="${
    q.question
  }" class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
    ${q.answers.map(a => `<option>${a}</option>`).join('')}
  </select>
  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
  </div>
</div></div>`
    )
    .join('')}

    <div class="px-10 my-5">
    <button id="createForm" class="shadow bg-green-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="button" onclick="submitForm()">
      Submit
  </button>
  <button id="createForm" class="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="button" onclick="viewResults()">
  View Results
</button>
</div>
</div>
`)

module.exports = {
  layout,
  home,
  form,
}
