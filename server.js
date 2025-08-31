const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

const upload = multer();

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/submit', upload.single('profilePic'), (req, res) => {
    console.log('Form Data:', req.body);
    if (req.file) {
        console.log('File:', req.file.originalname, req.file.mimetype, req.file.size, 'bytes');
    }
    res.status(200).send('Form data received successfully!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log('Open your browser and navigate to the address to see the form.');
});
