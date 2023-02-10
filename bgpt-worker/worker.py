import os
import pika
import requests
import json
import logging

queries_count = {}
max_queries = 10
logging.basicConfig(filename='worker.log', level=logging.DEBUG, format='%(asctime)s %(message)s', datefmt='%m/%d/%Y %I:%M:%S %p')


def execute(ch, method, properties, body):
    
    # parse the task from the message body
    task = body.decode() 
    json_object = json.loads(task)
    logging.info("execute: " , json_object.get("id"))
    task_id = task[0]
    if task_id in queries_count:
        queries_count[task_id] += 1
    else:
        queries_count[task_id] = 1

    #if queries_count[task_id] > max_queries:
    #    print("max queries reached")
        # do not execute the query and acknowledge the task
    #    ch.basic_ack(delivery_tag=method.delivery_tag)
    #    return

    # make a call to the web service with the task
    response = requests.post(os.environ['PROCESSOR_URL'], json=json_object)
    if response.status_code == 200:
        # acknowledge the task if the web service call was successful
        ch.basic_ack(delivery_tag=method.delivery_tag)
    else:
        # requeue the task if the web service call failed
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=True)

def analyze(ch, method, properties, body):
    
    # parse the task from the message body
    task = body.decode()
    json_object = json.loads(task)

    task_id = task_id = task[0]
    logging.info("execute: " , json_object)

    if task_id in queries_count:
        queries_count[task_id] += 1
    else:
        queries_count[task_id] = 1

    #if queries_count[task_id] > max_queries:
        # do not execute the query and acknowledge the task
    #    print("max queries reached")
    #    ch.basic_ack(delivery_tag=method.delivery_tag)
    #    return

    # make a call to the web service with the task
    response = requests.post(os.environ['ANALYZER_URL'], json=json_object)
    if response.status_code == 200:
        # acknowledge the task if the web service call was successful
        ch.basic_ack(delivery_tag=method.delivery_tag)
    else:
        # requeue the task if the web service call failed
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=True)



def main():
    credentials = pika.PlainCredentials('sqoin', '123456')
    parameters = pika.ConnectionParameters(os.environ['RABBITMQ_HOST'], 5672,'/',credentials)
    connection = pika.BlockingConnection(parameters)
    channel = connection.channel()
    # declare the list of queue names
    queue_names = ["openai-queue", "openai-analyze", "queue3"]
    
    channel.queue_declare(queue="openai-queue", durable=True)
    channel.basic_consume(queue="openai-queue", on_message_callback=execute)
    channel.queue_declare(queue="openai-analyze", durable=True)
    channel.basic_consume(queue="openai-analyze", on_message_callback=analyze)

    channel.start_consuming()

if __name__ == '__main__':
    main()
