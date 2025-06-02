import { Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

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
        <main className="bg-stone-950 text-white">
          <Routes>
            <Route path="/" element={<div>Home Route</div>} />
          </Routes>
        </main>
      </div>
    </QueryClientProvider>
  )
}

export default App
