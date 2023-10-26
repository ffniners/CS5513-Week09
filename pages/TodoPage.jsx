
import AddTodo from "../components/AddTodo";
import Auth from "../components/Auth";
import TodoList from "../components/TodoList";
import WishList from "../components/WishList"; 
import { Container, Link } from "@chakra-ui/react";
export default function Home() {
return (
<Container maxW="7xl">
<Auth />
<Link href="../components/Wishlist">WishList</Link>
<Link href="./TodoPage">TodoList</Link>
<AddTodo/>
<TodoList/>
</Container>
);
}
