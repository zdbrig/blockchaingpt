#!/bin/bash

docker compose down 

rm -rf mongodata

rm -rf rabbitmq

rm -rf ./bgpt-server/logs.txt  

rm -rf ./bgpt-processor/logs.txt

rm -rf ./bgpt-worker/worker.log