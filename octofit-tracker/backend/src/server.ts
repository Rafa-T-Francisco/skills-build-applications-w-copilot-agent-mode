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
