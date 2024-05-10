# MAIL SCHEDULER BUILD WITH LUNOXJS - REACT PRESET

## Run Database
We use postgres as database because it support timestamp with timezone. For simplicity, we use docker. To run the container:
```bash
docker compose up -d
```
## How To Run This App (For Production)
 - install dependencies
   ```bash
   pnpm install
   ```
 - copy environment variable and fill your database environment
   ```bash
   cp .env.example .env
   ```
 - build the app
   ```bash
   pnpm build
   ```
 - run the app
   ```bash
   pnpm serve
   ```
 - run the queue worker via artisan
   ```bash
   pnpm artisan:prod queue:work
   ```
 - run the scheduler via artisan
   ```bash
   pnpm artisan:prod schedule:run
   ```
## Run Unit Testing
```bash
pnpm test
```
## Documentation (Open Api)
Api docs can be accessed at http://localhost:8000/api-docs

## What is Lunox
Lunox is Laravel-Flavoured NodeJs Framework. What is Laravel?
Laravel is a web application framework with expressive, elegant syntax [see the official website](https://laravel.com). Lunox goals is to bring the Laravel Flavour to nodejs environment.

## React Preset
This lunox app using react for template engine.

## Documentation

Lunox Documentation can be accessed [here](https://kodepandai.github.io/lunox/)
