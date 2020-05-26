import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch, useLocation } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import qs from 'qs';

// Components
import VideoStream from './components/VideoStream';

import './styles.sass';

const socket = socketIOClient();

const users = [{}];

const Stream = props => {
    // Hooks
    const routeMatch = useRouteMatch();
    const location = useLocation();

    useEffect(() => {
        socket.emit('join room', {
            userId: socket.id,
            room: routeMatch.params.id,
        });
    }, []);
    const isStreamer = qs.parse(location.search.replace(/\?/g, '')).streamer;
    console.log('isStreamer', isStreamer);
    return (
        <div className="Stream__video">
            <VideoStream socket={socket} isStreamer={isStreamer} />
        </div>
    );
};

Stream.propTypes = {};

export default Stream;
