# SAM Observability

_Infrastructure as code framework used_: AWS SAM
_AWS Services used_: AWS Lambda, AWS DynamoDB, AWS API Gateway, Amazon Cloudwatch

## Summary of the demo

This demo is a work in progress and it will contain basics of serverless application observability (alarms, logs and metrics).
Observability is part of the Well Architected Framework Pillar 1 - Operational excellence, if you want to learn more about this pillar check [this blog post](https://blog.marcia.dev/operational-excellence) out.

In this demo you will see:

- How to configure an Amazon Cloudwatch Alarm using AWS SAM
- How to send structure logs and metrics to Cloudwatch Logs using [aws-embedded-metrics](https://github.com/awslabs/aws-embedded-metrics-node) library
- How to instrument AWS Lambda and API Gateway for sending information to X-Ray
- How to create segments and subsegments for X-Ray

## Architecture of the application

This application will get the name of a User and save it in a table.
The user can check if the system has his name registered by checking the table.

The backend is an API Gateway to handle the client requests, a Lambda function to do the business logic and then a DynamoDB table to save all the names.

## Prerequisites for building this solution

1. You need to have an AWS account
   If you don't know how to do it check this [link](https://youtu.be/9_wo0FHtVmY)

2. Then you need to configure your AWS account in your computer and install AWS SAM. Follow this [link](https://aws.amazon.com/serverless/sam/) for instructions

## Building the application

Go to the backend directory

```
$ npm install
```

We will be using AWS SAM and make sure you are running the latest version - at the time of writing, this was 1.37.0 (sam --version).

Deploy the project to the cloud:

```
sam deploy -g # Guided deployments
```

When asked about functions that may not have authorization defined, answer (y)es. The access to those functions will be open to anyone, so keep the app deployed only for the time you need this demo running.

Next times, when you update the code, you can build and deploy with:

```
sam deploy
```

After deploying you will get an URL back, and you can use it to test the APIs with Curl or Postman

To check if a name is in the database

```
curl https://<API>/hello?name=Marcia
```

To save a new name to the database

```
curl -X POST https://bqf9incy3e.execute-api.eu-west-1.amazonaws.com/dev/hello?name=Marcia
```

## Delete the backend

```
$ cd backend
$ sam delete
```

Say yes to all the prompts. It will ask you if you want to delete all the S3 buckets and the Cloudformation Stack.

## Resources

- [Video about Cloudwatch alarms in English](https://youtu.be/PII5_luwcAo)
- [Video about Cloudwatch alarms in Spanish](https://youtu.be/uS0QE0NeqpA)
- [Video about Cloudwatch logs in English](https://youtu.be/2vpy8bi-fPk)
- [Video about Cloudwatch logs in Spanish](https://youtu.be/UBPPGJaBIVY)
- [Video about X-Ray and traces in English](https://youtu.be/OOScvywKj9s)
- [Video about X-Ray and traces in Spanish](https://youtu.be/UBPPGJaBIVY)
