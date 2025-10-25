import { Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import LoginView from "./views/LoginView.tsx";
import Home from './views/HomeView.tsx';
import Register  from './views/RegisterView.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <main className="min-h-screen bg-stone-950 text-white flex items-center justify-center">
          <Routes>
            <Route path="/" element={<LoginView/>} />
            <Route path = "/register" element={<Register/>} />
            <Route path = "/home" element={<Home/>} />
          </Routes>
        </main>
    </QueryClientProvider>
  )
}

export default App
