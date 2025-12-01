# User Audio Manager - Django Full-Stack Application

A full-stack Django application that allows you to manage user profiles and upload/play audio files for each user.

## Features

- **User Management**: View user details via REST API endpoints
- **Audio Upload**: Upload audio files (MP3, WAV, OGG, M4A, AAC) for specific users
- **Audio Playback**: Play uploaded audio files directly in the browser
- **Audio Management**: Switch between different audio files and delete them
- **Modern UI**: Beautiful, responsive user interface with gradient design

## Technology Stack

- **Backend**: Django 4.2.7
- **API**: Django REST Framework
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Database**: SQLite (default, can be changed)

## Installation & Setup

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Step 1: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 2: Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### Step 3: Create a Superuser (Optional)

To access the Django admin panel:

```bash
python manage.py createsuperuser
```

### Step 4: Run the Development Server

```bash
python manage.py runserver
```

The application will be available at `http://127.0.0.1:8000/`

## Usage

### Creating Users

You can create users in two ways:

1. **Via Django Admin Panel** (if you created a superuser):
   - Navigate to `http://127.0.0.1:8000/admin/`
   - Login with your superuser credentials
   - Go to "User Profiles" and add a new user

2. **Via API**:
   ```bash
   curl -X POST http://127.0.0.1:8000/api/users/ \
     -H "Content-Type: application/json" \
     -d '{"name": "John Doe", "email": "john@example.com", "phone": "1234567890", "bio": "Test user"}'
   ```

### Using the Web Interface

1. **View Users**: Click "Load All Users" to see all available users
2. **Select User**: Enter a user ID or click on a user from the list
3. **View Details**: User details will be displayed automatically
4. **Upload Audio**: Select an audio file and optionally add a title, then click "Upload Audio"
5. **Play Audio**: Click on any audio file in the list to play it
6. **Switch Audio**: Click on a different audio file to switch playback
7. **Delete Audio**: Click the "Delete" button on any audio file to remove it

## API Endpoints

### User Endpoints

- `GET /api/users/` - List all users
- `GET /api/users/{id}/` - Get user details
- `GET /api/users/{id}/details/` - Get detailed user information with audio files
- `POST /api/users/` - Create a new user
- `PUT /api/users/{id}/` - Update user
- `DELETE /api/users/{id}/` - Delete user

### Audio Endpoints

- `GET /api/users/{id}/audio-files/` - Get all audio files for a user
- `POST /api/users/{id}/upload-audio/` - Upload an audio file for a user
- `GET /api/audio/` - List all audio files
- `GET /api/audio/{id}/` - Get audio file details
- `DELETE /api/audio/{id}/` - Delete an audio file

### Example API Calls

**Get user details:**
```bash
curl http://127.0.0.1:8000/api/users/1/details/
```

**Upload audio file:**
```bash
curl -X POST http://127.0.0.1:8000/api/users/1/upload-audio/ \
  -F "audio_file=@/path/to/audio.mp3" \
  -F "title=My Audio File"
```

**Get user's audio files:**
```bash
curl http://127.0.0.1:8000/api/users/1/audio-files/
```

## Project Structure

```
Assignment/
├── audio_app/           # Main Django project
│   ├── settings.py      # Django settings
│   ├── urls.py          # Main URL configuration
│   └── ...
├── users/               # Users app
│   ├── models.py        # UserProfile and AudioFile models
│   ├── views.py         # API views
│   ├── serializers.py   # DRF serializers
│   ├── urls.py          # App URL configuration
│   └── ...
├── templates/           # HTML templates
│   └── index.html       # Main frontend page
├── static/              # Static files
│   ├── css/
│   │   └── style.css    # Stylesheet
│   └── js/
│       └── main.js      # Frontend JavaScript
├── media/               # Uploaded files (created automatically)
│   └── audio_files/     # Audio files storage
├── manage.py            # Django management script
├── requirements.txt     # Python dependencies
└── README.md           # This file
```

## File Storage

Audio files are stored in the `media/audio_files/` directory. This directory is created automatically when the first file is uploaded.

## Supported Audio Formats

- MP3
- WAV
- OGG
- M4A
- AAC

## Development Notes

- The application uses SQLite by default for easy setup
- CORS is enabled for all origins in development (change in production)
- Media files are served in development mode automatically
- The application includes error handling and user feedback

## Production Deployment

For production deployment, consider:

1. Change `DEBUG = False` in `settings.py`
2. Set a proper `SECRET_KEY`
3. Configure proper database (PostgreSQL recommended)
4. Set up proper static file serving (e.g., WhiteNoise or CDN)
5. Configure proper CORS settings
6. Use a production WSGI server (e.g., Gunicorn)
7. Set up proper file storage (e.g., AWS S3)

## License

This project is open source and available for educational purposes.

