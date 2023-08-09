## Employee clock api

### Introduction

This RESTful API is mainly the attendance of employees. It can be refer to [api document](http://host-html-group.s3-website-ap-northeast-1.amazonaws.com).

### Build local API server

##### Please make sure you have Node.js, Express and PostgreSQL installed.

#### Clone the repo

```
git clone https://github.com/Coli-co/Employee_clock_api.git
```

#### Switch to project folder

```
cd Employee_clock_api
```

#### Open project

```
code .
```

#### Install packages required

```
npm install
```

#### Set .env file

- All related parameters written in `.env.example` file.

#### Load data into database

```
npm run seed
```

#### Start server

```
npm run start
```

### Dockerize

- Build image

```
docker build -t <name>:<tag> .
```

- Run container

```
docker run -p 3000:3000 -d --rm --name <container_name> <name>:<tag>
```

- Then you can send request to `http://localhost:3000` and add related endpoint, query parameter, and request parameter which described in api document.

## Deploy

- Pull Docker image from AWS ECR.
- Use AWS Serverless container platform - `ECS - Fargate Launch Type`, it just runs tasks based on CPU/RAM.
- Application Load Balancer controls HTTP request and allow it to ECS task.
- Database set in AWS EC2 instance.
- You can visit any api with the following base url

```
http://employeealb-1404378238.ap-northeast-1.elb.amazonaws.com
```

## Tools

- Server: Node.js
- Framework: Express.js
- JavaScript
- Database: PostgreSQL
- Docker
- API documentation: Redocly

## AWS Cloud Services

- EC2
- ECR
- ECS
- Application Load Balancer
