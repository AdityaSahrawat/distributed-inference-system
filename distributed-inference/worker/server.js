const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const { spawn } = require('child_process');

const PROTO_PATH = path.join(__dirname, "../proto/inference.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH);

const proto = grpc.loadPackageDefinition(packageDefinition).inference;

const GRPC_PORT = process.env.GRPC_PORT || 50051;

const workerName = process.env.WORKER_NAME || "unknown-worker";

function infer(call, callback) {
  const text = call.request.text;

  console.log(`[${workerName}] Received request:`, text);

  callback(null, {
    result: `${workerName} processed: ${text}`,
  });
}

const server = new grpc.Server();

server.addService(proto.InferenceService.service, {
  Infer: infer,
});

server.bindAsync(
  `0.0.0.0:${GRPC_PORT}`,
  grpc.ServerCredentials.createInsecure(),
  (err) => {
    if (err) {
      console.error("Failed to start worker gRPC server:", err);
      process.exit(1);
    }

    console.log(`Worker gRPC server running on port ${GRPC_PORT}`);
  }
);
