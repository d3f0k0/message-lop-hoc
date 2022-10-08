import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyA0V1VCNJRgLEugV6i4QK6QEO9-5S7hPTU",
  authDomain: "quan-li-lop-hoc.firebaseapp.com",
  projectId: "quan-li-lop-hoc",
  storageBucket: "quan-li-lop-hoc.appspot.com",
  messagingSenderId: "167112990969",
  appId: "1:167112990969:web:0830bcdbd20e30fb908228",
  measurementId: "G-ZW992GQ34E"
})

const auth = firebase.auth()
const firestore = firebase.firestore()
function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>

      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
  }

  return (
    <button onClick={signInWithGoogle}> Google login </button>
  )  
}
function SignOut() {
  return auth.currentUser && (

    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}
function ChatRoom() {
  const messagingRef = firestore.collection('messages');
  const query = messagingRef.orderBy('createdAt').limit(25);
  const dummy = useRef();
  const [messages] = useCollectionData(query, {idField : 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();

    const {uid, photoURL } = auth.currentUser;

    await messagingRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');

    dummy.current.scrollIntoView({behavior: 'smooth'});
  }
  
  return(<>
  <main>
    {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

    <div ref={dummy}></div>
  </main>
  <form onSubmit={sendMessage}>
    <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
    <button type= 'submit'>🔷</button>
  </form>
  </>)
}

function ChatMessage(props) {
  const {text , uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'recived'

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL}  />
      <p>{text}</p>
    </div>
  )
  
}

export default App;