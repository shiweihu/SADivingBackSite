// firebaseConfig.js
import { initializeApp } from "firebase/app";
import 'firebase/auth';
const firebaseConfig = {
    apiKey: "AIzaSyCWt_ibr9BOuZ5GWBtbYTyHAVEXH8QWx1s",
    authDomain: "assessdiving.firebaseapp.com",
    projectId: "assessdiving",
    storageBucket: "assessdiving.appspot.com",
    messagingSenderId: "200060933475",
    appId: "1:200060933475:web:1d2e831406d999d24faf56",
    measurementId: "G-NDXGT8MVNS"
  };

const firebaseAPP = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service

export default firebaseAPP


