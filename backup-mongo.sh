#!/bin/bash

# Set the name of the Docker container running MongoDB
CONTAINER_NAME=73b068f6f14b

# Set the MongoDB host and port
HOST=127.0.0.1
PORT=27017

# Set the backup directory
BACKUP_DIR=./backups

# Get the current date
DATE=$(date +"%Y-%m-%d-%H-%M-%S")

# Create the backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Get the list of databases in the MongoDB server
DBS=$(docker exec $CONTAINER_NAME mongo --quiet --eval 'db.getMongo().getDBNames()' | tr -d '\n')

# Replace the comma-separated list of databases with a newline-separated list
DBS=$(echo $DBS | sed -e 's/,/\n/g')

# Loop through all databases in the MongoDB server
for db in $DBS;
do
    # Dump the database to a backup file
    docker exec $CONTAINER_NAME mongodump --host $HOST:$PORT --db $db --out /data/db/$DATE-$db

    # Copy the backup from the container to the host machine
    docker cp $CONTAINER_NAME:/data/db/$DATE-$db $BACKUP_DIR/
done
