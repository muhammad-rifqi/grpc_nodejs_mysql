const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mysql = require('mysql');

const PROTO_PATH = './service.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const serviceProto = grpc.loadPackageDefinition(packageDefinition).UserService;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'testdb',
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL!');
});

const getUser = (call, callback) => {
  const { id } = call.request;
  db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
    if (err) return callback(err);
    if (results.length === 0) return callback(null, {});
    const user = results[0];
    callback(null, { id: user.id, name: user.name, email: user.email });
  });
};

const createUser = (call, callback) => {
  const { name, email } = call.request;
  db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (err, result) => {
    if (err) return callback(err);
    callback(null, { id: result.insertId, name, email });
  });
};

const server = new grpc.Server();
server.addService(serviceProto.service, { GetUser: getUser, CreateUser: createUser });
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  console.log('gRPC server running on port 50051');
  server.start();
});