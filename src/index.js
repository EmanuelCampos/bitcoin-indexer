import Koa from 'koa';
import cors from 'koa-cors';
import Router from 'koa-router';

import { connectZeroMQ }from './zmq';
import { parseTransaction } from './core/parseTransaction';
import { syncBlocks } from './core/syncBlocks';
import { sequelize } from './database';
import { getByOpReturn } from './modules/blockchain/getByOpReturn';

const app = new Koa();

app.use(cors());

const router = new Router();

app.use(router.routes());
app.use(router.allowedMethods());

app.use(async ctx => {
  ctx.body = 'Bitcoin API';
});

router.get('/opreturn/:id', getByOpReturn)

app.listen(3000,async () => {
  console.log("Server running on 3000");


  // force: false, doesn't clean the database on each start
  await sequelize.sync({ force: false }).then(() => {
    console.log("Database connected!")
  });

  const socket = connectZeroMQ();

  socket.on('message', parseTransaction);

  syncBlocks();
})
