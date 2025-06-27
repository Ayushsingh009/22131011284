// src/pages/ShortenerPage.js
import React, { useState } from 'react';
import {
  Container, TextField, Button, Typography, Grid, Box, Paper
} from '@mui/material';
import { Log } from '../utils/log';
import { generateCode, isValidUrl } from '../utils/helpers';

const ShortenerPage = () => {
  const [inputs, setInputs] = useState([
    { longUrl: '', validity: '', shortcode: '' }
  ]);
  const [results, setResults] = useState([]);

  const handleChange = (index, field, value) => {
    const updated = [...inputs];
    updated[index][field] = value;
    setInputs(updated);
  };

  const addField = () => {
    if (inputs.length >= 5) return;
    setInputs([...inputs, { longUrl: '', validity: '', shortcode: '' }]);
  };

  const handleSubmit = () => {
    const newResults = [];

    for (let i = 0; i < inputs.length; i++) {
      const { longUrl, validity, shortcode } = inputs[i];

      if (!isValidUrl(longUrl)) {
        Log("frontend", "error", "component", `Invalid URL at index ${i}`);
        alert(`Invalid URL at position ${i + 1}`);
        return;
      }

      const validMins = validity ? parseInt(validity) : 30;
      if (validity && isNaN(validMins)) {
        Log("frontend", "error", "component", `Invalid validity at index ${i}`);
        alert(`Invalid validity at position ${i + 1}`);
        return;
      }

      const code = shortcode || generateCode();
      const now = Date.now();
      const data = {
        longUrl,
        shortcode: code,
        createdAt: now,
        expiresAt: now + validMins * 60 * 1000,
        clicks: []
      };

      // Save to localStorage
      let all = JSON.parse(localStorage.getItem("shortUrls") || "[]");
      const exists = all.find(item => item.shortcode === code);
      if (exists) {
        Log("frontend", "error", "component", `Shortcode collision at index ${i}`);
        alert(`Shortcode already exists at position ${i + 1}`);
        return;
      }
      all.push(data);
      localStorage.setItem("shortUrls", JSON.stringify(all));
      newResults.push(data);

      Log("frontend", "info", "component", `Shortcode created: ${code}`);
    }

    setResults(newResults);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        URL Shortener
      </Typography>

      {inputs.map((input, idx) => (
        <Paper key={idx} sx={{ p: 2, mb: 2 }}>
          <Grid container columns={12} spacing={2}>
            <Grid sx={{ gridColumn: 'span 6' }}>
              <TextField
                fullWidth
                label="Long URL"
                value={input.longUrl}
                onChange={(e) => handleChange(idx, 'longUrl', e.target.value)}
              />
            </Grid>
            <Grid sx={{ gridColumn: 'span 3' }}>
              <TextField
                fullWidth
                label="Validity (minutes)"
                value={input.validity}
                onChange={(e) => handleChange(idx, 'validity', e.target.value)}
              />
            </Grid>
            <Grid sx={{ gridColumn: 'span 3' }}>
              <TextField
                fullWidth
                label="Custom Shortcode (optional)"
                value={input.shortcode}
                onChange={(e) => handleChange(idx, 'shortcode', e.target.value)}
              />
            </Grid>
          </Grid>
        </Paper>
      ))}

      {inputs.length < 5 && (
        <Button variant="outlined" onClick={addField}>
          + Add Another URL
        </Button>
      )}

      <Box mt={3}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Shorten URLs
        </Button>
      </Box>

      {results.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6">Shortened URLs:</Typography>
          {results.map((res, idx) => (
            <Box key={idx} sx={{ mt: 1 }}>
              <a href={`http://localhost:3000/${res.shortcode}`}>
                http://localhost:3000/{res.shortcode}
              </a> <br />
              <small>Expires at: {new Date(res.expiresAt).toLocaleString()}</small>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default ShortenerPage;
