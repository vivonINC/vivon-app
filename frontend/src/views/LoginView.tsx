import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api.ts';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault(); // Prevent page reload

    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if(response.ok){
      sessionStorage.setItem("token", data.token)

      const response = await fetch(`${API_BASE_URL}/api/users/me`, {
      headers: {
        "Authorization": `Bearer ${data.token}`
      }
    });
    const text = await response.text();
    sessionStorage.setItem("myID", text);

    const res = await fetch(`${API_BASE_URL}/api/users/getUsernameAndAvatar?ids=${text}`, {
      headers: {
        "Authorization": `Bearer ${data.token}`
      },
    });

    const resData = await res.json();
    const { username, avatar } = resData[0];

    sessionStorage.setItem("username", username);
    sessionStorage.setItem("avatar", avatar);

    navigate("/home");

    }
    else{
      setError('Not a valid login')
    }
  };

  return (
    <div className="w-1/4 bg-gray-500 p-4 rounded-lg shadow-lg mx-auto my-auto mt-20">
      <h1 className="text-xl font-bold mb-4 text-center ">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <label className="mb-1" htmlFor="email">Email:</label>
        <input className='bg-white rounded-sm text-black' type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label className='mt-3 mb-1' htmlFor="password">Password:</label>
        <input className='bg-white rounded-sm text-black' type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="submit" className="mt-5 bg-blue-400 rounded-2xl border border-black w-1/2 mx-auto py-2 mb-2">
          Login
        </button>
      </form>
      <a onClick={() => navigate("/register")} className='w-1/2 mx-auto'>Don't have an account? <p className='text-blue-700 inline'>Register here</p> </a>
      <p className='text-red-600 block w-fit h-5 mx-auto'>{error}</p>
    </div>
  );
}
