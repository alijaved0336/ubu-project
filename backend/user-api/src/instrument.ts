// Import with `const Sentry = require("@sentry/nestjs");` if you are using CJS
import * as Sentry from "@sentry/nestjs"
import { nodeProfilingIntegration } from "@sentry/profiling-node";
const env = process.env.NODE_ENV || 'dev';
console.log("Enivroment is ", env)
if (env === 'production' || env === 'staging')
{
  Sentry.init({
    environment: env,
    dsn: "https://52f98ecf435829e6d93e4995dc3c3f45@o4508052710293504.ingest.us.sentry.io/4508063727157248",
    integrations: [
      nodeProfilingIntegration(),
    ],
    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,
    beforeSend(event, hint) {
      if (event.request && event.request.data) {
        if (typeof event.request.data === 'string') {
          const boundaryMatch = event.request.data.match(/^(------[^\r\n]+)/);
          if (boundaryMatch) {
            const boundary = boundaryMatch[1];
            const parts = event.request.data.split(boundary);
            const filteredParts = parts.filter((part) => !part.includes('name="files"'));
            if (filteredParts) event.request.data = boundary + filteredParts.join(boundary);
          }
        }
      }
      return event;
    },
  });
}