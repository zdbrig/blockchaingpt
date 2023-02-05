#!/bin/bash

# Wait for the specified host:port to become available

host="$1"
port="$2"

until nc -z "$host" "$port"; do
  echo "Waiting for $host:$port..."
  sleep 1
done

echo "$host:$port is available. Continuing..."

host="$3"
port="$4"

until nc -z "$host" "$port"; do
  echo "Waiting for $host:$port..."
  sleep 1
done

echo "$host:$port is available. Continuing..."

npm start



