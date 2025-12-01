from rest_framework import serializers
from .models import UserProfile, AudioFile


class AudioFileSerializer(serializers.ModelSerializer):
    """Serializer for audio files"""
    audio_url = serializers.SerializerMethodField()
    file_size = serializers.SerializerMethodField()

    class Meta:
        model = AudioFile
        fields = ['id', 'audio_file', 'audio_url', 'title', 'uploaded_at', 'file_size']
        read_only_fields = ['uploaded_at']

    def get_audio_url(self, obj):
        """Get the URL to access the audio file"""
        if obj.audio_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.audio_file.url)
            return obj.audio_file.url
        return None

    def get_file_size(self, obj):
        """Get the file size in bytes"""
        if obj.audio_file:
            try:
                return obj.audio_file.size
            except:
                return None
        return None


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profiles"""
    audio_files = AudioFileSerializer(many=True, read_only=True)
    audio_files_count = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['id', 'name', 'email', 'phone', 'bio', 'created_at', 'updated_at', 
                  'audio_files', 'audio_files_count']
        read_only_fields = ['created_at', 'updated_at']

    def get_audio_files_count(self, obj):
        """Get the count of audio files for this user"""
        return obj.audio_files.count()


class UserProfileListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing users"""
    audio_files_count = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['id', 'name', 'email', 'phone', 'audio_files_count']

    def get_audio_files_count(self, obj):
        return obj.audio_files.count()

