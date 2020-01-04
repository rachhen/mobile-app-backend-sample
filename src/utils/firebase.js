import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB1GtSM1H9UbGfwttPDF8Raq0nIV-mSYzo',
  authDomain: 'eo-csma-v2.firebaseapp.com',
  databaseURL: 'https://eo-csma-v2.firebaseio.com',
  projectId: 'eo-csma-v2',
  storageBucket: 'eo-csma-v2.appspot.com',
  messagingSenderId: '609230766341',
  appId: '1:609230766341:web:c4c18a71cd28d63366f76c',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();

export default firebase;
