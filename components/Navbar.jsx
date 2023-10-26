
import { Box, Flex, Text } from '@chakra-ui/react'; 


const Navbar = ({ setSelectedTab, selectedTab }) => {
    return (
      <Flex bg="blue.500" p={4} justify="center">
        <Box
          cursor="pointer"
          mx={4}
          onClick={() => setSelectedTab('home')}
          color={selectedTab === 'home' ? 'white' : 'gray.200'}
        >
          <Text>Home</Text>
        </Box>
        <Box
          cursor="pointer"
          mx={4}
          onClick={() => setSelectedTab('wishlist')}
          color={selectedTab === 'wishlist' ? 'white' : 'gray.200'}
        >
          <Text>Wishlist</Text>
        </Box>
        <Box
          cursor="pointer"
          mx={4}
          onClick={() => setSelectedTab('todo')}
          color={selectedTab === 'todo' ? 'white' : 'gray.200'}
        >
          <Text>Todo</Text>
        </Box>
        <Box
          cursor="pointer"
          mx={4}
          onClick={() => setSelectedTab('contacts')}
          color={selectedTab === 'contacts' ? 'white' : 'gray.200'}>
            <Text>Contacts</Text>
        </Box>
      </Flex>
    );
  };
  
  export default Navbar; 