import { app } from './app.js';
import { env } from './config/env.js';
import { pool } from './config/db.js';
import { logger } from './utils/logger.js';
import { runMigrations } from './db/migrate.js';
import { seedDatabase } from './db/seed.js';

const startServer = async () => {
  try {
    logger.info('Connecting to PostgreSQL database...');
    const client = await pool.connect();
    logger.info('Database connection established successfully.');
    client.release();

    // Auto-run migrations
    logger.info('Verifying database schema tables...');
    await runMigrations();

    // Check if profile exists, if not auto-seed
    const checkRes = await pool.query('SELECT COUNT(*) FROM profile');
    const profileCount = parseInt(checkRes.rows[0].count, 10);
    if (profileCount === 0) {
      logger.info('No profile records found. Auto-seeding initial database...');
      await seedDatabase();
    } else {
      logger.info(`Database contains ${profileCount} profile record(s). Ready to serve.`);
    }

    const port = parseInt(env.PORT, 10) || 5000;
    app.listen(port, () => {
      logger.info(`Portfolio Backend REST API listening on http://localhost:${port}`);
      logger.info(`Environment: ${env.NODE_ENV}`);
      logger.info(`Health check: http://localhost:${port}/api/health`);
    });
  } catch (err: any) {
    logger.error('Failed to start server due to fatal startup error:', err);
    // Don't crash immediately so Docker or supervisors can report errors cleanly
    process.exit(1);
  }
};

startServer();
