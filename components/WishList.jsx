import React from "react";
import { Box, Input, Button, Stack, useToast, Badge } from "@chakra-ui/react";
import useAuth from "../hooks/useAuth";
import { FaTrash } from "react-icons/fa";
import {
    fetchDataByUser,
    addDocument,
    updateDocument,
    deleteDocument
} from "../util/util";  // import the utility functions

const Events = () => {
    const [eventName, setEventName] = React.useState("");
    const [eventDate, setEventDate] = React.useState("");
    const [events, setEvents] = React.useState([]);

    const toast = useToast();
    const { isLoggedIn, user } = useAuth();

    React.useEffect(() => {
        if (isLoggedIn) {
            const unsubscribe = fetchDataByUser("events", user.uid, setEvents);
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
        await addDocument("events", eventItem);

        setEventName("");
        setEventDate("");
        toast({ title: "Event added successfully", status: "success" });
    };

    const handleFieldChange = async (id, field, value) => {
        setEvents(prevEvents => prevEvents.map(event => event.id === id ? {...event, [field]: value} : event));
        await updateDocument("events", id, { [field]: value });
    };

    const handleEventDelete = async (id) => {
        if (confirm("Are you sure you wanna delete this event?")) {
            await deleteDocument("events", id);
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
*/
