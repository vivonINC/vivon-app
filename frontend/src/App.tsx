import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Sidebar from './components/sidebar/Sidebar';
import ChatView from './views/ChatView';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-stone-950 flex flex-row min-h-screen p-2">
        <Sidebar />
        <main className="bg-stone-950 text-white w-full">
          <Routes>
            <Route path="/" element={<div>Home Route</div>} />
            <Route path="/chat/:friendId" element={<ChatView />} />
          </Routes>
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;
