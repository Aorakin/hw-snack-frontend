#!/bin/bash
set -e

# Replace environment variables in JavaScript files
# This allows runtime configuration of Vite environment variables

echo "Injecting runtime environment variables..."

# Find the main JavaScript file
JS_FILES=$(find /usr/share/nginx/html/assets -name '*.js' 2>/dev/null || true)

if [ -n "$JS_FILES" ]; then
  for file in $JS_FILES; do
    if [ -f "$file" ]; then
      echo "Processing $file..."
      
      # Replace VITE_API_URL placeholder with actual runtime value
      if [ -n "$VITE_API_URL" ]; then
        sed -i "s|VITE_API_URL_PLACEHOLDER|$VITE_API_URL|g" "$file"
      fi
    fi
  done
fi

echo "Environment variables injected successfully"

# Execute the CMD
exec "$@"
