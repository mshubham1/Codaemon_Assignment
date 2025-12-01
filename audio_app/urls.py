"""
URL configuration for audio_app project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from users.views import index

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('', index, name='index'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

