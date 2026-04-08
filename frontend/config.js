// API Configuration
// Change this to switch between local and production backend

const API_CONFIG = {
    // For local development
    LOCAL: 'http://localhost:5000',
    
    // For production (Render)
    PRODUCTION: 'https://my-garage-backend-na1w.onrender.com',
    
    // Current mode - change this to switch
    MODE: 'PRODUCTION' // Change to 'PRODUCTION' when testing with Render
};

// Export the current API URL
const API_URL = API_CONFIG[API_CONFIG.MODE];
// this is the production url for the backend which is hosted on render