import { useState } from 'react';
import './App.css';
import { Box, Button, CircularProgress, Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Tooltip } from '@mui/material';
import axios from 'axios';
import { ContentCopy, Check, Brightness4, Brightness7 } from '@mui/icons-material';

/**
 * Email Reply Generator
 * 
 * This React component renders a page to generate a reply to an email.
 * 
 * Features:
 * - Text input for the original email content
 * - Select input for the tone of the reply
 * - Button to generate the reply
 * - Read-only text input to display the generated reply
 * - Copy to Clipboard button for the generated reply
 * - Switch between light and dark modes
 * - Error message on generation failure
 * - Loading indicator while generating reply
 */

// Component for toggling dark and light modes
const ThemeToggleButton = ({ darkMode, setDarkMode }) => (
  <Button 
    variant='outlined'
    sx={{ position: 'absolute', top: 16, right: 16 }}
    onClick={() => setDarkMode(!darkMode)}
  >
    {darkMode ? <Brightness7 /> : <Brightness4 />}
  </Button>
);

// Component for displaying error messages
const ErrorMessage = ({ error }) => (
  error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
);

function App() {
  // State variables
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  /**
   * Handles the submission of the email content and tone to generate a reply.
   * Uses Axios to POST data to the server and updates the state with the generated reply.
   */
  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:8080/api/email/generate', { emailContent, tone });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      setError('Failed to generate email reply. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4, backgroundColor: darkMode ? '#333' : '#fff', color: darkMode ? '#fff' : '#000' }}>
      <ThemeToggleButton darkMode={darkMode} setDarkMode={setDarkMode} />

      <Typography variant='h3' component="h1" gutterBottom sx={{
        backgroundColor: darkMode ? '#444' : '#f0f0f0',
        padding: '16px',
        marginBottom: '24px',
        textAlign: 'center',
        borderRadius: '8px',
        boxShadow: darkMode ? '0 4px 8px rgba(0, 0, 0, 0.5)' : '0 4px 8px rgba(0, 0, 0, 0.1)'
      }}>
        Email Reply Generator
      </Typography>

      <Box sx={{ mx: 3 }}>
        <TextField 
          fullWidth
          multiline
          rows={6}
          variant='outlined'
          label="Original Email Content"
          value={emailContent || ''}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{ 
            mb: 2,
            backgroundColor: darkMode ? '#555' : '#fff',
            input: { color: darkMode ? '#fff' : '#000' },
            label: { color: darkMode ? '#bbb' : '#000' }
          }}
        />

        <FormControl fullWidth sx={{ mb: 2, backgroundColor: darkMode ? '#555' : '#fff' }}>
          <InputLabel sx={{ color: darkMode ? '#bbb' : '#000' }}>Tone (Optional)</InputLabel>
          <Select
            value={tone || ''}
            label={"Tone (Optional)"}
            onChange={(e) => setTone(e.target.value)}
            sx={{ color: darkMode ? '#fff' : '#000' }}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="professional">Professional</MenuItem>
            <MenuItem value="casual">Casual</MenuItem>
            <MenuItem value="friendly">Friendly</MenuItem>
          </Select>
        </FormControl>

        <Button 
          variant='contained' 
          onClick={handleSubmit}
          disabled={!emailContent || loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : 'Generate Reply'}
        </Button>
      </Box>

      <ErrorMessage error={error} />

      {generatedReply && (
        <Box sx={{ mt: 3 }}>
          <Typography variant='h6' gutterBottom>
            Generated Reply:
          </Typography>
          <TextField 
            fullWidth
            multiline
            rows={6}
            variant='outlined'
            value={generatedReply || ''}
            InputProps={{ readOnly: true }}
            sx={{ 
              backgroundColor: darkMode ? '#555' : '#fff',
              input: { color: darkMode ? '#fff' : '#000' },
              label: { color: darkMode ? '#bbb' : '#000' }
            }}
          />

          <Tooltip title="Copy to Clipboard">
            <Button 
              variant='outlined'
              sx={{ mt: 2 }}
              onClick={() => {
                navigator.clipboard.writeText(generatedReply);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}>
              {copied ? <Check /> : <ContentCopy />}
            </Button>
          </Tooltip>
        </Box>
      )}
    </Container>
  );
}

export default App;
