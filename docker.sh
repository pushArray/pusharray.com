#!/usr/bin/env bash
function string_replace {
    echo "${1/\/${2}/${3}}"
}
function get_env {
    echo $(env | grep ${1} | grep -oe '[^=]*$')
}

DOCKER_FILE=`cat ./docker/Dockerfile`
TOKEN_KEY=$(get_env "TWITTER_ACCESS_TOKEN_KEY")
TOKEN_SECRET=$(get_env "TWITTER_ACCESS_TOKEN_SECRET")
CONSUMER_KEY=$(get_env "TWITTER_CONSUMER_KEY")
CONSUMER_SECRET=$(get_env "TWITTER_CONSUMER_SECRET")
DOCKER_FILE="${DOCKER_FILE/\<TOKEN_KEY>/${TOKEN_KEY}}"
DOCKER_FILE="${DOCKER_FILE/\<TOKEN_SECRET>/${TOKEN_SECRET}}"
DOCKER_FILE="${DOCKER_FILE/\<CONSUMER_KEY>/${CONSUMER_KEY}}"
DOCKER_FILE="${DOCKER_FILE/\<CONSUMER_SECRET>/${CONSUMER_SECRET}}"
echo "$DOCKER_FILE" > Dockerfile
