// app/Userprofile/layout.jsx
"use client";

import React from 'react';
import Layout from './components/layout/Layout';
import { UserProvider } from './context/UserContext'; // Adjust path if needed

export default function UserProfileLayout({ children }) {
  return (
    <UserProvider>
        <Layout> {children}</Layout>

     
    </UserProvider>
  );
}
