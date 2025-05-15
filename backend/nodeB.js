const express = require('express');
const { trace, context, SpanStatusCode } = require('@opentelemetry/api');
const tracer = trace.getTracer('node-b');

const app = express();
const PORT = 3002;

let database = [];

app.use(express.json());

app.post('/process', async (req, res) => {
  const span = tracer.startSpan('node-b-process');
  try {
    span.setAttributes({
      'request.body': JSON.stringify(req.body),
      'service.name': 'node-b'
    });

    console.log('Request received at Node B:', req.body);

    if (!req.body.name || !req.body.email) {
      const error = new Error('Missing required fields');
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
      return res.status(400).json({
        message: 'Processing failed at Node B',
        error: error.message
      });
    }

    database.push(req.body);
    console.log('Data saved to database:', req.body);

    span.setStatus({ code: SpanStatusCode.OK });
    res.json({
      message: 'Data processed successfully through Node B',
      data: req.body
    });
  } catch (error) {
    span.recordException(error);
    span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
    res.status(500).json({
      message: 'Processing failed at Node B',
      error: error.message
    });
  } finally {
    span.end();
  }
});

app.post('/fail-process', async (req, res) => {
  const span = tracer.startSpan('node-b-fail-process');
  try {
    console.log('Simulating failure at Node B');
    throw new Error('Simulated failure at Node B');
  } catch (error) {
    span.recordException(error);
    span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
    res.status(500).json({ message: 'Simulated failure at Node B' });
  } finally {
    span.end();
  }
});

app.post('/fail-db', async (req, res) => {
  const span = tracer.startSpan('node-b-fail-db');
  try {
    console.log('Simulating database failure');
    throw new Error('Simulated database failure');
  } catch (error) {
    span.recordException(error);
    span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
    res.status(500).json({ message: 'Simulated database failure' });
  } finally {
    span.end();
  }
});

app.listen(PORT, () => {
  console.log(`Node B server running on http://localhost:${PORT}`);
  console.log('Mock database initialized');
});
