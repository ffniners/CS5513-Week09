import React from "react";
import { Box, Input, Button, Stack, useToast, Textarea, Badge } from "@chakra-ui/react";
import useAuth from "../hooks/useAuth";
import { addEvent, getEventsByUser, updateEvent } from "../api/wishlist"; // Assuming you'll have an updateEvent method in the API

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
        await updateEvent(id, { [field]: value }); // You'll need to implement this updateEvent method in the API.
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
import { addEvent, getEventsByUser } from "../api/wishlist"; // Update API imports

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

    return (
        <Box w="40%" margin="0 auto" display="block" mt={5}>
            <Stack direction="column">
                <Input
                    placeholder="Event Name"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                />
                <Input
                    type="date" // Set to date type for date picker
                    placeholder="Event Date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                />
                <Button onClick={handleEventAdd}>
                    Add Event
                </Button>
            </Stack>
            {events.map(event => (
                <Box key={event.id} mt={4}>
                    <Text>{event.eventName} - {event.eventDate}</Text>
                </Box>
            ))}
        </Box>
    );
};

export default Events;

*/