const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const fileUpload = require('express-fileupload');
const path = require('path');

const socketApi = require('./socket');

const app = express();

const server = http.createServer(app);
const io = socketIo(server);

// Middlewares
app.use(express.json({ extended: false, limit: '50mb' }));
app.use(fileUpload());
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => res.send('API Running'));

// Client connects
io.on('connection', socket => {
    socketApi(socket, io);
});

// Socket.io to router
app.use(function (req, res, next) {
    req.io = io;
    next();
});

// Routes
// app.use('/api/auth', require('./routes/api/auth'));
// app.use('/api/users', require('./routes/api/users'));

// Serve static assets for production
if (process.env.NODE_ENV === 'production') {
    // Set statis folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT_API || 3001;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
