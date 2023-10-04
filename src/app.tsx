import React, { useEffect, useState } from 'react';
import '@suiet/wallet-kit/style.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
const config = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const firestore = firebase.firestore();

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRef = firestore.collection('users');
        const snapshot = await usersRef.get();

        const usersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setData(usersData);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>User Data</h1>
      <table>
        <thead>
          <tr>
            <th>Address</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {data.map(user => (
            <tr key={user.id}>
              <td>{user.address}</td>
              <td>{user.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
