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

Generate ```Dockerfile```:

```
pushd scripts && sh Dockerfile.sh && popd
```

To build Docker image run:
```
docker build -t=<MY_IMAGE_TAG> .
```

Run Docker image:
```
docker run -p=8080 -d <MY_IMAGE_TAG>
```
