import { Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import LoginView from "./views/LoginView.tsx";
import Home from './views/HomeView.tsx';
import TestPage from './views/TestPage.tsx';

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
      <div className="min-h-screen">
        <main className="min-h-screen bg-stone-950 text-white">
          <Routes>
            <Route path="/" element={<LoginView/>} />
            <Route path = "/home" element={<Home/>} />
            <Route path = "/testPage" element={<TestPage/>} />
          </Routes>
        </main>
      </div>
    </QueryClientProvider>
  )
}

export default App
