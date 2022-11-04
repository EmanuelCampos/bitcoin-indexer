import { rpc } from '../zmq';

import { insertTransaction } from '../modules/blockchain/insertTransaction';
import { insertBlock } from '../modules/blockchain/insertBlock';

const getRawBlock = (message) => {
    rpc.getBlock(message.toString('hex'), (err, data) =>  {
        if(err !== null) return;
        insertBlock(data.result);
    });
}

const decodeRawTXN = (message) => {
    rpc.decodeRawTransaction(message.toString('hex'), (err, data) => {
        if(err !== null) return;
        insertTransaction(data.result);
    });
}

export const parseTransaction = (topic, message) => {
    if(topic.toString() === 'rawtx') {
        decodeRawTXN(message);
    } else if(topic.toString() === 'hashblock') { 
        getRawBlock(message);
    }
};