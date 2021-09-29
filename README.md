# Imapp

NodeJS functional async email IMAP client.

### Install
```
npm i imapp
```

### Usage

```js
const client = require('imapp')

async function run() {
  const imap = client({
    user: 'hello@5o.no',
    password: 'tester',
    host: 'secure.mailserver.com'
  })

  const box = await imap.connect()
  console.log(box)

  const result = await imap.search(['SEEN'])
  console.log({ result })

  const messages = await imap.fetch()
  imap.end()
}

run()
```

MIT Licensed. Enjoy!
