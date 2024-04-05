import React, { useEffect, useState } from 'react';
import NowPlaying from './components/NowPlaying';
import SearchSong from './components/SearchSong';
import QueueButton from './components/QueueButton';
import CashAppSection from './components/CashAppSection';
import ContactInfo from './components/ContactInfo';
import './App.scss';

function App() {
  const [spotifyCredentials, setSpotifyCredentials] = useState(null);

  useEffect(() => {
  const fetchSpotifyCredentials = async () => {
  try {
    const authToken = 'xS3adzX3byAGXiEzpw'; // Your authorization token
    const headers = new Headers({
      'Authorization': `Bearer ${authToken}`
    });
    const response = await fetch('/api/spotify-auth', { headers });
    if (!response.ok) {
      throw new Error('Failed to fetch Spotify credentials');
    }
    const data = await response.json();
    setSpotifyCredentials(data);
  } catch (error) {
    console.error(error);
  }
};


    fetchSpotifyCredentials();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {/* <h1>Welcome to the Party!</h1> */}
      </header>
      {spotifyCredentials && (
        <NowPlaying
          client_id={spotifyCredentials.client_id}
          client_secret={spotifyCredentials.client_secret}
          refresh_token={spotifyCredentials.refresh_token}
        />
      )}
      <SearchSong />
      <QueueButton />
      <CashAppSection />
      <ContactInfo />
    </div>
  );
}

export default App;
