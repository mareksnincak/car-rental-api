#!/bin/bash

NAME=mareksnincak/car-rental-api
TAG=$(git describe --tags --abbrev=0)
NAME_WITH_TAG=$NAME:$TAG

read -p "This will build image $NAME_WITH_TAG and push it to dockerhub. Do you wish to continue (y/N)? " -n 1 -r
if [[ $REPLY =~ ^[Yy]$ ]]
then
  docker build -t $NAME_WITH_TAG -f Dockerfile.production .
  docker push $NAME_WITH_TAG
fi
