# Task Manager

## Technology
- Laravel (Backend)
- Angular (Frontend)
- MySQL   (Database)

## Structure

- Dashboard
- Boards
- Workspaces
- Settings

# For the backend
Set up a local dev server that is compatible with Laravel
Do a ```composer install``` inside the backend directory
Create the database with ```php artisan migrate:fresh``` (The settings are found in .env file, If it doesn't exist create it from [file](backend/.env.example))

# For the frontend

## Environment 

- Angular CLI Version: 14.2.1
- Angular Core Version: 14.2.1
- Default Port: 4200

**Commands**
- run: 
```bash
bash bin/env_setup && . $HOME/.nvm/nvm.sh && npm start
```
- install: 
```bash
bash bin/env_setup && . $HOME/.nvm/nvm.sh && npm install
```
