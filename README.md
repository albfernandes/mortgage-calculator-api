# Mortgage Calculator API

## Installing

To install the project dependencies, run the command: `npm install`

## Build

This project was develop into TypeScript, so, before your run the project (non locally), you need to transpile the code base to `js`. To transpile the project, run the command: `npm run build`

## Static Code Analyzer

I used the tslint to do some static code analysis, to execute the lint, run the command: `npm run lint`.

## Automated Tests

This project has a strategy to tests using automated tests (only in stock-service). To execute the tests run the command `npm test` or `make test`(in this case it will run tests inside a docker container).

![Test coverage](/docs//images/test-coverage.jpg)

## Start the application

To start the applications, run the command: `docker-compose up` in the root of node-challenge folder

## API Documentation

The reference for the APIs can be seen in the `swagger.yaml` file inside `/docs/swagger` path. You can copy the content of the yaml file and paste here -> https://editor.swagger.io/ to see the specification.
