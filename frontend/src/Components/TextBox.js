import io from 'socket.io-client';
import React, { useEffect, useState } from 'react';

// Declare socket outside the component
const socket = io("http://localhost:6969/", { transports: ['websocket'] });

export default function TextBox() {
    const [textvalue, setTextvalue] = useState('rand value');

    useEffect(() => {
        console.log('hittt');
        // Listen for any incoming messages and update textvalue
        socket.on('updatee', (val) => {
            console.log(val);
            setTextvalue(val);
        });
    },[socket]);

    function Handlechange(e) {
        setTextvalue(e.target.value);
        const newval = e.target.value;
        socket.emit('update', newval);
    }

    return (
        <textarea
            id='text'
            value={textvalue}
            onChange={Handlechange}
        >
        </textarea>
    )
}
