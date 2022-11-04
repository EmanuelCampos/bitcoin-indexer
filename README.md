# Bitcoin Indexer
The purpose of this repository is to catch blocks on signet blockchain and provide to the client side using a rest API.

# Getting new blocks
![An image of the diagram chart getting new blocks](https://imgur.com/WyqKYFc.png)

To get new blocks we are using ZeroMQ, so when the Bitcoind receive a new block/transactions a pub event happens to our node API then we catch it and store on the PostgreSQL as the flow above.

# Getting past blocks
![An image of the diagram chart getting past blocks](https://imgur.com/KHC8zor.png)

To get past blocks, at the moment when you start the server the application will go from the block 0 to the latest block on the blockchain searching for the missing blocks

> Note: we can change this to do the sync every x minutes

> Note: now we are syncing the blocks and transactions together, but going by the block, on the future maybe access each block and search for the missing transactions

# Requirements:
- A computer
- Node 16
- Bitcoin-cli with bitcoind

# How to setup
1. Clone the project on your machine.

## Setup the database
1. Download docker and docker-compose on your machine [here](https://docs.docker.com/compose/install/).
2. Run `docker-compose up -d` on the root.
3. Setup the Environment variables for Postgres(You can use the same on the .env.example docker is waiting for these ones)

## Setup the Node
1. Download [bitcoin-core]("https://bitcoin.org/pt_BR/download")
2. Setup your `bitcoin.conf` file to use signet and ZeroMQ emit sockets to `tcp://127.0.0.1:3600`, you can copy on `./examples/bitcoin.conf`, or follow [How to setup bitcoin.conf file](https://github.com/bitcoin/bitcoin/blob/master/doc/bitcoin-conf.md)
3. Setup the Environment Variable(.env), if you follow the example of `bitcoin.conf` on examples folder you can use the `.env.example`file on your `.env`
4. Run the node on your terminal using `bitcoind -signet -daemon`.

> Don't forget to setup the environment variables, as they are necessary to connect to the database and it is the way the application has access to rpc as well.

## Run the API
After do the steps above and had installed the packages only run the command below, that the API, subscription and sync will happen automatically:
```
yarn dev
```

## Getting the block data by OP_RETURN
To get the blocks you can go on your browser or Postman/Insomnia and use the endpoint to get all the transactions/blocks related to your OP_RETURN.

Method: GET
Endpoint: `http://localhost:3000/opreturn/:opreturn`

# Next Steps 
- [ ] Add tests for the RPC, endpoints, and sequelize.
- [ ] Create a syncronization second for the transactions maybe, now we are getting the transactions together with the blocks
- [ ] Improve observability adding more logs, Sentry, APM.
- [ ] Improve documentation, a good idea can be add Docusaurus or Swagger.
- [ ] Improve the queries, add indexes to have fast inserts, replicate-set for read operations
- [ ] Search alternatives for bitcoind-rpc it's deprecated.