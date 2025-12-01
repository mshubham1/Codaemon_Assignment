from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import UserProfile, AudioFile
from .serializers import UserProfileSerializer, UserProfileListSerializer, AudioFileSerializer


class UserProfileViewSet(viewsets.ModelViewSet):
    """ViewSet for user profiles"""
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

    def get_serializer_class(self):
        if self.action == 'list':
            return UserProfileListSerializer
        return UserProfileSerializer

    @action(detail=True, methods=['get'], url_path='details')
    def get_user_details(self, request, pk=None):
        """Get detailed information about a specific user"""
        try:
            user = self.get_object()
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['post'], url_path='upload-audio')
    def upload_audio(self, request, pk=None):
        """Upload an audio file for a specific user"""
        try:
            user = self.get_object()
            audio_file = request.FILES.get('audio_file')
            title = request.data.get('title', '')

            if not audio_file:
                return Response(
                    {'error': 'No audio file provided'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            audio = AudioFile.objects.create(
                user=user,
                audio_file=audio_file,
                title=title
            )

            serializer = AudioFileSerializer(audio, context={'request': request})
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except UserProfile.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['get'], url_path='audio-files')
    def get_audio_files(self, request, pk=None):
        """Get all audio files for a specific user"""
        try:
            user = self.get_object()
            audio_files = user.audio_files.all()
            serializer = AudioFileSerializer(audio_files, many=True, context={'request': request})
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class AudioFileViewSet(viewsets.ModelViewSet):
    """ViewSet for audio files"""
    queryset = AudioFile.objects.all()
    serializer_class = AudioFileSerializer

    def get_queryset(self):
        queryset = AudioFile.objects.all()
        user_id = self.request.query_params.get('user_id', None)
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        return queryset


@ensure_csrf_cookie
def index(request):
    """Render the main frontend page"""
    return render(request, 'index.html')

