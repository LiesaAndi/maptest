require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// Initialize Firebase using environment variables
const firebaseConfig = {
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    project_id: process.env.FIREBASE_PROJECT_ID
};

admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig)
});

const db = admin.firestore();
const app = express();
app.use(cors());
app.use(express.json());

const COLLECTION_NAME = 'markers'; // Firestore collection name

// Fetch all markers from Firestore
app.get('/api/get-markers', async (req, res) => {
    try {
        const snapshot = await db.collection(COLLECTION_NAME).get();
        const markers = snapshot.docs.map(doc => doc.data());
        res.json(markers);
    } catch (error) {
        console.error("Error fetching markers:", error);
        res.status(500).json({ message: "Error fetching markers" });
    }
});

// Save new marker to Firestore
app.post('/api/save-marker', async (req, res) => {
    try {
        const newMarker = req.body;
        await db.collection(COLLECTION_NAME).add(newMarker);
        res.json({ status: 'success', marker: newMarker });
    } catch (error) {
        console.error("Error saving marker:", error);
        res.status(500).json({ message: "Error saving marker" });
    }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));