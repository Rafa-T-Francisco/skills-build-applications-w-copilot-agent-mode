import { startServer } from './server';

void startServer().catch((error: unknown) => {
  console.error('Failed to start OctoFit Tracker API:', error);
  process.exitCode = 1;
});
