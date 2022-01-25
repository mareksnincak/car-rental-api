#!/bin/bash

# See https://stackoverflow.com/a/1885534/12521183
read -p "This will wipe all existing data. Do you want to continue (y/N)? " -n 1 -r
if [[ $REPLY =~ ^[Yy]$ ]]
then
  docker-compose exec car-rental-api yarn typeorm:recreate
fi