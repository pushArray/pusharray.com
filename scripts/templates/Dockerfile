FROM golang:latest
ENV WORK_PATH=/go/src/github.com/pusharray/pusharray.com
ADD . $WORK_PATH
WORKDIR $WORK_PATH

ENV TWITTER_ACCESS_TOKEN_KEY=<TOKEN_KEY>
ENV TWITTER_ACCESS_TOKEN_SECRET=<TOKEN_SECRET>
ENV TWITTER_CONSUMER_KEY=<CONSUMER_KEY>
ENV TWITTER_CONSUMER_SECRET=<CONSUMER_SECRET>

RUN go version
RUN go get
RUN go build -o app .

RUN curl -sL https://deb.nodesource.com/setup_4.x | bash -
RUN apt-get install -y nodejs
RUN npm -v
RUN node -v
RUN npm install --production
RUN npm run build

ENTRYPOINT $WORK_PATH/app
EXPOSE 8080
