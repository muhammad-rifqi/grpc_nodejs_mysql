const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = './service.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const serviceProto = grpc.loadPackageDefinition(packageDefinition).UserService;

const client = new serviceProto('localhost:50051', grpc.credentials.createInsecure());

client.GetUser({ id: 1 }, (err, response) => {
  if (err) console.error(err);
  else console.log('User:', response);
});

client.CreateUser({ name: 'John Doe', email: 'john@example.com' }, (err, response) => {
  if (err) console.error(err);
  else console.log('Created User:', response);
});