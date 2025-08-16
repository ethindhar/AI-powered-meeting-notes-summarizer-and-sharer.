import React, { useState, useRef } from 'react';
import './App.css';
import { API_BASE_URL } from './config';

function App() {
  const [transcript, setTranscript] = useState('');
  const [customInstructions, setCustomInstructions] = useState('');
  const [summary, setSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [alert, setAlert] = useState(null);
  const [recipients, setRecipients] = useState([]);
  const [newRecipient, setNewRecipient] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [senderName, setSenderName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedSummary, setEditedSummary] = useState('');
  
  const fileInputRef = useRef(null);

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setAlert({ type: 'error', message: 'File size must be less than 10MB' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        setTranscript(data.content);
        setAlert({ type: 'success', message: `File "${data.filename}" uploaded successfully!` });
      } else {
        setAlert({ type: 'error', message: data.error || 'Failed to upload file' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to upload file' });
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (e) => setTranscript(e.target.result);
        reader.readAsText(file);
        setAlert({ type: 'success', message: `File "${file.name}" loaded successfully!` });
      } else {
        setAlert({ type: 'error', message: 'Please upload a text file (.txt)' });
      }
    }
  };

  // Generate summary
  const generateSummary = async () => {
    if (!transcript.trim()) {
      setAlert({ type: 'error', message: 'Please enter or upload a transcript first' });
      return;
    }

    setIsGenerating(true);
    setAlert(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript: transcript.trim(),
          customInstructions: customInstructions.trim(),
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setSummary(data.summary);
        setEditedSummary(data.summary);
        setAlert({ type: 'success', message: 'Summary generated successfully!' });
      } else {
        setAlert({ type: 'error', message: data.error || 'Failed to generate summary' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to generate summary. Please check your connection.' });
    } finally {
      setIsGenerating(false);
    }
  };

  // Add recipient
  const addRecipient = () => {
    const email = newRecipient.trim();
    if (email && !recipients.includes(email)) {
      setRecipients([...recipients, email]);
      setNewRecipient('');
    }
  };

  // Remove recipient
  const removeRecipient = (email) => {
    setRecipients(recipients.filter(r => r !== email));
  };

  // Share summary
  const shareSummary = async () => {
    if (!summary.trim()) {
      setAlert({ type: 'error', message: 'Please generate a summary first' });
      return;
    }

    if (recipients.length === 0) {
      setAlert({ type: 'error', message: 'Please add at least one recipient' });
      return;
    }

    setIsSharing(true);
    setAlert(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: editedSummary,
          recipients,
          subject: emailSubject || 'Meeting Summary Shared',
          senderName: senderName || 'Meeting Summarizer',
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setAlert({ type: 'success', message: 'Summary shared successfully!' });
        // Reset form
        setRecipients([]);
        setEmailSubject('');
        setSenderName('');
      } else {
        setAlert({ type: 'error', message: data.error || 'Failed to share summary' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to share summary. Please check your connection.' });
    } finally {
      setIsSharing(false);
    }
  };

  // Start editing
  const startEditing = () => {
    setIsEditing(true);
    setEditedSummary(summary);
  };

  // Save edits
  const saveEdits = () => {
    setSummary(editedSummary);
    setIsEditing(false);
    setAlert({ type: 'success', message: 'Summary updated successfully!' });
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
    setEditedSummary(summary);
  };

  // Clear alert after 5 seconds
  React.useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  return (
    <div className="App">
      <div className="container">
        <header className="app-header">
          <h1 className="app-title">AI Meeting Summarizer</h1>
          <p className="app-subtitle">Transform your meeting transcripts into actionable insights</p>
        </header>

        {alert && (
          <div className={`alert alert-${alert.type}`}>
            {alert.message}
          </div>
        )}

        <main className="main-content">
          <h2 className="section-title">📝 Upload Transcript</h2>
          
          <div className="form-group">
            <label className="form-label">Or paste your transcript here:</label>
            <textarea
              className="form-textarea"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste your meeting transcript, call notes, or any text content here..."
            />
          </div>

          <div 
            className="file-upload"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.text"
              onChange={handleFileUpload}
            />
            <div className="file-upload-text">📁 Click to upload or drag & drop</div>
            <div className="file-upload-subtext">Supports .txt files up to 10MB</div>
          </div>

          <div className="form-group">
            <label className="form-label">Custom Instructions (Optional):</label>
            <input
              type="text"
              className="form-input"
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="e.g., 'Summarize in bullet points for executives' or 'Highlight only action items'"
            />
          </div>

          <button
            className="btn"
            onClick={generateSummary}
            disabled={isGenerating || !transcript.trim()}
          >
            {isGenerating ? (
              <>
                <span className="loading"></span>
                Generating Summary...
              </>
            ) : (
              '🤖 Generate Summary'
            )}
          </button>

          {summary && (
            <div className="summary-section">
              <h2 className="section-title">📋 Generated Summary</h2>
              
              {isEditing ? (
                <div>
                  <textarea
                    className="summary-content"
                    value={editedSummary}
                    onChange={(e) => setEditedSummary(e.target.value)}
                    placeholder="Edit your summary here..."
                  />
                  <div style={{ marginTop: '15px' }}>
                    <button className="btn btn-success" onClick={saveEdits} style={{ marginRight: '10px' }}>
                      💾 Save Changes
                    </button>
                    <button className="btn btn-secondary" onClick={cancelEditing}>
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="summary-content">{summary}</div>
                  <button className="btn btn-secondary" onClick={startEditing} style={{ marginTop: '15px' }}>
                    ✏️ Edit Summary
                  </button>
                </div>
              )}
            </div>
          )}

          {summary && (
            <div className="share-section">
              <h2 className="section-title">📧 Share Summary</h2>
              
              <div className="form-group">
                <label className="form-label">Your Name:</label>
                <input
                  type="text"
                  className="form-input"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Subject:</label>
                <input
                  type="text"
                  className="form-input"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Meeting Summary Shared"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Recipients:</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="email"
                    className="form-input"
                    value={newRecipient}
                    onChange={(e) => setNewRecipient(e.target.value)}
                    placeholder="Enter email address"
                    onKeyPress={(e) => e.key === 'Enter' && addRecipient()}
                  />
                  <button className="btn btn-secondary" onClick={addRecipient}>
                    ➕ Add
                  </button>
                </div>
              </div>

              {recipients.length > 0 && (
                <div className="recipients-input">
                  {recipients.map((email, index) => (
                    <div key={index} className="recipient-tag">
                      {email}
                      <button onClick={() => removeRecipient(email)}>×</button>
                    </div>
                  ))}
                </div>
              )}

              <button
                className="btn btn-success"
                onClick={shareSummary}
                disabled={isSharing || recipients.length === 0}
              >
                {isSharing ? (
                  <>
                    <span className="loading"></span>
                    Sharing...
                  </>
                ) : (
                  '📤 Share Summary'
                )}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App; 