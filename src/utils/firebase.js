import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAivf7okJmXY7rbQnEgCNGOalcG92Mx1Vw',
  authDomain: 'fir-cloud-function-fda9f.firebaseapp.com',
  databaseURL: 'https://fir-cloud-function-fda9f.firebaseio.com',
  projectId: 'fir-cloud-function-fda9f',
  storageBucket: 'fir-cloud-function-fda9f.appspot.com',
  messagingSenderId: '1048273217130',
  appId: '1:1048273217130:web:cdfe23ebd8fa7ac243cc13',
  measurementId: 'G-J5VML07E52',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();

export default firebase;
