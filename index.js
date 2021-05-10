require('dotenv').config(); //install dotenv


const http = require('http');
const app = require('./app')

const port = 8000 //process.env.PORT || 8000;

const server = http.createServer(app);

server.listen(port, () => {
    console.log('Server is Running on PORT ' + port);
});