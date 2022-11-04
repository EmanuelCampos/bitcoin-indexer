import RpcClient from "bitcoind-rpc";
import zmq from "zeromq";
import dotenv from "dotenv";

dotenv.config();

const SOCKET_ADDRESS = "tcp://127.0.0.1:3600"

const config = {
    protocol: 'http',
    host: 'localhost',
    port: '38332',
    user: process.env.RPC_USER,
    pass: process.env.RPC_PASSWORD,
};

export const rpc = new RpcClient(config);

export const connectZeroMQ = () => {
    const socket = zmq.socket('sub');

    socket.connect(SOCKET_ADDRESS);

    console.log("Worker connected to port 3600")

    socket.subscribe('');

    return socket;
}