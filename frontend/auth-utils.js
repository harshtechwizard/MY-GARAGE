// Shared authentication utilities

// Check if user is authenticated
function isAuthenticated() {
    return !!localStorage.getItem('authToken');
}

// Get current user type
function getUserType() {
    return localStorage.getItem('userType');
}

// Get user info
function getUserInfo() {
    return {
        token: localStorage.getItem('authToken'),
        userType: localStorage.getItem('userType'),
        userName: localStorage.getItem('userName'),
        garageId: localStorage.getItem('garageId'),
        garageName: localStorage.getItem('garageName')
    };
}

// Logout function
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    localStorage.removeItem('garageId');
    localStorage.removeItem('garageName');
    window.location.href = 'index.html';
}

// Add logout button to page if authenticated
function addLogoutButton() {
    if (!isAuthenticated()) return;

    const userInfo = getUserInfo();
    const displayName = userInfo.userName || userInfo.garageName || 'User';
    const userTypeLabel = userInfo.userType === 'garage' ? '🔧 Garage' : '👤 Customer';

    // Create auth bar
    const authBar = document.createElement('div');
    authBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        padding: 0.75rem 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 1000;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    `;

    authBar.innerHTML = `
        <div style="color: rgba(255, 255, 255, 0.9); font-size: 0.9rem;">
            <span style="color: var(--accent-gold);">${userTypeLabel}</span> ${displayName}
        </div>
        <button onclick="logout()" style="
            background: rgba(255, 59, 48, 0.2);
            border: 1px solid rgba(255, 59, 48, 0.5);
            color: #ff3b30;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.875rem;
            font-weight: 600;
            transition: all 0.2s;
        " onmouseover="this.style.background='rgba(255, 59, 48, 0.3)'" onmouseout="this.style.background='rgba(255, 59, 48, 0.2)'">
            🚪 Logout
        </button>
    `;

    document.body.insertBefore(authBar, document.body.firstChild);
    
    // Add padding to body to account for fixed auth bar
    document.body.style.paddingTop = '60px';
}

// Initialize on page load
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', addLogoutButton);
}
