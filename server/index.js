require('dotenv').config()
const express  = require("express");
const app = express();

app.use(express.static("Client"));

app.get('/', (req, res) => {
    res.sendFile("index.html");
});

const port = process.env.PORT || process.env.SERVER_PORT;

app.listen(port, () => console.log(`Yo Let's gooo on port: ${port}`));