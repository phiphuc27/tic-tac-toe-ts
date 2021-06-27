import firebase from 'firebase';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDO8SeeDAjRsMRllK17ZXE5fSoFoBQTrgA',
  authDomain: 'tic-tac-toe-7bdb8.firebaseapp.com',
  projectId: 'tic-tac-toe-7bdb8',
  storageBucket: 'tic-tac-toe-7bdb8.appspot.com',
  messagingSenderId: '806129624853',
  appId: '1:806129624853:web:4a9f660db66de4cfd16b1c',
  measurementId: 'G-0LG9CDV9PN',
};

firebase.initializeApp(firebaseConfig);

export const storage = firebase.storage;

export default firebase;
