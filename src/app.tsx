import React, { useEffect, useState } from 'react';
import '@suiet/wallet-kit/style.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const firebaseConfig = {
  // La tua configurazione Firebase
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
        setError(error as Error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Funzione per controllare e aggiungere l'indirizzo se necessario
  const checkAndAddAddress = async (addressToCheck) => {
    const availableAddresses = ['address', 'address1', 'address2', 'address3', 'address4'];

    // Verifica se l'indirizzo è già presente in una delle variabili
    const isAddressPresent = availableAddresses.some((variableName) => data[0][variableName] === addressToCheck);

    if (!isAddressPresent) {
      // Trova la prima variabile disponibile e aggiungi l'indirizzo
      for (let i = 0; i < availableAddresses.length; i++) {
        if (!data[0][availableAddresses[i]]) {
          const updateData = {
            [availableAddresses[i]]: 'none', // Imposta su "none"
          };

          // Aggiungi l'indirizzo al documento
          await firestore.collection('users').doc(data[0].id).update(updateData);

          // Aggiorna lo stato locale
          setData(prevData => ([{
            ...prevData[0],
            [availableAddresses[i]]: 'none',
          }, ...prevData.slice(1)]));
          break;
        }
      }
    }
  };

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
