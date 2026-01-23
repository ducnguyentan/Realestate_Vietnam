'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function TestAuthPage() {
  const { user, loading, isAuthenticated } = useAuth();

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Auth Test Page</h1>
      <hr />
      <h2>Loading: {loading ? 'TRUE' : 'FALSE'}</h2>
      <h2>Is Authenticated: {isAuthenticated ? 'TRUE' : 'FALSE'}</h2>
      <hr />
      <h2>User Object:</h2>
      <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
}
