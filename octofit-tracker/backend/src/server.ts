import express, { type ErrorRequestHandler } from 'express';
import { connectDatabase } from './config/database';
import apiRouter from './routes/api';

const port = Number(process.env.PORT) || 8000;
const codespaceName = process.env.CODESPACE_NAME;
export const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

export const app = express();

app.use(express.json());

const frontendOrigins = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  ...(codespaceName ? [`https://${codespaceName}-5173.app.github.dev`] : []),
]);

app.use((request, response, next) => {
  const origin = request.get('origin');

  if (origin && !frontendOrigins.has(origin)) {
    response.status(403).json({ error: 'Origin not allowed' });
    return;
  }

  if (origin) {
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Vary', 'Origin');
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }

  if (request.method === 'OPTIONS') {
    response.sendStatus(204);
    return;
  }

  next();
});

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'octofit-tracker-api', apiBaseUrl });
});

app.use(apiRouter);

app.use('/api', (_request, response) => {
  response.status(404).json({ error: 'API endpoint not found' });
});

const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, _next) => {
  console.error('API request failed:', error);
  response.status(500).json({ error: 'Internal server error' });
};

app.use(errorHandler);

export async function startServer(): Promise<void> {
  await connectDatabase();

  await new Promise<void>((resolve, reject) => {
    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`OctoFit Tracker API listening at ${apiBaseUrl}`);
      resolve();
    });

    server.once('error', reject);
  });
}
