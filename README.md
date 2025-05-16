# MusicHub

MusicHub is a social media platform for music enthusiasts to share posts with text, images, audio files, and embedded YouTube videos.

## Features

- User authentication and profiles
- Profile pictures and bio
- Posts with multimedia content (text, images, audio)
- YouTube video embedding
- Responsive design

## Deployment Instructions

### Backend Deployment (Heroku)

1. Create a Heroku account and install the Heroku CLI
2. Login to Heroku CLI:
```
heroku login
```

3. Create a new Heroku application:
```
cd backend
heroku create musichub-backend
```

4. Add PostgreSQL addon:
```
heroku addons:create heroku-postgresql:mini
```

5. Configure environment variables:
```
heroku config:set SECRET_KEY="your-secure-secret-key"
heroku config:set DEBUG="False"
heroku config:set ALLOWED_HOSTS="musichub-backend.herokuapp.com,yourdomain.com"
heroku config:set CORS_ALLOWED_ORIGINS="https://your-frontend-domain.netlify.app"
heroku config:set CSRF_TRUSTED_ORIGINS="https://your-frontend-domain.netlify.app"
```

6. Optional: Set up AWS S3 for media storage:
```
heroku config:set AWS_ACCESS_KEY_ID="your-aws-key"
heroku config:set AWS_SECRET_ACCESS_KEY="your-aws-secret"
heroku config:set AWS_STORAGE_BUCKET_NAME="your-bucket-name"
heroku config:set AWS_S3_REGION_NAME="your-aws-region"
```

7. Deploy to Heroku:
```
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Frontend Deployment (Netlify)

1. Create a Netlify account

2. Install Netlify CLI:
```
npm install -g netlify-cli
```

3. Build the frontend:
```
cd frontend
npm install
npm run build
```

4. Deploy using Netlify CLI:
```
netlify deploy --prod
```

5. Or link your GitHub repository to Netlify for automatic deployments

## Local Development

### Backend Setup
```
cd backend
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup
```
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend
- SECRET_KEY: Django secret key
- DEBUG: "True" or "False"
- ALLOWED_HOSTS: Comma-separated list of allowed hosts
- CORS_ALLOWED_ORIGINS: Comma-separated list of allowed origins
- AWS_ACCESS_KEY_ID: AWS key for S3 storage (optional)
- AWS_SECRET_ACCESS_KEY: AWS secret for S3 storage (optional)
- AWS_STORAGE_BUCKET_NAME: S3 bucket name (optional)
- AWS_S3_REGION_NAME: S3 region (optional)

### Frontend
- VITE_API_URL: Backend API URL
