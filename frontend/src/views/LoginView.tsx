import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault(); // Prevent page reload

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if(response.ok){
      window.localStorage.setItem("token", data.token)
      navigate("/home")

    }
    else{
      console.log(response.status.toString)
    }
     //Not safe to store in local storage?
  };

  return (
    <div className="w-1/4 h-3/4 bg-gray-400 p-4 rounded-lg shadow-lg mx-auto mt-20">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label htmlFor="email">Email:</label>
        <input className='bg-white text-black' type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="password">Password:</label>
        <input className='bg-white text-black' type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="submit" className="bg-blue-400 rounded-2xl border border-black w-1/2 mx-auto py-2">
          Login
        </button>
      </form>
      <button onClick={() => navigate("/register")} className=' mt-2 block w-1/2 mx-auto bg-blue-400 rounded-2xl border border-black'>Registration</button>
    </div>
  );
}
