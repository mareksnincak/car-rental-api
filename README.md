# Car rental API

API for renting a car. This project serves as part of the research where participants were asked to code part of car rental company system (search and car booking) based on provided system specification.

## How to run

### Prerequisites
- [Docker](https://www.docker.com/get-started)
- [Docker compose](https://docs.docker.com/compose/install/)

### Running the app

1. Copy env files and optionally edit them:
    ```bash
    cp .app.env.example .app.env
    cp .postgres.env.example .postgres.env
    ```

1. Launch app:
    ```bash
    docker-compose up
    ```
    
1. Setup db:
    ```bash
    ./scripts/migrate.sh
    ```

1. [OPTIONAL] Seed mocked data:
    ```bash
    ./scripts/seed.sh
    ```

1. [OPTIONAL] If you want to clean db at some point:
    ```bash
    ./scripts/recreate.sh
    ```

### Running tests

* Run tests:
    ```bash
    ./scripts/test.sh
    ```

* View test options:
    ```bash
    ./scripts/test.sh -h
    ```
