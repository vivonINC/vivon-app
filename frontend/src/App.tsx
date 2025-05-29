import Sidebar from './components/sidebar/Sidebar';
import placeholder from './assets/placeholder.png';

function App() {
  // Mock data - in a real app, this would come from props, context, or API
  const user = {
    username: 'Username',
    avatar: placeholder,
    status: 'Fucking about..',
  };

  const friends = [
    {
      id: '1',
      name: 'friend 1',
      avatar: placeholder,
      lastMessage: 'Oh yeah.. heard about that',
    },
    {
      id: '2',
      name: 'friend 2',
      avatar: placeholder,
      lastMessage: 'what?',
    },
    {
      id: '3',
      name: 'friend 3',
      avatar: placeholder,
      lastMessage: "lol. That's kek",
    },
  ];

  return (
    <div className="absolute inset h-screen w-screen overflow-hidden bg-stone-900 p-2">
      <Sidebar user={user} friends={friends} />
    </div>
  );
}

export default App;
