import React from "react";
import { Box, Input, Button, Stack, useToast, Badge } from "@chakra-ui/react";
import useAuth from "../hooks/useAuth";
import { addEvent, getEventsByUser, updateEvent, deleteEvent } from "../api/wishlist"; // Assuming you'll have deleteEvent in the API
import { FaTrash } from "react-icons/fa";

const Events = () => {
    const [eventName, setEventName] = React.useState("");
    const [eventDate, setEventDate] = React.useState("");
    const [events, setEvents] = React.useState([]);
    const toast = useToast();
    const { isLoggedIn, user } = useAuth();

    React.useEffect(() => {
        if (isLoggedIn) {
            const unsubscribe = getEventsByUser(user.uid, setEvents);
            return () => unsubscribe();
        }
    }, [isLoggedIn, user]);

    const handleEventAdd = async () => {
        if (!isLoggedIn) {
            return;
        }
        const eventItem = {
            eventName,
            eventDate,
            userId: user.uid,
        };
        await addEvent(eventItem);

        setEventName("");
        setEventDate("");
        toast({ title: "Event added successfully", status: "success" });
    };

    const handleFieldChange = async (id, field, value) => {
        setEvents(prevEvents => prevEvents.map(event => event.id === id ? {...event, [field]: value} : event));
        await updateEvent(id, { [field]: value });
    };

    const handleEventDelete = async (id) => {
        if (confirm("Are you sure you wanna delete this event?")) {
            await deleteEvent(id); // You'll need to implement this deleteEvent method in the API.
            toast({ title: "Event deleted successfully", status: "success" });
        }
    };

    return (
        <Box w="40%" margin="0 auto" display="block" mt={5}>
            <Stack direction="column">
                <Input
                    placeholder="Event Name"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                />
                <Input
                    type="date"
                    placeholder="Event Date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                />
                <Button onClick={handleEventAdd}>
                    Add Event
                </Button>
            </Stack>
            <Box mt={5}>
                {events.map(event => (
                    <Box
                        key={event.id}
                        p={3}
                        mt={4}
                        boxShadow="2xl"
                        shadow={"dark-lg"}
                        transition="0.2s"
                        _hover={{ boxShadow: "sm" }}
                    >
                        <Input
                            value={event.eventName}
                            onChange={(e) => handleFieldChange(event.id, "eventName", e.target.value)}
                        />
                        <Input
                            type="date"
                            value={event.eventDate}
                            onChange={(e) => handleFieldChange(event.id, "eventDate", e.target.value)}
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
                            onClick={() => handleEventDelete(event.id)}
                        >
                            <FaTrash />
                        </Badge>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default Events;

/*
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
*/