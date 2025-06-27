// src/pages/StatsPage.js
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Box, Paper, Table, TableHead, TableBody,
  TableRow, TableCell
} from '@mui/material';
import { Log } from '../utils/log';

const StatsPage = () => {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("shortUrls") || "[]");
    setUrls(stored);
    Log("frontend", "info", "component", "Stats page loaded");
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        URL Shortener Statistics
      </Typography>

      {urls.length === 0 ? (
        <Typography>No shortened URLs found.</Typography>
      ) : (
        urls.map((entry, idx) => (
          <Paper key={idx} sx={{ p: 2, mb: 4 }}>
            <Typography variant="h6">
              <a href={`http://localhost:3000/${entry.shortcode}`} target="_blank" rel="noreferrer">
                http://localhost:3000/{entry.shortcode}
              </a>
            </Typography>
            <Typography>Original URL: {entry.longUrl}</Typography>
            <Typography>Created: {new Date(entry.createdAt).toLocaleString()}</Typography>
            <Typography>Expires: {new Date(entry.expiresAt).toLocaleString()}</Typography>
            <Typography>Total Clicks: {entry.clicks.length}</Typography>

            {entry.clicks.length > 0 && (
              <Box mt={2}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Source</TableCell>
                      <TableCell>Location</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {entry.clicks.map((click, i) => (
                      <TableRow key={i}>
                        <TableCell>{new Date(click.timestamp).toLocaleString()}</TableCell>
                        <TableCell>{click.source}</TableCell>
                        <TableCell>{click.location}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
          </Paper>
        ))
      )}
    </Container>
  );
};

export default StatsPage;
