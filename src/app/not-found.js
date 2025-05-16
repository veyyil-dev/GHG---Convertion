'use client';

import Image from 'next/image';
import pageNotFound from '../assets/images/pageNotFound.jpg';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <Image
        src={pageNotFound}
        alt="Page Not Found"
        width={500}
        height={350}
        style={{
          maxWidth: '100%',
          height: 'auto',
          borderRadius: '12px',
          marginBottom: '2rem',
        }}
      />

      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#1f2937' }}>
        Oops! Page Not Found
      </h1>
      <p style={{ fontSize: '1rem', marginBottom: '2rem', color: '#4b5563' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>

      <a
        href="/"
        style={{
          display: 'inline-block',
          backgroundColor: '#3b82f6',
          color: '#fff',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          textDecoration: 'none',
          transition: 'background-color 0.3s ease',
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = '#2563eb')}
        onMouseLeave={(e) => (e.target.style.backgroundColor = '#3b82f6')}
      >
        ⬅ Go back to Home
      </a>
    </div>
  );
}
