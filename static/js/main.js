const API_BASE_URL = '/api';

let currentUserId = null;
let currentAudioFiles = [];

// Get CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Get CSRF token
function getCSRFToken() {
    return getCookie('csrftoken');
}

// Fetch user details by ID
async function fetchUserDetails() {
    const userId = document.getElementById('userId').value;
    
    if (!userId) {
        showError('Please enter a user ID');
        return;
    }

    try {
        showLoading('userDetails');
        const response = await fetch(`${API_BASE_URL}/users/${userId}/details/`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('User not found');
            }
            throw new Error('Failed to fetch user details');
        }

        const userData = await response.json();
        currentUserId = userData.id;
        displayUserDetails(userData);
        showUserSections();
        await loadAudioFiles(userId);
        hideError();
    } catch (error) {
        showError(error.message);
        hideUserSections();
    }
}

// Load all users
async function loadUsers() {
    try {
        showLoading('usersList');
        const response = await fetch(`${API_BASE_URL}/users/`);
        
        if (!response.ok) {
            throw new Error('Failed to load users');
        }

        const users = await response.json();
        displayUsersList(users);
        hideError();
    } catch (error) {
        showError(error.message);
    }
}

// Display users list
function displayUsersList(users) {
    const usersListDiv = document.getElementById('usersList');
    
    if (users.length === 0) {
        usersListDiv.innerHTML = '<p>No users found. Create a user via the admin panel or API.</p>';
        return;
    }

    usersListDiv.innerHTML = users.map(user => `
        <div class="user-item" onclick="selectUser(${user.id})">
            <strong>${user.name}</strong> (ID: ${user.id})<br>
            <small>${user.email} - ${user.audio_files_count || 0} audio file(s)</small>
        </div>
    `).join('');
}

// Select a user from the list
function selectUser(userId) {
    document.getElementById('userId').value = userId;
    fetchUserDetails();
    
    // Highlight selected user
    document.querySelectorAll('.user-item').forEach(item => {
        item.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
}

// Display user details
function displayUserDetails(userData) {
    const userDetailsDiv = document.getElementById('userDetails');
    
    userDetailsDiv.innerHTML = `
        <div class="info-item">
            <span class="info-label">Name:</span>
            <span class="info-value">${userData.name}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Email:</span>
            <span class="info-value">${userData.email}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Phone:</span>
            <span class="info-value">${userData.phone || 'Not provided'}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Bio:</span>
            <span class="info-value">${userData.bio || 'Not provided'}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Audio Files:</span>
            <span class="info-value">${userData.audio_files_count || 0}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Created:</span>
            <span class="info-value">${new Date(userData.created_at).toLocaleString()}</span>
        </div>
    `;
}

// Show user-related sections
function showUserSections() {
    document.getElementById('userDetailsSection').style.display = 'block';
    document.getElementById('audioUploadSection').style.display = 'block';
    document.getElementById('audioPlayerSection').style.display = 'block';
}

// Hide user-related sections
function hideUserSections() {
    document.getElementById('userDetailsSection').style.display = 'none';
    document.getElementById('audioUploadSection').style.display = 'none';
    document.getElementById('audioPlayerSection').style.display = 'none';
}

// Load audio files for a user
async function loadAudioFiles(userId) {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}/audio-files/`);
        
        if (!response.ok) {
            throw new Error('Failed to load audio files');
        }

        const audioFiles = await response.json();
        currentAudioFiles = audioFiles;
        displayAudioFiles(audioFiles);
    } catch (error) {
        console.error('Error loading audio files:', error);
        currentAudioFiles = [];
        displayAudioFiles([]);
    }
}

// Display audio files list
function displayAudioFiles(audioFiles) {
    const audioFilesListDiv = document.getElementById('audioFilesList');
    
    if (audioFiles.length === 0) {
        audioFilesListDiv.innerHTML = '<p>No audio files uploaded yet. Upload one above!</p>';
        return;
    }

    audioFilesListDiv.innerHTML = audioFiles.map((audio, index) => {
        const fileSize = audio.file_size ? formatFileSize(audio.file_size) : 'Unknown size';
        const uploadDate = new Date(audio.uploaded_at).toLocaleString();
        
        return `
            <div class="audio-file-item" data-index="${index}" onclick="playAudio(${index})">
                <div class="audio-file-info">
                    <div class="audio-file-title">${audio.title || audio.audio_file.split('/').pop()}</div>
                    <div class="audio-file-meta">${fileSize} • ${uploadDate}</div>
                </div>
                <div class="audio-file-actions">
                    <button class="btn btn-danger" onclick="event.stopPropagation(); deleteAudio(${audio.id})">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

// Play audio file
function playAudio(index) {
    if (index < 0 || index >= currentAudioFiles.length) {
        return;
    }

    const audio = currentAudioFiles[index];
    const audioPlayer = document.getElementById('audioPlayer');
    const currentTrack = document.getElementById('currentTrack');
    
    audioPlayer.src = audio.audio_url;
    currentTrack.textContent = `Now Playing: ${audio.title || audio.audio_file.split('/').pop()}`;
    
    // Update active state
    document.querySelectorAll('.audio-file-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`.audio-file-item[data-index="${index}"]`).classList.add('active');
    
    // Play the audio
    audioPlayer.play().catch(error => {
        console.error('Error playing audio:', error);
        showError('Error playing audio file');
    });
}

// Delete audio file
async function deleteAudio(audioId) {
    if (!confirm('Are you sure you want to delete this audio file?')) {
        return;
    }

    try {
        const csrfToken = getCSRFToken();
        const headers = {};
        if (csrfToken) {
            headers['X-CSRFToken'] = csrfToken;
        }
        
        const response = await fetch(`${API_BASE_URL}/audio/${audioId}/`, {
            method: 'DELETE',
            headers: headers,
            credentials: 'same-origin',
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete audio file');
        }

        showStatus('uploadStatus', 'Audio file deleted successfully', 'success');
        await loadAudioFiles(currentUserId);
    } catch (error) {
        showError(error.message);
    }
}

// Handle audio upload form
document.getElementById('audioUploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!currentUserId) {
        showError('Please select a user first');
        return;
    }

    const audioFile = document.getElementById('audioFile').files[0];
    const title = document.getElementById('audioTitle').value;

    if (!audioFile) {
        showError('Please select an audio file');
        return;
    }

    const formData = new FormData();
    formData.append('audio_file', audioFile);
    if (title) {
        formData.append('title', title);
    }

    try {
        showStatus('uploadStatus', 'Uploading...', 'loading');
        
        const csrfToken = getCSRFToken();
        const headers = {};
        if (csrfToken) {
            headers['X-CSRFToken'] = csrfToken;
        }
        
        const response = await fetch(`${API_BASE_URL}/users/${currentUserId}/upload-audio/`, {
            method: 'POST',
            headers: headers,
            body: formData,
            credentials: 'same-origin',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to upload audio file');
        }

        const uploadedAudio = await response.json();
        showStatus('uploadStatus', 'Audio file uploaded successfully!', 'success');
        
        // Reset form
        document.getElementById('audioUploadForm').reset();
        
        // Reload audio files
        await loadAudioFiles(currentUserId);
        
        // Auto-play the newly uploaded file
        setTimeout(() => {
            const newIndex = currentAudioFiles.findIndex(a => a.id === uploadedAudio.id);
            if (newIndex !== -1) {
                playAudio(newIndex);
            }
        }, 500);
        
    } catch (error) {
        showStatus('uploadStatus', error.message, 'error');
    }
});

// Utility functions
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<div class="loading">Loading...</div>';
    }
}

function showStatus(elementId, message, type) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.className = `status-message status-${type}`;
        element.style.display = 'block';
        
        if (type === 'success') {
            setTimeout(() => {
                element.style.display = 'none';
            }, 3000);
        }
    }
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function hideError() {
    document.getElementById('errorMessage').style.display = 'none';
}

// Load users on page load
window.addEventListener('DOMContentLoaded', () => {
    loadUsers();
});

