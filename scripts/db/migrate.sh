#!/bin/bash

docker-compose exec car-sharing-app yarn typeorm:cli migration:run
