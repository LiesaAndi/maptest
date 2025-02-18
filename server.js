const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = 'markers.json';

// Load existing markers
app.get('/api/get-markers', (req, res) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) return res.json([]);
        res.json(JSON.parse(data));
    });
});

// Save new marker
app.post('/api/save-marker', (req, res) => {
    const newMarker = req.body;

    fs.readFile(DATA_FILE, (err, data) => {
        let markers = err ? [] : JSON.parse(data);
        markers.push(newMarker);

        fs.writeFile(DATA_FILE, JSON.stringify(markers), () => {
            res.json({ status: 'success', marker: newMarker });
        });
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));