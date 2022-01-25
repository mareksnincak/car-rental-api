#!/bin/bash

docker-compose exec car-rental-api yarn typeorm:cli migration:run
