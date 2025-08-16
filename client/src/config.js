// Configuration for different environments
const config = {
  development: {
    apiUrl: 'http://localhost:5000'
  },
  production: {
    apiUrl: process.env.REACT_APP_API_URL || 'https://your-backend-url.railway.app'
  }
};

// Get current environment
const env = process.env.NODE_ENV || 'development';

// Export the appropriate config
export const API_BASE_URL = config[env].apiUrl;
export default config[env];
