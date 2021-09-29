const Imap = require('imap')
const simpleParser = require('mailparser').simpleParser

const DEFAULT_CONFIG = {
  tls: true,
  port: 993
}

const DEFAULT_SETTINGS = {
  name: 'INBOX'
}

const DEFAULT_OPTIONS = {
  query: '1:*',
  bodies: '',
  struct: true
}

module.exports = function(config = {}) {
  const server = new Imap({ ...DEFAULT_CONFIG, ...config })

  function connect(settings = {}) {
    settings = { ...DEFAULT_SETTINGS, settings }
    return new Promise(function(resolve, reject) {
      function open(err, box) {
        if (err) reject(err)
        resolve(box)
      }

      function ready() {
        server.openBox(settings.name.toUpperCase(), true, open)
      }

      server.once('ready', ready)
      server.connect()
    })
  }

  async function fetch(options = {}) {
    options = { ...DEFAULT_OPTIONS, ...options }
    const { query, bodies, struct } = options

    const messages = await new Promise(function(resolve, reject) {
      const jobs = []

      function message(msg, n) {
        console.log('Message #%d', n)
        msg.on('body', body)
      }

      function body(stream) {
        jobs.push(simpleParser(stream))
      }

      function end() {
        resolve(jobs)
      }

      const f = server.seq.fetch(query, { bodies, struct })
      f.on('message', message)
      f.once('end', end)
    })

    return Promise.all(messages)
  }

  function search(criteria) {
    return new Promise(function(resolve, reject) {
      function search(err, results) {
        if (err) reject(err)
        resolve(results)
      }
      server.search(criteria, search)
    })
  }

  function end() {
    return server.end()
  }

  return { server, connect, fetch, search, end }
}
