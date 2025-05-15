// backend/tracing.js
const opentelemetry = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

// Use the BasicTracerProvider from the API package
const { BasicTracerProvider } = require('@opentelemetry/sdk-trace-base');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');

const provider = new BasicTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'demo-application',
  }),
});

const exporter = new OTLPTraceExporter({
  url: 'https://common-tempo-staging.thewitslab.com/api/traces'
});

provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.register();

console.log('Tracing initialized');

// Graceful shutdown
process.on('SIGTERM', () => {
  provider.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});

module.exports = provider;