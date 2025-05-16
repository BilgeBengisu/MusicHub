#!/bin/bash
# Backend deployment script

# Navigate to backend directory
cd backend

# Create a new Heroku app (uncomment if you need to create a new app)
# heroku create musichub-backend

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini

# Configure environment variables
heroku config:set SECRET_KEY="$(openssl rand -base64 32)"
heroku config:set DEBUG="False"
heroku config:set ALLOWED_HOSTS="musichub-backend.herokuapp.com"
heroku config:set CORS_ALLOWED_ORIGINS="https://musichub-app.netlify.app"
heroku config:set CSRF_TRUSTED_ORIGINS="https://musichub-app.netlify.app"

# Deploy to Heroku
git add .
git commit -m "Deploy to Heroku"
git push heroku main

# Run migrations
heroku run python manage.py migrate

echo "Backend deployment completed!" 