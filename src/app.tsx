import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB4g24SBwUUm_lFYsrxEBi39SDqwfTea9I",
  authDomain: "users-ada29.firebaseapp.com",
  projectId: "users-ada29",
  storageBucket: "users-ada29.appspot.com",
  messagingSenderId: "557729412960",
  appId: "1:557729412960:web:731e7fc972d4def6209005",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
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

  const tableHeaders = Object.keys(data[0] || {});

  return (
    <div>
      <h1>User Data</h1>
      <table>
        <thead>
          <tr>
            {tableHeaders.map(header => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(user => (
            <tr key={user.id}>
              {tableHeaders.map(header => (
                <td key={header}>{user[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
