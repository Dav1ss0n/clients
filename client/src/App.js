// import logo from './logo.svg';
import './App.css';

import React, {useState, useEffect} from 'react';

import SearchPage from './SearchPage';
import SettingsPage from './SettingsPage';

// Pages:
// Search Page
// Settings
// Business Page


// Settings Page:
// Content -> Business Icons
// Navbar -> Search Page Icon - Settings Page


export default function App() {
  // By default 'SearchPage' is on the display:
  const [tab, setTab] = useState("SearchPage");

  // Get Components' name from button's value property (at navbar)
  function handleSwitchTabs(e) {
    setTab(e.target.value);
  }

  // Register all pages here:
  // Keys are strings : values are component names.
  const pages = {
    SearchPage: SearchPage,
    SettingsPage: SettingsPage
  };
  
  // Tab Switcher Render
  function select(x) {
    const Page = pages[x];
    return <Page onClick={handleSwitchTabs}/>;
  }


  return (
    <>
      {select(tab)}
    </>
  );

}