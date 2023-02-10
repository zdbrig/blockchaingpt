import os
import pika
import requests
import json
import logging

queries_count = {}
max_queries = 10
user_queries_count = {}
max_user_queries = 100

logging.basicConfig(filename='worker.log', level=logging.DEBUG, format='%(asctime)s %(message)s', datefmt='%m/%d/%Y %I:%M:%S %p')


def execute(ch, method, properties, body):
    
    # parse the task from the message body
    task = body.decode() 
    json_object = json.loads(task)
    logging.info("execute: {0}".format( json_object))
    task_id = json_object["id"]
    user_id = json_object["user"]
    if task_id in queries_count:
        queries_count[task_id] += 1
    else:
        queries_count[task_id] = 1

    if user_id in user_queries_count:
        user_queries_count[user_id] += 1
    else:
        user_queries_count[user_id] = 1

    if queries_count[task_id] > max_queries:
        print("max queries reached")
        # do not execute the query and acknowledge the task
        ch.basic_ack(delivery_tag=method.delivery_tag)
        return
    if user_queries_count[user_id] > max_user_queries:
        print("max user queries reached")
        # do not execute the query and acknowledge the task
        ch.basic_ack(delivery_tag=method.delivery_tag)
        return

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

    task_id = json_object["id"]
    user_id = json_object["user"]
    logging.info("analyze: {0}".format(json_object) )

    if task_id in queries_count:
        queries_count[task_id] += 1
    else:
        queries_count[task_id] = 1
    
    if user_id in user_queries_count:
        user_queries_count[user_id] += 1
    else:
        user_queries_count[user_id] = 1

    if queries_count[task_id] > max_queries:
        # do not execute the query and acknowledge the task
        logging.warning("Task: {0} reached {1}".format( task_id ,queries_count[task_id] ))
        ch.basic_ack(delivery_tag=method.delivery_tag)
        return

    if user_queries_count[user_id] > max_user_queries:
        print("max user queries reached")
        # do not execute the query and acknowledge the task
        ch.basic_ack(delivery_tag=method.delivery_tag)
        return

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
    channel.basic_qos(prefetch_count=5)

    channel.queue_declare(queue="openai-queue", durable=True)
    channel.basic_consume(queue="openai-queue", on_message_callback=execute)
    channel.queue_declare(queue="openai-analyze", durable=True)
    channel.basic_consume(queue="openai-analyze", on_message_callback=analyze)

    channel.start_consuming()

if __name__ == '__main__':
    main()
