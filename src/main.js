const https = require('https')
const fs = require('fs')

const template = process.argv.slice(2)

function usage() {
  console.log('usage notes...')
  process.exit(0)
}

function download(template, done) {
  const url = `https://raw.githubusercontent.com/tricertc/editorconfig/master/templates/${template}.editorconfig`
  https.get(url, res => {
    let file
    switch (res.statusCode) {
      case 200:
        file = fs.createWriteStream('.editorconfig')
        res
          .on('data', chunk => file.write(chunk))
          .on('end', () => {
            file.end()
            done()
          })
        break
      default:
        done(new Error(`Failed (${res.statusCode}): ${res.statusMessage}`))
        break
    }
  })
}

if (!template.length) usage()

download(template, err => {
  if (err) return console.log(err)
  console.log('.editorconfig created')
})
