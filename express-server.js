const express = require('express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = './service.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const serviceProto = grpc.loadPackageDefinition(packageDefinition).UserService;

const grpcClient = new serviceProto('localhost:50051', grpc.credentials.createInsecure());

const app = express();
app.use(express.json());

app.get('/user/:id', (req, res) => {
  grpcClient.GetUser({ id: parseInt(req.params.id) }, (err, response) => {
    if (err) return res.status(500).send(err);
    res.json(response);
  });
});

app.post('/user', (req, res) => {
  const { name, email } = req.body;
  grpcClient.CreateUser({ name, email }, (err, response) => {
    if (err) return res.status(500).send(err);
    res.json(response);
  });
});

app.listen(3000, () => {
  console.log('Express server running on port 3000');
});