const express = require('express');
const path = require('path');
const app = express();
const port = 4700;

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => console.log(`Server running on port ${port}`));