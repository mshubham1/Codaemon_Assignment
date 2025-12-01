#!/bin/bash

# Setup script for User Audio Manager Django Application

echo "Setting up User Audio Manager..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py migrate

# Create media directory
echo "Creating media directories..."
mkdir -p media/audio_files

echo ""
echo "Setup complete!"
echo ""
echo "To run the application:"
echo "1. Activate virtual environment: source venv/bin/activate"
echo "2. Run server: python manage.py runserver"
echo "3. Open browser: http://127.0.0.1:8000"
echo ""
echo "To create a superuser (optional):"
echo "python manage.py createsuperuser"

