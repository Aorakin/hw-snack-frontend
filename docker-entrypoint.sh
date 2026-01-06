#!/bin/bash
set -e

echo "Injecting runtime environment variables..."

# Create env-config.js file with runtime environment variables
cat > /usr/share/nginx/html/env-config.js <<EOF
window.ENV = {
  VITE_API_URL: "${VITE_API_URL:-http://localhost:5000}"
};
EOF

echo "Created env-config.js with VITE_API_URL=${VITE_API_URL:-http://localhost:5000}"

# Execute the CMD
exec "$@"
