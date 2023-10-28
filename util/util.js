import { collection, query, where, onSnapshot, updateDoc, doc, deleteDoc, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export const fetchDataByUser = (collectionName, userId, setData) => {
    const q = query(collection(db, collectionName), where("userId", "==", userId));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let data = [];
        querySnapshot.docs.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });
        setData(data);
    });
    return unsubscribe; 
};

export const updateDocument = (collectionName, docId, data) => {
    const docRef = doc(db, collectionName, docId);
    return updateDoc(docRef, data);
};

export const deleteDocument = (collectionName, docId) => {
    const docRef = doc(db, collectionName, docId);
    return deleteDoc(docRef);
};

export const addDocument = (collectionName, data) => {
    const collRef = collection(db, collectionName);
    return addDoc(collRef, data);
};
