import React from 'react';
import NowPlaying from './components/NowPlaying';
import SearchSong from './components/SearchSong';
import QueueButton from './components/QueueButton';
import CashAppSection from './components/CashAppSection';
import ContactInfo from './components/ContactInfo';
import './App.scss'; // You handle the styling here

function App ()
{
  
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_ID;
  const refresh_token = process.env.SPOTIFY_CLIENT_ID;

  console.log( client_id );
  
  return (
    <div className="App">
      <header className="App-header">
        {/* <h1>Welcome to the Party!</h1> */}
      </header>
      <NowPlaying client_id={client_id}
        refresh_token={refresh_token}
        client_secret={client_secret} />
      <SearchSong />
      <QueueButton />
      <CashAppSection />
      <ContactInfo />
    </div>
  );
}

export default App;
