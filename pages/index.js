
import { useState } from 'react';
import { Container } from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import Auth from '../components/Auth';
import AddTodo from '../components/AddTodo'; 
import TodoList from '../components/TodoList';
import WishList from '../components/WishList';
import Contacts from '../components/Contacts'; 

const Home = () => {
  const [selectedTab, setSelectedTab] = useState('home');

  const renderContent = () => {
    switch (selectedTab) {
      case 'wishlist':
        return (<><Auth /> <WishList /> </>);
      case 'todo':
        return (<> <Auth /><AddTodo /> <TodoList /> </>);
      case 'contacts':
        return (<><Auth /><Contacts /> </>); 
      default:
        return <Auth />;
    }
  };

  return (
    <>
      <Navbar setSelectedTab={setSelectedTab} selectedTab={selectedTab} />
      <Container maxW="7xl">{renderContent()}</Container>
    </>
  );
};

export default Home;










/*
import AddTodo from "../components/AddTodo";
import Auth from "../components/Auth";
import TodoList from "../components/TodoList";
import WishList from "../components/WishList"; 
import { Container, Link } from "@chakra-ui/react";
export default function Home() {
return (
<Container maxW="7xl">
<Auth />
<AddTodo />
<TodoList />
<WishList />
</Container>
);
}

*/


