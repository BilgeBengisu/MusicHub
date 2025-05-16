# Deploying MusicHub to Render.com

## Prerequisites

1. A free Render.com account (sign up at https://render.com)
2. Git repository with your MusicHub code
3. GitHub account (recommended for easy deployment)

## Deployment Steps

### 1. Push your code to GitHub

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Backend Deployment

1. Log in to your Render account
2. Go to Dashboard and click "New +"
3. Select "Web Service"
4. Connect your GitHub repository
5. Configure the web service:
   - Name: `musichub-backend`
   - Environment: `Python`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn backend.wsgi:application --log-file -`
   - Select appropriate instance type (Free tier works for development)
6. Add environment variables:
   - `SECRET_KEY`: Generate a secure random string
   - `DEBUG`: False
   - `ALLOWED_HOSTS`: musichub-backend.onrender.com
   - `CORS_ALLOWED_ORIGINS`: https://musichub-frontend.onrender.com
   - `CSRF_TRUSTED_ORIGINS`: https://musichub-frontend.onrender.com

7. Create a PostgreSQL database:
   - Go to Dashboard and click "New +"
   - Select "PostgreSQL"
   - Give it a name like `musichub-db`
   - Select appropriate instance type
   - After creation, copy the "External Database URL" from your database settings
   - Add it as `DATABASE_URL` environment variable in your backend web service

8. Click "Create Web Service"

### 3. Frontend Deployment

1. Go to Dashboard and click "New +"
2. Select "Static Site"
3. Connect your GitHub repository 
4. Configure the static site:
   - Name: `musichub-frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `frontend/dist`
5. Add environment variables:
   - `VITE_API_URL`: https://musichub-backend.onrender.com
6. Add a redirect rule:
   - Source: `/*`
   - Destination: `/index.html`
   - Status: `200`
7. Click "Create Static Site"

### 4. After Deployment

1. Once deployed, go to your backend service and run the following command in the Shell tab:
   ```
   python manage.py migrate
   ```

2. If you want to create a superuser:
   ```
   python manage.py createsuperuser
   ```

## Accessing Your Deployed Application

- Backend API: https://musichub-backend.onrender.com
- Frontend: https://musichub-frontend.onrender.com

## Troubleshooting

- Check logs in the Render dashboard for each service if you encounter issues
- For database issues, check the database logs
- For static file issues, make sure your frontend build process is correct and static files are being served correctly 