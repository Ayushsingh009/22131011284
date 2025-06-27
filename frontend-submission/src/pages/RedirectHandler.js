import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Log } from '../utils/log';

const RedirectHandler = () => {
  const { shortcode } = useParams();
  const [error, setError] = useState('');

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem("shortUrls") || "[]");
    const entry = all.find(item => item.shortcode === shortcode);

    if (!entry) {
      setError("Shortcode not found.");
      Log("frontend", "error", "component", `Shortcode not found: ${shortcode}`);
      return;
    }

    const now = Date.now();
    if (now > entry.expiresAt) {
      setError("This link has expired.");
      Log("frontend", "error", "component", `Shortcode expired: ${shortcode}`);
      return;
    }

    // Track click
    const click = {
      timestamp: now,
      source: document.referrer || "Unknown",
      location: "Mock-India" // You can hardcode "Unknown" or "Mock-India"
    };

    entry.clicks.push(click);

    // Save updated entry
    const updated = all.map(item => item.shortcode === shortcode ? entry : item);
    localStorage.setItem("shortUrls", JSON.stringify(updated));

    Log("frontend", "info", "component", `Redirected: ${shortcode}`);

    // Redirect after 1 second (let logging complete)
    setTimeout(() => {
      window.location.href = entry.longUrl;
    }, 1000);
  }, [shortcode]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      {error ? (
        <h2>{error}</h2>
      ) : (
        <h2>Redirecting to your destination...</h2>
      )}
    </div>
  );
};

export default RedirectHandler;
