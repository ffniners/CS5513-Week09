import { db } from "../firebase";
import { collection, addDoc, onSnapshot, query, where } from "firebase/firestore";

const addContact = async ({ userId, firstName, lastName, email, phone }) => {
    try {
        await addDoc(collection(db, "contacts"), {
            userId,
            firstName,
            lastName,
            email,
            phone,
            createdAt: new Date().getTime(),
        });
    } catch (err) {
        console.error("Error adding contact:", err);
    }
};

const getContactsByUser = (userId, setContacts) => {
    const contactsRef = collection(db, "contacts");
    const q = query(contactsRef, where("userId", "==", userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const contactsData = [];
        snapshot.forEach(doc => {
            contactsData.push({ id: doc.id, ...doc.data() });
        });
        setContacts(contactsData);
    });

    return unsubscribe; // for cleanup
};

export { addContact, getContactsByUser };
