const Handlebars = require('handlebars')
const fs = require('fs')
const path = require('path')
const beautify = require('js-beautify').js_beautify

let initialized = null
let apiTemplate = null

// register common helpers
Handlebars.registerHelper('toLowerCase', function (word) {
  return word.toLowerCase()
})
Handlebars.registerHelper('toUpperCase', function (word) {
  return word.toUpperCase()
})
Handlebars.registerHelper('brackets', function (word) {
  return `{${word}}`
})
const methods = fs.readFileSync(path.join(__dirname, './template/methods.hbs'), 'utf-8')
Handlebars.registerPartial('methods', methods)

// initialize language generation
function initializeTS () {
  if (initialized !== 'ts') {
    apiTemplate = fs.readFileSync(path.join(__dirname, './template/api.ts.hbs'), 'utf-8')
    const method = fs.readFileSync(path.join(__dirname, './template/method.ts.hbs'), 'utf-8')
    Handlebars.registerPartial('method', method)
  }
}

function initializeJS () {
  if (initialized !== 'js') {
    apiTemplate = fs.readFileSync(path.join(__dirname, './template/api.hbs'), 'utf-8')
    const method = fs.readFileSync(path.join(__dirname, './template/method.hbs'), 'utf-8')
    Handlebars.registerPartial('method', method)
  }
}

// actual codegen
function compileJs (data) {
  let template = Handlebars.compile(apiTemplate)(data)
  template = beautify(template, {indent_size: 2, max_preserve_newlines: -1})
  return template
}

function compileTs (data) {
  return Handlebars.compile(apiTemplate)(data)
}

module.exports = function (data, typescript = false) {
  if (typescript) {
    initializeTS()
    return compileTs(data)
  } else {
    initializeJS()
    return compileJs(data)
  }
}
