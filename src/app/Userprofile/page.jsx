"use client"
import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import UserList from './(pagesComponants)/UserList';
// import AddUser from './(pagesComponants)/AddUser';
import EditUser from './(pagesComponants)/edituser/EditUser';
import UserView from './(pagesComponants)/UserView';

import DataEntry from './(pagesComponants)/DataEntry';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider >
 
      <UserList></UserList>
     
    </UserProvider>
  );
}

export default App;