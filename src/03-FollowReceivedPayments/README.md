## Creating an account
```bash
$ node make_account.js
New key pair created!
  Account ID: GB7JFK56QXQ4DVJRNPDBXABNG3IVKIXWWJJRJICHRU22Z5R5PI65GAK3
  Secret: SCU36VV2OYTUMDSSU4EIVX4UUHY3XC7N44VL4IJ26IOG6HVNC7DY5UJO
$
```

## Funding your account

```bash
$ curl "https://friendbot.stellar.org/?addr={your_address}"
```
If the request succeeds, you should see a response like:
```json
{
  "hash": "ed9e96e136915103f5d8978cbb2036628e811f2c59c4c3d88534444cf504e360",
  "result": "received",
  "submission_result": "000000000000000a0000000000000001000000000000000000000000"
}
```

## Following payments using `curl`

To follow new payments connected to your account you simply need to send the `Accept: text/event-stream` header to the `/payments` endpoint.

As a result you will see something like:
```bash
retry: 1000
event: open
data: "hello"

id: 713226564145153
data: {"_links":{"effects":{"href":"/operations/713226564145153/effects/{?cursor,limit,order}","templated":true},
       "precedes":{"href":"/operations?cursor=713226564145153\u0026order=asc"},
       "self":{"href":"/operations/713226564145153"},
       "succeeds":{"href":"/operations?cursor=713226564145153\u0026order=desc"},
       "transactions":{"href":"/transactions/713226564145152"}},
       "account":"GB7JFK56QXQ4DVJRNPDBXABNG3IVKIXWWJJRJICHRU22Z5R5PI65GAK3",
       "funder":"GBS43BF24ENNS3KPACUZVKK2VYPOZVBQO2CISGZ777RYGOPYC2FT6S3K",
       "id":713226564145153,
       "paging_token":"713226564145153",
       "starting_balance":"10000",
       "type_i":0,
       "type":"create_account"}
```
Every time you receive a new payment you will get a new row of data. Payments is not the only endpoint that supports streaming. You can also stream transactions `/transactions` and operations `/operations`.

## Following payments using EventStream
  **Warning!** EventSource object does not reconnect for certain error types so it can stop working. If you need a reliable streaming connection please use our SDK.

Now, run our script: node stream_payments.js. You should see following output:

```bash
New payment:
{
  _links: {
    self: {
      href: 'https://horizon-testnet.stellar.org/operations/1451501377556481'
    },
    transaction: {
      href: 'https://horizon-testnet.stellar.org/transactions/21d98ad306fc4579ce7d42852ec69d2446c1fa94b64115f21381bb9b33c9a49a'
    },
    effects: {
      href: 'https://horizon-testnet.stellar.org/operations/1451501377556481/effects'
    },
    succeeds: {
      href: 'https://horizon-testnet.stellar.org/effects?order=desc&cursor=1451501377556481'
    },
    precedes: {
      href: 'https://horizon-testnet.stellar.org/effects?order=asc&cursor=1451501377556481'
    }
  },
  id: '1451501377556481',
  paging_token: '1451501377556481',
  transaction_successful: true,
  source_account: 'GAIH3ULLFQ4DGSECF2AR555KZ4KNDGEKN4AFI4SU2M7B43MGK3QJZNSR',
  type: 'create_account',
  type_i: 0,
  created_at: '2022-01-04T22:41:59Z',
  transaction_hash: '21d98ad306fc4579ce7d42852ec69d2446c1fa94b64115f21381bb9b33c9a49a',
  starting_balance: '10000.0000000',
  funder: 'GAIH3ULLFQ4DGSECF2AR555KZ4KNDGEKN4AFI4SU2M7B43MGK3QJZNSR',
  account: 'GB7JFK56QXQ4DVJRNPDBXABNG3IVKIXWWJJRJICHRU22Z5R5PI65GAK3'
}
```

## Testing it out
Get the `sequence` field from the `/accounts` endpoint.
```bash
$ curl "https://horizon-testnet.stellar.org/accounts/GB7JFK56QXQ4DVJRNPDBXABNG3IVKIXWWJJRJICHRU22Z5R5PI65GAK3"
```

`sequence`: `"1451501377552384"`

Replace the `sequence` field in `make_payment.js`.

Run `node make_payment.js`

After running this script you should see a signed transaction blob. To submit this transaction we send it to Horizon or Stellar-Core. But before we do, let’s open a new console and start our previous script by `node stream_payments.js`.

Now to send a transaction just use Horizon:

```bash
curl -H "Content-Type: application/json" -X POST -d '{"tx":"AAAAAgAAAAB+kqu+heHB1TFrxhuALTbRVSL2slMUoEeNNaz2PXo90wAAAGQABSgiAAAAAQAAAAEAAAAAAAAAAAAAAABh+BSGAAAAAAAAAAEAAAAAAAAAAAAAAAC72pGCWal7zYTBLqqKHpMRiysKYMvJo5aPtEfMIlgNNgAAAAA7msoAAAAAAAAAAAE9ej3TAAAAQD3cet4ykfu2nuApaHEXp6vom5I3g1Kvnp26U82EXkLwgtqXkrNa7X+p/ZG/vsgp2by+FICLjqUGOZu59t33OAU="}' "https://horizon-testnet.stellar.org/transactions"
```

You should see a new payment in a window running `stream_payments.js` script.
