import React from "react";
import { Box, Input, Button, Stack, useToast, Text } from "@chakra-ui/react";
import useAuth from "../hooks/useAuth";
import { addContact, getContactsByUser } from "../api/contacts"; // Update API imports

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
            const unsubscribe = getContactsByUser(user.uid, setContacts);
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
        await addContact(contact);
        
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        toast({ title: "Contact added successfully", status: "success" });
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
            {contacts.map(contact => (
                <Box key={contact.id} mt={4}>
                    <Text>{contact.firstName} {contact.lastName} - {contact.email} - {contact.phone}</Text>
                </Box>
            ))}
        </Box>
    );
};

export default Contacts;
