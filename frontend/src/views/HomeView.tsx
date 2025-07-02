import { useNavigate } from "react-router-dom";

export default function Home() {
  const nav = useNavigate();
  function handleClick(){
    nav("/testPage")
  }
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900">Home view</h1>
      <p className="mt-4 text-gray-600">Vivon!</p>
      <button onClick={handleClick} className="bg-white text-amber-300">Go to Test page</button>
    </div>
  );
}
