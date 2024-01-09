const express = require('express');
const path = require('path');
const cors = require('cors');
const http = require('http');

const port = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(cors())

// make all of www available
app.use(express.static(path.join(__dirname, '../www')));

const server = http.createServer(app);

server.listen(port);
