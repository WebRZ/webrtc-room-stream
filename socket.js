const Peer = require('simple-peer');
const wrtc = require('wrtc');

// Helpers
const { getCurrentUserById, userJoin, userLeave } = require('./helpers/users');

// Variables
let Streamer = {};
let Receiver = {};

const configuration = {
    iceServers: [
        {
            urls: ['stun:sp-turn1.xirsys.com'],
        },
        {
            username:
                'LdzgXD2MWspU8qKuKIa9nYv02AqPhqD_qOeFSCsJfBjaCwq5mN-LsbrHReCmgGLwAAAAAF4HabRjYW1pbG9oaW5vam9zYQ==',
            credential: '320899dc-2980-11ea-810a-06374c00029e',
            urls: [
                'turn:sp-turn1.xirsys.com:80?transport=udp',
                'turn:sp-turn1.xirsys.com:3478?transport=udp',
                'turn:sp-turn1.xirsys.com:80?transport=tcp',
            ],
        },
    ],
};

module.exports = (socket, io) => {
    socket.on('join room', ({ userId, room }) => {
        const user = userJoin(userId, room);

        socket.join(user.room);
    });

    // STREAM
    socket.on('NewClientStreamer', () => {
        socket.emit('CreateClientStreamerPeer');
    });

    const InitializeReceiver = offer => {
        const receiver = {};
        let peer = new Peer({
            initiator: false,
            config: configuration,
            iceTransportPolicy: 'any',
            wrtc: wrtc,
            trickle: true,
        });
        peer.on('signal', data => {
            socket.emit('Answer', data);
        });
        peer.on('close', () => {
            //
        });
        peer.on('stream', stream => {
            receiver.stream = stream;
            receiver.peer = peer;
            Receiver = receiver;
        });
        peer.signal(offer);
    };

    socket.on('Offer', offer => {
        InitializeReceiver(offer);
    });

    socket.on('NewClientReceiver', () => {
        const streamer = {};
        streamer.gotAnswer = false;
        let peer = new Peer({
            initiator: true,
            config: configuration,
            iceTransportPolicy: 'any',
            wrtc: wrtc,
            stream: Receiver.stream,
            trickle: true,
        });
        peer.on('signal', offer => {
            if (!streamer.gotAnswer) socket.emit('Offer', offer);
        });
        peer.on('connect', () => {
            Streamer = streamer;
        });
        streamer.peer = peer;

        socket.on('ClientAnswer', data => {
            streamer.gotAnswer = true;
            streamer.peer.signal(data);
        });
    });

    socket.on('disconnect', () => {
        const user = getCurrentUserById(socket.id);

        if (user) {
            userLeave(user.id);
        }
    });
};
