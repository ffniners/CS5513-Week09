import React from "react";
import {
    Box,
    Input,
    Button,
    Stack,
    useToast,
    Badge
} from "@chakra-ui/react";
import useAuth from "../hooks/useAuth";
import { FaTrash } from "react-icons/fa";
import {
    fetchDataByUser,
    addDocument,
    updateDocument,
    deleteDocument
} from "../util/util";  

const Contacts = () => {
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [contacts, setContacts] = React.useState([]);
    
    const toast = useToast();
    const { isLoggedIn, user } = useAuth();

    React.useEffect(() => {
        if (isLoggedIn) {
            const unsubscribe = fetchDataByUser("contacts", user.uid, setContacts);
            return () => unsubscribe();
        }
    }, [isLoggedIn, user]);

    const handleContactAdd = async () => {
        if (!isLoggedIn) {
            return;
        }
        const contact = {
            firstName,
            lastName,
            email,
            phone,
            userId: user.uid,
        };
        await addDocument("contacts", contact);
        
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        toast({ title: "Contact added successfully", status: "success" });
    };

    const handleFieldChange = async (id, field, value) => {
        setContacts(prevContacts => prevContacts.map(contact => contact.id === id ? {...contact, [field]: value} : contact));
        await updateDocument("contacts", id, { [field]: value });
    };

    const handleContactDelete = async (id) => {
        if (confirm("Are you sure you wanna delete this contact?")) {
            await deleteDocument("contacts", id);
            toast({ title: "Contact deleted successfully", status: "success" });
        }
    };

    return (
        <Box w="40%" margin="0 auto" display="block" mt={5}>
            <Stack direction="column">
                <Input
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <Input
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
                <Input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <Button onClick={handleContactAdd}>
                    Add Contact
                </Button>
            </Stack>
            <Box mt={5}>
                {contacts.map(contact => (
                    <Box
                        key={contact.id}
                        p={3}
                        mt={4}
                        boxShadow="2xl"
                        shadow={"dark-lg"}
                        transition="0.2s"
                        _hover={{ boxShadow: "sm" }}
                    >
                        <Input
                            value={contact.firstName}
                            onChange={(e) => handleFieldChange(contact.id, "firstName", e.target.value)}
                        />
                        <Input
                            value={contact.lastName}
                            onChange={(e) => handleFieldChange(contact.id, "lastName", e.target.value)}
                        />
                        <Input
                            value={contact.email}
                            onChange={(e) => handleFieldChange(contact.id, "email", e.target.value)}
                        />
                        <Input
                            value={contact.phone}
                            onChange={(e) => handleFieldChange(contact.id, "phone", e.target.value)}
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
                            onClick={() => handleContactDelete(contact.id)}
                        >
                            <FaTrash />
                        </Badge>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default Contacts;
