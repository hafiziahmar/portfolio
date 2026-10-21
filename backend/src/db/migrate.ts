import fs from 'fs';
import path from 'path';
import { pool } from '../config/db.js';
import { logger } from '../utils/logger.js';

export const runMigrations = async (): Promise<void> => {
  try {
    logger.info('Starting database migrations...');
    const migrationFilePath = path.resolve(process.cwd(), 'src', 'db', 'migrations', '001_init.sql');
    const fallbackPath = path.resolve(process.cwd(), 'dist', 'db', 'migrations', '001_init.sql');
    
    const targetPath = fs.existsSync(migrationFilePath) ? migrationFilePath : fallbackPath;
    const sql = fs.readFileSync(targetPath, 'utf-8');

    await pool.query(sql);
    logger.info('Database migrations applied successfully.');
  } catch (error) {
    logger.error('Failed to run database migrations:', error);
    throw error;
  }
};

// Allow direct execution
if (process.argv[1] && process.argv[1].includes('migrate')) {
  runMigrations()
    .then(() => {
      logger.info('Migration process finished.');
      process.exit(0);
    })
    .catch((err) => {
      logger.error('Migration failed with error:', err);
      process.exit(1);
    });
}
