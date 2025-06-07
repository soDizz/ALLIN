import express, { type Request, type Response, type NextFunction } from 'express';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import type { ParamsDictionary } from 'express-serve-static-core';
import { type VestaBoardProps, type Theme, $Theme } from '@craft/vesta-board';

interface DBSchema {
  vestaConfig: VestaBoardProps | null;
}

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFile = path.join(__dirname, 'db.json');
const adapter = new JSONFile<DBSchema>(dbFile);
const defaultVestaConfig: VestaBoardProps = {
  columnCount: 10,
  lines: [{ text: 'Hello', align: 'center', color: '#FFFFFF', charset: ' abcdefghijklmnopqrstuvwxyz!@ ' }],
  blockShape: 'default',
  theme: 'default',
};
const db = new Low<DBSchema>(adapter, { vestaConfig: defaultVestaConfig });

async function initializeDatabase() {
  await db.read();
  let changed = false;
  if (db.data === null) {
    db.data = { vestaConfig: defaultVestaConfig };
    changed = true;
  } else {
    if (!db.data.vestaConfig) {
      db.data.vestaConfig = defaultVestaConfig;
      changed = true;
    }
  }
  if (changed) {
    await db.write();
  }
}

app.use(cors());
app.use(express.json());

const projectRoot = path.join(__dirname, '..');
const publicPath = path.join(projectRoot, 'public');
app.use(express.static(publicPath));

interface Client {
  id: number;
  res: Response;
}
let clients: Client[] = [];

interface SSEData {
  type: 'boardUpdate';
  payload: VestaBoardProps;
}

function sendEventToAllClients(data: SSEData) {
  console.log('==> sendEventToAllClients', clients.length);
  const eventString = `data: ${JSON.stringify(data)}\n\n`;

  for (const client of clients) {
    client.res.write(eventString);
  }
}

app.get('/events', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const clientId = Date.now();
    const newClient: Client = { id: clientId, res };
    clients.push(newClient);
    console.log(`Client ${clientId} connected for SSE`);

    await db.read();
    if (db.data?.vestaConfig) {
      res.write(`data: ${JSON.stringify({ type: 'boardUpdate', payload: db.data.vestaConfig })}\n\n`);
    }

    req.on('close', () => {
      clients = clients.filter(c => c.id !== clientId);
      console.log(`Client ${clientId} disconnected`);
    });
  } catch (error) {
    next(error);
  }
});

interface DefaultErrorResponse {
  message: string;
  error?: string;
}

/**
 * changeTheme
 */
app.post(
  '/theme',
  async (
    req: Request<ParamsDictionary, unknown, { theme: Theme }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const theme = $Theme.parse(req.body.theme);

      if (!theme) {
        res.status(400).json({ message: 'Invalid VestaBoardProps data' });
        return;
      }

      await db.read();

      if (db.data.vestaConfig) {
        const vestaConfig = db.data.vestaConfig;
        vestaConfig.theme = theme;
        await db.write();

        sendEventToAllClients({ type: 'boardUpdate', payload: vestaConfig });
        res.status(200).json({ message: 'theme data updated successfully' });
      } else {
        console.error('Database not initialized when trying to update Vesta config.');
        res.status(500).json({ message: 'Error: Database not initialized for /background' });
      }
    } catch (error) {
      next(error);
    }
  },
);

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const uiIndexPath = path.join(publicPath, 'index.html');
    if (fs.existsSync(uiIndexPath)) {
      res.sendFile(uiIndexPath);
    } else {
      res
        .status(404)
        .send(
          `UI file not found at ${uiIndexPath}. Ensure 'public' folder is in 'packages/server/' and contains 'index.html'. Or adjust 'publicPath' in server.ts.`,
        );
    }
  } catch (error) {
    next(error);
  }
});

app.use((err: Error, req: Request, res: Response<DefaultErrorResponse>, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.listen(port, async () => {
  try {
    await initializeDatabase();
    console.log(`Server listening at http://localhost:${port}`);
    console.log(`SSE endpoint at http://localhost:${port}/events`);
    console.log(`POST Vesta data to http://localhost:${port}/theme`);
    console.log(`UI available at http://localhost:${port}/`);
    console.log('\nDevelopment mode: npm run dev (or tsup equivalent)');
    console.log('Production mode: npm run build && npm start (or tsup equivalent)');
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
});
