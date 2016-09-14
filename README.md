# pusharray.com

[![Build Status](https://travis-ci.org/pusharray/pusharray.com.svg?branch=r0.9)](https://travis-ci.org/logashoff/pusharray.com)

## Usage

UI requires Node.js 4.5 or higher to build. Application requires Go 1.6 or higher to run.

For Twitter API to work set ```TWITTER_CONSUMER_KEY```, ```TWITTER_CONSUMER_SECRET```, ```TWITTER_ACCESS_TOKEN_KEY``` and ```TWITTER_ACCESS_TOKEN_SECRET``` as environment variables.

## Install

Install UI dependencies and build:
```
npm install && npm run build
```

Install Go dependencies:
```
go get -u
```

Run Go application:
```
go run application.go
```

## Docker Build

To build Docker image run:
```
docker build -t=<MY_IMAGE_TAG> --build-arg TOKEN_KEY=<YOUR_TWITTER_ACCESS_TOKEN_KEY> --build-arg TOKEN_SECRET=<YOUR_TWITTER_ACCESS_TOKEN_SECRET> --build-arg CONSUMER_KEY=<YOUR_TWITTER_CONSUMER_KEY> --build-arg CONSUMER_SECRET=<YOUR_TWITTER_CONSUMER_SECRET> .
```

Run Docker image:
```
docker run -p=<SOME_PORT> -d <MY_IMAGE_TAG>
```
