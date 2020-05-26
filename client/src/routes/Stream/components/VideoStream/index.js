import React, { useState, useEffect, useRef } from 'react';
import { useRouteMatch } from 'react-router-dom';
import PropTypes from 'prop-types';
import Peer from 'simple-peer';
import io from 'socket.io-client';

const VideoStream = ({ socket, isStreamer }) => {
    const routeMatch = useRouteMatch();
    const client = useRef({});
    const videoElement = useRef();
    const streamElement = useRef();

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then(stream => {
                socket.emit('NewClientStreamer', routeMatch.params.id);
                if (videoElement.current) {
                    videoElement.current.srcObject = stream;
                }

                socket.on('CreateClientStreamerPeer', roomID => {
                    let peer = new Peer({
                        initiator: isStreamer === 'true',
                        config: configuration,
                        iceTransportPolicy: 'relay',
                        stream: stream,
                        trickle: true,
                        channelName: roomID,
                    });
                    peer.on('stream', stream => {
                        createVideo(stream);
                    });
                    peer.on('close', () => {
                        // document.getElementById('peerVideo').remove();
                        peer.destroy();
                    });
                    peer.on('signal', data => {
                        if (!client.current.gotAnswer) socket.emit('Offer', data);
                    });
                    client.current.peer = peer;
                });

                socket.on('Answer', answer => {
                    client.current.gotAnswer = true;
                    client.current.peer.signal(answer);
                });
            })
            .catch(err => {
                console.log('Error Stream:', err);
            });
    }, []);

    useEffect(() => {
        if (isStreamer === 'false') {
            socket.emit('NewClientReceiver', socket.id);

            socket.on('Offer', offer => {
                let peer = new Peer({
                    initiator: false,
                    trickle: true,
                });
                peer.on('stream', stream => {
                    createStream(stream);
                });
                peer.on('signal', data => {
                    socket.emit('ClientAnswer', data);
                });
                peer.signal(offer);

                client.current.peer = peer;
            });
        }
    }, []);

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

    const createVideo = stream => {
        videoElement.current.srcObject = stream;
    };
    const createStream = stream => {
        streamElement.current.srcObject = stream;
    };
    console.log('videoElement', videoElement);
    console.log('streamElement', streamElement);
    console.log('isStreamer video', isStreamer);
    return (
        <div>
            {isStreamer === 'true' && (
                <div>
                    Экран стримера. Видит себя
                    <video data-type="initiator" autoPlay ref={videoElement} muted />
                </div>
            )}
            {isStreamer === 'false' && (
                <div>
                    Экран зрителя. Видит стримера
                    <video autoPlay ref={streamElement} muted />
                </div>
            )}
        </div>
    );
};

VideoStream.propTypes = {};

export default VideoStream;
