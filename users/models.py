from django.db import models
from django.core.validators import FileExtensionValidator


class UserProfile(models.Model):
    """User profile model with audio file support"""
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    bio = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class AudioFile(models.Model):
    """Audio file model associated with a user"""
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='audio_files')
    audio_file = models.FileField(
        upload_to='audio_files/',
        validators=[FileExtensionValidator(allowed_extensions=['mp3', 'wav', 'ogg', 'm4a', 'aac'])]
    )
    title = models.CharField(max_length=200, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"{self.user.name} - {self.title or self.audio_file.name}"

