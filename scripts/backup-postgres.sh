#!/bin/bash

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '#' | xargs)
fi

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="./backups"
DB_NAME=${POSTGRES_DB:-nexsmsid}
DB_USER=${POSTGRES_USER:-nexsmsid}
CONTAINER_NAME=$(docker compose -f docker-compose.prod.yml ps -q postgres 2>/dev/null)

if [ -z "$CONTAINER_NAME" ]; then
    echo "Error: Postgres container not found. Is the production stack running?"
    exit 1
fi

echo "Starting backup for database: $DB_NAME..."

docker exec $CONTAINER_NAME pg_dump -U $DB_USER $DB_NAME > $BACKUP_DIR/backup_${DB_NAME}_${TIMESTAMP}.sql

if [ $? -eq 0 ]; then
    echo "Backup successful: $BACKUP_DIR/backup_${DB_NAME}_${TIMESTAMP}.sql"
    # Keep only last 30 backups
    ls -t $BACKUP_DIR/backup_${DB_NAME}_*.sql | tail -n +31 | xargs rm -- 2>/dev/null
else
    echo "Error: Backup failed!"
    exit 1
fi
