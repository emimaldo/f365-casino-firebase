const express = require('express');
const cors = require('cors');
const firebase = require('firebase-admin');

const app = express();

const serviceAccount = require('./f365-casino-firebase.json');
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount)
});
const firestore = firebase.firestore();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/notify', async (req, res) => {
  try {
    console.log('req_body', JSON.stringify(req.body));
    const result = await (await firestore.collection('players').doc(req.body.id).get()).data();
    if (result) {
      await firestore
        .collection('players')
        .doc(req.body.id)
        .update({ ...result, ...req.body });
    } else {
      await firestore
        .collection('players')
        .doc(req.body.id)
        .set({ ...req.body });
    }

    res.json();
  } catch (error) {
    console.log('error', JSON.stringify(error));
    res.status(500).json({ message: error });
  }
});

app.post('/update-balance', async (req, res) => {
  try {
    console.log('req_body', JSON.stringify(req.body));
    const result = await (await firestore.collection('users').doc(req.body.id).get()).data();
    if (result) {
      await firestore
        .collection('users')
        .doc(req.body.id)
        .update({ ...result, ...req.body });
    } else {
      await firestore
        .collection('users')
        .doc(req.body.id)
        .set({ ...req.body });
    }

    res.json();
  } catch (error) {
    console.log('error', JSON.stringify(error));
    res.status(500).json({ message: error });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
