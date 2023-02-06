# Use an existing image as the base image
FROM python

RUN apt update && apt install -y  netcat 

RUN pip install pika requests

# Set the working directory in the image
WORKDIR /app

# Copy the required files to the image
COPY worker.py .
COPY start-worker.sh .

# Install the required packages




# Make the start-worker.sh script executable
RUN chmod +x start-worker.sh

# Command to run when the image is started
CMD ["./start-worker.sh" ,  "rabbitmqservice", "5672","--"]
#CMD ["tail -f /dev/null"]