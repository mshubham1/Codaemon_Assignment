from django.contrib import admin
from .models import UserProfile, AudioFile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'phone', 'created_at']
    search_fields = ['name', 'email']
    list_filter = ['created_at']


@admin.register(AudioFile)
class AudioFileAdmin(admin.ModelAdmin):
    list_display = ['user', 'title', 'uploaded_at']
    list_filter = ['uploaded_at']
    search_fields = ['user__name', 'title']

