import * as cron from 'node-cron';
import { exec } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const KEEP_DAYS = 7;
const BACKUP_DIR = path.join(__dirname, '..', 'backups');

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set in .env');
  process.exit(1);
}

function runBackup(): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });

    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, '-')
      .replace('T', '_')
      .slice(0, 19);

    const filename = `backup_${timestamp}.sql.gz`;
    const filepath = path.join(BACKUP_DIR, filename);

    const cmd = `pg_dump "${DATABASE_URL}" --no-owner --no-acl | gzip > "${filepath}"`;

    console.log(`[${new Date().toISOString()}] 🔄 Starting backup → ${filename}`);

    exec(cmd, { shell: '/bin/bash' }, (error) => {
      if (error) {
        console.error(`[${new Date().toISOString()}] ❌ Backup failed:`, error.message);
        return reject(error);
      }

      const size = fs.statSync(filepath).size;
      const sizeMb = (size / 1024 / 1024).toFixed(2);
      console.log(`[${new Date().toISOString()}] ✅ Backup saved: ${filename} (${sizeMb} MB)`);

      // Remove backups older than KEEP_DAYS days
      const cutoff = Date.now() - KEEP_DAYS * 24 * 60 * 60 * 1000;
      const files = fs.readdirSync(BACKUP_DIR).filter((f) => f.startsWith('backup_') && f.endsWith('.sql.gz'));

      let removed = 0;
      for (const file of files) {
        const filePath = path.join(BACKUP_DIR, file);
        const mtime = fs.statSync(filePath).mtimeMs;
        if (mtime < cutoff) {
          fs.unlinkSync(filePath);
          removed++;
        }
      }

      if (removed > 0) {
        console.log(`[${new Date().toISOString()}] 🗑  Removed ${removed} old backup(s)`);
      }

      resolve();
    });
  });
}

// Run once immediately on startup
runBackup().catch(() => {});

// Schedule: every day at 02:00
cron.schedule('0 2 * * *', () => {
  runBackup().catch(() => {});
}, {
  timezone: 'Asia/Tashkent',
});

console.log(`[${new Date().toISOString()}] 📅 Backup scheduler started — runs daily at 02:00 (Asia/Tashkent)`);
console.log(`[${new Date().toISOString()}] 📁 Backup directory: ${BACKUP_DIR}`);
console.log(`[${new Date().toISOString()}] 🗓  Keeping last ${KEEP_DAYS} days of backups`);
