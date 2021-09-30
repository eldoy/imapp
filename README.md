# Imapp

NodeJS functional async email IMAP client. Based on [node imap](https://github.com/mscdex/node-imap) and [mailparser.](https://github.com/nodemailer/mailparser)

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

  // Returns an email box object
  const box = await imap.connect({ name: 'INBOX' })

  {
    name: 'INBOX',
    flags: [
      '\\Answered', '\\Flagged',
      '\\Deleted',  '\\Seen',
      '\\Draft',    '$NotJunk',
      '$Junk',      'Junk',
      'NotJunk'
    ],
    readOnly: true,
    uidvalidity: 1508591807,
    uidnext: 568,
    permFlags: [],
    keywords: [],
    newKeywords: false,
    persistentUIDs: true,
    nomodseq: false,
    messages: { total: 109, new: 0 },
    highestmodseq: '1694'
  }

  // Returns an array of matching message UIDs
  const result = await imap.search(['SEEN'])

  [ 24,  25, 129, 130, 131, 132, 133, 137 ]

  // Returns an array of parsed emails
  const messages = await imap.fetch()

  // with options
  const messages = await imap.fetch({
    query: '1:5',
    bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)'
  })

  // Close connection
  imap.end()
}

run()
```

MIT Licensed. Enjoy!
