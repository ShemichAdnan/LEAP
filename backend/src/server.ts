import 'dotenv/config';
import { createServer } from 'http';
import pino from 'pino';
import app from './app.js';

const logger = pino({ transport: { target: 'pino-pretty' } });

const httpServer = createServer(app);

const PORT = Number(process.env.PORT || 4000);
httpServer.listen(PORT, () => logger.info(`API on http://localhost:${PORT}`));
