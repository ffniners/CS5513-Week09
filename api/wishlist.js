import { db } from "../firebase";
import { query, where, onSnapshot, collection, addDoc, doc, deleteDoc } from "firebase/firestore";

export const addEvent = async (event) => {
    try {
        const eventsCollection = collection(db, "events");
        const docRef = await addDoc(eventsCollection, event);
        return docRef.id; 
    } catch (error) {
        console.error("Error adding event: ", error);
    }
};

export const getEventsByUser = (userId, callback) => {
    const eventsQuery = query(collection(db, "events"), where("userId", "==", userId));
    const unsubscribe = onSnapshot(eventsQuery, (snapshot) => {
        const events = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        callback(events);
    });
    return unsubscribe; 
};

export const deleteEvent = async (eventId) => {
    try {
        const eventRef = doc(db, "events", eventId);
        await deleteDoc(eventRef);
    } catch (error) {
        console.error("Error deleting event: ", error);
    }
};


/*

import { db } from "../firebase"; 
import {query, where, onSnapshot, collection, addDoc } from "firebase/firestore";

export const addWishListItem = async (item) => {
    try {
        const wishlistCollection = collection(db, "wishlist");
        const docRef = await addDoc(wishlistCollection, item);
        return docRef.id; 
    } catch (error) {
        console.error("Error adding wishlist item: ", error);
    }
};


export const getWishlistItemsByUser = (userId, callback) => {
    const wishlistQuery = query(collection(db, "wishlist"), where("userId", "==", userId));
    const unsubscribe = onSnapshot(wishlistQuery, (snapshot) => {
        const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        callback(items);
    });
    return unsubscribe; 
};

export const deleteWishlistItem = async (itemId) => {
    try {
        const itemRef = doc(db, "wishlist", itemId);
        await deleteDoc(itemRef);
    } catch (error) {
        console.error("Error deleting wishlist item: ", error);
    }
};

*/