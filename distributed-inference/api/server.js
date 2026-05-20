const express = require('express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const app = express();

app.use(express.json());

const PROTO_PATH = path.join(__dirname, "../proto/inference.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH);

const proto = grpc.loadPackageDefinition(packageDefinition).inference;

const PORT = process.env.PORT || 3000;
const WORKER_GRPC_URL = process.env.WORKER_GRPC_URL || "localhost:50051";

const workers = [
  new proto.InferenceService(
    "localhost:50051",
    grpc.credentials.createInsecure()
  ),
  new proto.InferenceService(
    "localhost:50052",
    grpc.credentials.createInsecure()
  ),
];

let currentWorker = 0;

app.post("/infer", (req, res) => {
  const text = req.body.text;

  const worker = workers[currentWorker];

    currentWorker = (currentWorker + 1) % workers.length;

    worker.Infer({ text }, (err, response) => {
    if (err) {
        console.error(err);

        return res.status(500).json({
        error: "Worker failed",
        });
    }

    res.json(response);
    });
});

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
  console.log(`Forwarding inference requests to ${WORKER_GRPC_URL}`);
});
