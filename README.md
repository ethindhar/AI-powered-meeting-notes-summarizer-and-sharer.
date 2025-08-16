# AI Meeting Notes Summarizer

An AI-powered application that summarizes meeting transcripts and allows sharing via email.

## Features

- 📝 Upload text transcripts (meeting notes, call transcripts)
- 🎯 Custom instruction/prompt input for tailored summaries
- 🤖 AI-powered summary generation using OpenAI
- ✏️ Editable generated summaries
- 📧 Email sharing functionality
- 🎨 Modern, responsive UI

## Tech Stack

- **Frontend**: React.js with modern UI components
- **Backend**: Node.js + Express.js
- **AI Service**: OpenAI GPT API
- **Email**: Nodemailer for sending summaries
- **Styling**: CSS with modern design principles

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key
- Email credentials (Gmail recommended)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install-all
   ```

3. Configure environment variables:
   - Copy `env.example` to `.env`
   - Add your OpenAI API key
   - Add your email credentials

4. Start the development servers:
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Usage

1. **Upload Transcript**: Paste or upload your meeting transcript
2. **Custom Instructions**: Enter specific requirements (e.g., "Summarize in bullet points for executives")
3. **Generate Summary**: Click to generate AI-powered summary
4. **Edit**: Modify the generated summary as needed
5. **Share**: Send the summary via email to recipients

## API Endpoints

- `POST /api/summarize` - Generate AI summary
- `POST /api/share` - Share summary via email
- `POST /api/upload` - Handle file uploads

## Environment Variables

- `OPENAI_API_KEY` - Your OpenAI API key
- `EMAIL_HOST` - SMTP server host
- `EMAIL_PORT` - SMTP server port
- `EMAIL_USER` - Your email address
- `EMAIL_PASS` - Your email password/app password

## Contributing

Feel free to submit issues and enhancement requests! 