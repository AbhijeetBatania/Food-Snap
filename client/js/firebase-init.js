// client/js/firebase-init.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyAvIRjD3BjS74oCmITWkjVEFNHcYN5ftqM",
  authDomain: "food-snap-17cca.firebaseapp.com",
  projectId: "food-snap-17cca",
  storageBucket: "food-snap-17cca.appspot.com",
  messagingSenderId: "148652545683",
  appId: "1:148652545683:web:9f16a00e367b27acc2df66",
  measurementId: "G-N3W3Q996L2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
