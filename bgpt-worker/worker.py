import os
import pika
import requests
import json

def execute(ch, method, properties, body):
    
    # parse the task from the message body
    task = body.decode()
    json_object = json.loads(task)

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
