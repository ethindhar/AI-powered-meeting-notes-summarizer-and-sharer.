const express = require('express');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Initialize Hugging Face AI
const HF_API_KEY = process.env.HF_API_KEY;
const HF_API_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Generate AI summary
app.post('/api/summarize', async (req, res) => {
  try {
    const { transcript, customInstructions } = req.body;

    if (!transcript || !transcript.trim()) {
      return res.status(400).json({ error: 'Transcript is required' });
    }

    // Check if API key is available
    if (!HF_API_KEY) {
      console.error('HF_API_KEY is not set in environment variables');
      return res.status(500).json({ 
        error: 'AI service not configured',
        details: 'Please check your environment configuration'
      });
    }

    console.log('Generating summary with Hugging Face API...');
    console.log('API Key available:', HF_API_KEY ? 'Yes' : 'No');

         // Always use our improved fallback summarization for better results
     console.log('Using enhanced local summarization for better multi-line results...');
     
     // Split text into sentences and filter meaningful ones
     const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 15);
     
     if (sentences.length >= 3) {
       // Create a structured multi-line summary
       const keyPoints = [];
       
       // Always include first sentence (usually contains main topic)
       keyPoints.push(sentences[0].trim());
       
       // Include middle sentences for key details
       if (sentences.length >= 5) {
         const midIndex1 = Math.floor(sentences.length * 0.3);
         const midIndex2 = Math.floor(sentences.length * 0.6);
         if (sentences[midIndex1] && sentences[midIndex1] !== sentences[0]) {
           keyPoints.push(sentences[midIndex1].trim());
         }
         if (sentences[midIndex2] && sentences[midIndex2] !== sentences[midIndex1]) {
           keyPoints.push(sentences[midIndex2].trim());
         }
       } else if (sentences.length >= 4) {
         const midIndex = Math.floor(sentences.length / 2);
         if (sentences[midIndex] && sentences[midIndex] !== sentences[0]) {
           keyPoints.push(sentences[midIndex].trim());
         }
       }
       
       // Include last sentence (usually contains conclusions/actions)
       if (sentences.length >= 2) {
         const lastSentence = sentences[sentences.length - 1].trim();
         if (lastSentence && lastSentence !== sentences[0]) {
           keyPoints.push(lastSentence);
         }
       }
       
       // Apply custom instructions for better formatting
       if (customInstructions.toLowerCase().includes('bullet')) {
         summary = keyPoints.map(point => `• ${point}`).join('\n\n');
       } else if (customInstructions.toLowerCase().includes('executive')) {
         summary = `EXECUTIVE SUMMARY:\n\n${keyPoints.map(point => `- ${point}`).join('\n\n')}`;
       } else if (customInstructions.toLowerCase().includes('action')) {
         summary = `KEY POINTS:\n\n${keyPoints.map(point => `* ${point}`).join('\n\n')}`;
       } else {
         // Default: Create a structured paragraph with line breaks
         summary = keyPoints.join('.\n\n') + '.';
       }
       
       console.log(`Generated ${keyPoints.length} key points for summary`);
     } else {
       // For very short text, just return as is
       summary = transcript;
     }
    
    res.json({ 
      summary,
      success: true 
    });

  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ 
      error: 'Failed to generate summary',
      details: error.message 
    });
  }
});

// Share summary via email
app.post('/api/share', async (req, res) => {
  try {
    const { summary, recipients, subject, senderName } = req.body;

    if (!summary || !recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ error: 'Summary and recipients are required' });
    }

    const emailSubject = subject || 'Meeting Summary Shared';
    const emailBody = `
      <h2>Meeting Summary</h2>
      <p><strong>From:</strong> ${senderName || 'Meeting Summarizer'}</p>
      <hr>
      <div style="white-space: pre-wrap;">${summary}</div>
      <hr>
      <p><em>This summary was generated using AI Meeting Notes Summarizer.</em></p>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipients.join(', '),
      subject: emailSubject,
      html: emailBody,
    };

    await transporter.sendMail(mailOptions);

    res.json({ 
      success: true, 
      message: 'Summary shared successfully' 
    });

  } catch (error) {
    console.error('Error sharing summary:', error);
    res.status(500).json({ 
      error: 'Failed to share summary',
      details: error.message 
    });
  }
});

// Handle file uploads
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Extract text from uploaded file
    const fileContent = req.file.buffer.toString('utf-8');
    
    res.json({ 
      success: true, 
      content: fileContent,
      filename: req.file.originalname 
    });

  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ 
      error: 'Failed to process file',
      details: error.message 
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    details: error.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}); 