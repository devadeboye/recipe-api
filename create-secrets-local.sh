#!/bin/bash

LOCAL_SECRETS_DIR="./secrets"

echo "🔐 Creating/updating Docker secrets locally..."

for filepath in "$LOCAL_SECRETS_DIR"/*; do
  filename=$(basename "$filepath")
  secret_name="${filename%.txt}"  # Adjust if your files don't have .txt extension

  echo "  - Processing secret: $secret_name"

  # Try removing the secret if it exists
  if docker secret rm "$secret_name" 2>/dev/null; then
    echo "    Removed existing secret '$secret_name'."
  else
    echo "    No existing secret '$secret_name' found. Creating new."
  fi

  # Create secret from file content
  if docker secret create "$secret_name" "$filepath"; then
    echo "    Secret '$secret_name' created."
  else
    echo "    Failed to create secret '$secret_name'."
  fi
done

echo "✅ All secrets processed."
