import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api.ts';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [response, setResponse] = useState('');
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault(); // Prevent page reload

    const resp = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await resp.text();
    if(data === "Registration successful"){
      navigate("/")
    }
     //Not safe to store in local storage?
     setResponse(data);
  };

  return (
    <div className="w-1/4 h-3/4 bg-gray-400 p-4 rounded-lg shadow-lg mx-auto mt-20">
      <h1 className="text-xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label htmlFor="username">Username:</label>
        <input className='bg-white text-black' type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />

        <label htmlFor="email">Email:</label>
        <input className='bg-white text-black' type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />


        <label htmlFor="password">Password:</label>
        <input className='bg-white text-black' type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="submit" className="bg-blue-400 rounded-2xl border border-black w-1/2 mx-auto py-2">
          Register
        </button>
      </form>
      <p className='text-red-600 block w-fit h-5 mx-auto'>{response}</p>
    </div>
  );
}
