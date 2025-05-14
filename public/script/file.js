// Function to fetch and display user's files
async function fetchUserFiles() {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/files', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (res.ok) {
      const files = await res.json();
      // Display files in the dashboard
    } else {
      console.error('Failed to fetch files');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Logout function
function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login.html';
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('token')) {
    window.location.href = '/login.html';
  } else {
    fetchUserFiles();
  }
});