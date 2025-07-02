import { useState, useEffect } from 'react';

export default function TestPage() {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use useEffect to make API calls
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          setError("No token found");
          return;
        }

        const response = await fetch("/api/users/me", {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (response.ok) {
          const responseData = await response.text();
          console.log('API Response:', responseData);
          setData(responseData);
        } else {
          setError(`Request failed: ${response.status} ${response.statusText}`);
        }
      } catch (err) {
        setError(`Network error: ${err}`);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900">Test</h1>
      <p className="mt-4 text-gray-600">This page can be used to test API calls</p>
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}
      
      <div className="mt-4">
        <strong>Data:</strong>
        {loading ? (
          <p>Loading...</p>
        ) : data ? (
          <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto text-sm text-amber-500">
            {data}
          </pre>
        ) : (
          <p>No data</p>
        )}
      </div>
    </div>
  );
}