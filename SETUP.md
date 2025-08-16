# Setup Guide - AI Meeting Notes Summarizer

## Quick Start (Windows)

1. **Double-click `start.bat`** - This will automatically install dependencies and start the application

## Quick Start (Mac/Linux)

1. **Make the script executable and run it:**
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

## Manual Setup

### Prerequisites

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **OpenAI API Key** - [Get one here](https://platform.openai.com/api-keys)
- **Email credentials** (Gmail recommended)

### Step 1: Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### Step 2: Configure Environment Variables

1. **Copy the example environment file:**
   ```bash
   copy env.example .env
   ```

2. **Edit `.env` with your credentials:**
   ```env
   # OpenAI API Configuration
   OPENAI_API_KEY=sk-your-actual-api-key-here
   
   # Email Configuration (Gmail example)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password-here
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

### Step 3: Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password:**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in `EMAIL_PASS`

### Step 4: Start the Application

```bash
# Start both frontend and backend
npm run dev

# Or start them separately:
npm run server    # Backend on port 5000
npm run client    # Frontend on port 3000
```

### Step 5: Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## Troubleshooting

### Common Issues

1. **Port already in use:**
   - Change `PORT` in `.env` file
   - Kill processes using the ports: `npx kill-port 3000 5000`

2. **OpenAI API errors:**
   - Verify your API key is correct
   - Check your OpenAI account has credits
   - Ensure the API key has proper permissions

3. **Email sending fails:**
   - Verify email credentials
   - Check if 2FA is enabled (required for Gmail)
   - Use app password, not regular password
   - Check firewall/antivirus settings

4. **Dependencies installation fails:**
   - Clear npm cache: `npm cache clean --force`
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

5. **React app won't start:**
   - Ensure you're in the root directory
   - Check if `client` folder exists
   - Verify `client/package.json` exists

### File Structure

```
ai-meeting-summarizer/
├── server/
│   └── index.js          # Backend server
├── client/
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── App.js        # Main React component
│   │   ├── App.css       # Component styles
│   │   ├── index.js      # React entry point
│   │   └── index.css     # Global styles
│   └── package.json      # Frontend dependencies
├── package.json          # Backend dependencies
├── env.example           # Environment variables template
├── start.bat            # Windows startup script
├── start.sh             # Unix startup script
├── README.md            # Project overview
└── SETUP.md             # This file
```

### API Endpoints

- `GET /api/health` - Health check
- `POST /api/summarize` - Generate AI summary
- `POST /api/share` - Share summary via email
- `POST /api/upload` - Handle file uploads

### Testing the Application

1. **Upload a sample transcript:**
   - Create a `.txt` file with meeting notes
   - Or paste text directly into the textarea

2. **Generate a summary:**
   - Add custom instructions (optional)
   - Click "Generate Summary"

3. **Edit the summary:**
   - Click "Edit Summary"
   - Make changes
   - Save or cancel

4. **Share via email:**
   - Add recipient emails
   - Customize subject and sender name
   - Click "Share Summary"

## Support

If you encounter issues:

1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure all dependencies are installed
4. Check the troubleshooting section above

## Security Notes

- Never commit your `.env` file to version control
- Keep your OpenAI API key secure
- Use app passwords for email, not regular passwords
- The application runs locally by default for security 