#!/bin/bash
echo "=== NexSMSID Staging Healthcheck ==="

echo -e "\n1. Web Root Check:"
curl -s -I http://127.0.0.1/ | head -n 1

echo -e "\n2. API Health Check:"
curl -s -I http://127.0.0.1/api/v1/health | head -n 1
curl -s http://127.0.0.1/api/v1/health

echo -e "\n\n3. Docker Services Status:"
cd /root/nexsmsid && docker compose -f docker-compose.prod.yml ps

echo -e "\n4. Disk Space:"
df -h / | tail -1

echo -e "\n5. Last Backup:"
ls -lh /root/nexsmsid/backups | tail -2
