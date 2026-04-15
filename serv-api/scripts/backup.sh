#!/bin/bash
set -euo pipefail

# Load .env if running manually (PM2 already has env vars)
if [ -f "$(dirname "$0")/../.env" ]; then
  export $(grep -v '^#' "$(dirname "$0")/../.env" | xargs)
fi

BACKUP_DIR="$(dirname "$0")/../backups"
KEEP_DAYS=7
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
FILENAME="backup_${TIMESTAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "[$(date)] Starting backup → $FILENAME"

pg_dump "$DATABASE_URL" \
  --no-owner \
  --no-acl \
  | gzip > "$BACKUP_DIR/$FILENAME"

echo "[$(date)] Backup complete: $BACKUP_DIR/$FILENAME ($(du -sh "$BACKUP_DIR/$FILENAME" | cut -f1))"

# Remove backups older than KEEP_DAYS days
find "$BACKUP_DIR" -name "backup_*.sql.gz" -mtime +$KEEP_DAYS -delete
echo "[$(date)] Cleaned up backups older than $KEEP_DAYS days"
