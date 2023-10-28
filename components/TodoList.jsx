
import React, { useEffect } from "react";
// ... other imports ...

// Import our utility functions
import { fetchDataByUser, updateDocument, deleteDocument, addDocument } from '../util/util';

const TodoApp = () => {
    // ... states ...

    const handleTodoCreate = async () => {
        if (!isLoggedIn) {
            showToast("You must be logged in to create a todo", "error");
            return;
        }
        setIsLoading(true);
        const todo = {
            title,
            description,
            status,
            userId: user.uid,
        };
        await addDocument("todo", todo);
        setIsLoading(false);
        setTitle("");
        setDescription("");
        setStatus("pending");
        showToast("Todo created successfully", "success");
    };

    useEffect(() => {
        const unsubscribe = fetchDataByUser("todo", user?.uid, setTodos);
        return () => unsubscribe(); // Cleanup on component unmount
    }, [user]);

    const handleTodoDelete = async (id) => {
        if (window.confirm("Are you sure you wanna delete this todo?")) {
            await deleteDocument("todo", id);
            showToast("Todo deleted successfully", "success");
        }
    };

    const handleToggle = async (id, currentStatus) => {
        const newStatus = currentStatus === "completed" ? "pending" : "completed";
        await updateDocument("todo", id, { status: newStatus });
        showToast(
            `Todo marked ${newStatus}`,
            newStatus === "completed" ? "success" : "warning"
        );
    };

    const handleFieldChange = (id, field, value) => {
        setTodos(prevTodos => prevTodos.map(todo => todo.id === id ? {...todo, [field]: value} : todo));
        updateDocument("todo", id, { [field]: value });
    };

   // ... imports and the beginning of TodoApp ...

const showToast = (message, status) => {
    toast({
        title: message,
        status: status,
        duration: 9000,
        isClosable: true,
    });
};

return (
    <Box>
        {/* AddTodo component */}
        <Box w="40%" margin={"0 auto"} display="block" mt={5}>
            <Stack direction="column">
                <Input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <Textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value={"pending"} style={{ color: "yellow", fontWeight: "bold" }}>
                        Pending ⌛
                    </option>
                    <option value={"completed"} style={{ color: "green", fontWeight: "bold" }}>
                        Completed ✅
                    </option>
                </Select>
                <Button
                    onClick={handleTodoCreate}
                    disabled={title.length < 1 || description.length < 1 || isLoading}
                    variantColor="teal"
                    variant="solid"
                >
                    Add
                </Button>
            </Stack>
        </Box>

        {/* TodoList component */}
        <Box mt={5}>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
                {todos.map((todo) => (
                    <Box
                        key={todo.id}
                        p={3}
                        boxShadow="2xl"
                        shadow={"dark-lg"}
                        transition="0.2s"
                        _hover={{ boxShadow: "sm" }}
                    >
                        <Input
                            value={todo.title}
                            onChange={(e) => handleFieldChange(todo.id, "title", e.target.value)}
                        />
                        <Textarea
                            value={todo.description}
                            onChange={(e) => handleFieldChange(todo.id, "description", e.target.value)}
                        />
                        <Badge
                            color="red.500"
                            bg="inherit"
                            transition={"0.2s"}
                            _hover={{
                                bg: "inherit",
                                transform: "scale(1.2)",
                            }}
                            float="right"
                            size="xs"
                            onClick={() => handleTodoDelete(todo.id)}
                        >
                            <FaTrash />
                        </Badge>
                        <Badge
                            color={todo.status === "pending" ? "gray.500" : "green.500"}
                            bg="inherit"
                            transition={"0.2s"}
                            _hover={{
                                bg: "inherit",
                                transform: "scale(1.2)",
                            }}
                            float="right"
                            size="xs"
                            onClick={() => handleToggle(todo.id, todo.status)}
                        >
                            {todo.status === "pending" ? <FaToggleOff /> : <FaToggleOn />}
                        </Badge>
                        <Badge
                            float="right"
                            opacity="0.8"
                            bg={todo.status === "pending" ? "yellow.500" : "green.500"}
                        >
                            {todo.status}
                        </Badge>
                    </Box>
                ))}
            </SimpleGrid>
        </Box>
    </Box>
);


};

export default TodoApp;



/*
import {
    Badge,
    Box,
    SimpleGrid,
    useToast,
    Input,
    Textarea
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { collection, onSnapshot, query, where, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { FaToggleOff, FaToggleOn, FaTrash } from "react-icons/fa";
import { deleteTodo, toggleTodoStatus } from "../api/todo";

const TodoList = () => {
    const [todos, setTodos] = React.useState([]);
    const { user } = useAuth();
    const toast = useToast();

    const refreshData = () => {
        if (!user) {
            setTodos([]);
            return;
        }
        const q = query(collection(db, "todo"), where("user", "==", user.uid));
        onSnapshot(q, (querySnapshot) => {
            let ar = [];
            querySnapshot.docs.forEach((doc) => {
                ar.push({ id: doc.id, ...doc.data() });
            });
            setTodos(ar);
        });
    };

    useEffect(() => {
        refreshData();
    }, [refreshData, user]);

    const handleTodoDelete = async (id) => {
        if (confirm("Are you sure you wanna delete this todo?")) {
            deleteTodo(id);
            toast({ title: "Todo deleted successfully", status: "success" });
        }
    };

    const handleToggle = async (id, status) => {
        const newStatus = status === "completed" ? "pending" : "completed";
        await toggleTodoStatus({ docId: id, status: newStatus });
        toast({
            title: `Todo marked ${newStatus}`,
            status: newStatus === "completed" ? "success" : "warning",
        });
    };

    const handleFieldChange = (id, field, value) => {
        setTodos(prevTodos => prevTodos.map(todo => todo.id === id ? {...todo, [field]: value} : todo));
        const todoRef = doc(db, "todo", id);
        updateDoc(todoRef, { [field]: value });
    };

    return (
        <Box mt={5}>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
                {todos.map((todo) => (
                    <Box
                        key={todo.id}
                        p={3}
                        boxShadow="2xl"
                        shadow={"dark-lg"}
                        transition="0.2s"
                        _hover={{ boxShadow: "sm" }}
                    >
                        <Input
                            value={todo.title}
                            onChange={(e) => handleFieldChange(todo.id, "title", e.target.value)}
                        />
                        <Textarea
                            value={todo.description}
                            onChange={(e) => handleFieldChange(todo.id, "description", e.target.value)}
                        />
                        <Badge
                            color="red.500"
                            bg="inherit"
                            transition={"0.2s"}
                            _hover={{
                                bg: "inherit",
                                transform: "scale(1.2)",
                            }}
                            float="right"
                            size="xs"
                            onClick={() => handleTodoDelete(todo.id)}
                        >
                            <FaTrash />
                        </Badge>
                        <Badge
                            color={todo.status === "pending" ? "gray.500" : "green.500"}
                            bg="inherit"
                            transition={"0.2s"}
                            _hover={{
                                bg: "inherit",
                                transform: "scale(1.2)",
                            }}
                            float="right"
                            size="xs"
                            onClick={() => handleToggle(todo.id, todo.status)}
                        >
                            {todo.status === "pending" ? <FaToggleOff /> : <FaToggleOn />}
                        </Badge>
                        <Badge
                            float="right"
                            opacity="0.8"
                            bg={todo.status === "pending" ? "yellow.500" : "green.500"}
                        >
                            {todo.status}
                        </Badge>
                    </Box>
                ))}
            </SimpleGrid>
        </Box>
    );
};

export default TodoList;
*/