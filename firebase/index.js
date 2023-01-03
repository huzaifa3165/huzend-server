// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBYWY4wEm-UarEgN6I4hFhYqh6Ke5O8Kq4",
  authDomain: "huzend-1.firebaseapp.com",
  databaseURL: "https://huzend-1-default-rtdb.firebaseio.com",
  projectId: "huzend-1",
  storageBucket: "huzend-1.appspot.com",
  messagingSenderId: "564437786963",
  appId: "1:564437786963:web:14d13188bad4333b4701a6",
  measurementId: "G-K2NZ91E1GM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const addToDB = async (col, data) => {
  try {
    const docRef = await addDoc(collection(db, col), data);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const readData = async (col) => {
  const querySnapshot = await getDocs(collection(db, col));
  let data = {};
  querySnapshot.forEach((doc) => {
    data = doc.data();
  });
  return data;
};
