import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import pino from 'pino';
import { createServer } from 'http';

const app = express();
const logger = pino({ transport: { target: 'pino-pretty' } });

app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

import authRoutes from './routes/auth.routes.js';
app.use('/auth', authRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const httpServer = createServer(app);

const PORT = Number(process.env.PORT || 4000);
httpServer.listen(PORT, () => logger.info(`API on http://localhost:${PORT}`));
