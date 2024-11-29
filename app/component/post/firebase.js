import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDCuYsxg7uuex_F7bKVKD6zmHBft3bztiI",
  databaseURL: "https://capstone-design-aee66-default-rtdb.asia-southeast1.firebasedatabase.app/",
  authDomain: "capstone-design-aee66.firebaseapp.com",
  projectId: "capstone-design-aee66",
  storageBucket: "capstone-design-aee66.firebasestorage.app",
  messagingSenderId: "962821896747",
  appId: "1:962821896747:web:a6a950bf1f6db67f47886e",
  measurementId: "G-Y23SX7DQYN"
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database };