import io from 'socket.io-client';
import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import axios from 'axios';
import '../App.css'
import CodeMirror from '@uiw/react-codemirror';
import { StreamLanguage } from '@codemirror/language';
import { cpp } from '@codemirror/lang-cpp';

// Replace with the URL you want to send the request to
const apiUrl = 'http://localhost:6909/test';

// Declare socket outside the component
const socket = io("http://localhost:6909/", { transports: ['websocket'] });

export default function TextBox() {
    const [textvalue, setTextvalue] = useState('rand value');
    const [inputvalue, setInputvalue] = useState('');
    const [outputvalue, setOutputvalue] = useState('');
    useEffect(() => {
        // Listen for any incoming messages and update textvalue
        socket.on('updatee', (val) => {
            setTextvalue(val);
        });
    },[socket]);

    // function Handlechange(e) {
    //     setTextvalue(e.target.value);
    //     const newval = e.target.value;
    //     socket.emit('update', newval);
    // }
    const Handlechange = React.useCallback((val, viewUpdate) => {
        console.log('val:', val);
        setTextvalue(val);
      }, []);
    function Handlechangeinput(e) {
        setInputvalue(e.target.value);
        const newval = e.target.value;
        socket.emit('update-input', newval);
    }
    async function sendreq(){
        console.log(textvalue);
        console.log(inputvalue);
        const requestData = {
            code: textvalue,
            input: inputvalue
        };
        const response = await axios.post(apiUrl, requestData);
        setOutputvalue(response.data);
    }
    function Handlecompile(e) {
        sendreq();
    }
    console.log(outputvalue);
    return (
    <div className="RHS">
        <div className="code-area">
            {/* <textarea
                style={{ height: '86vh', width: '100%',resize: "none" }}
                id="text"
                value={textvalue}
                onChange={Handlechange}
            ></textarea> */}
            <CodeMirror value={textvalue} height="86vh" onChange={Handlechange} extensions={[cpp()]} />
        </div>
        <div className="input-output">
            <div className="input-area">
                <textarea
                    style={{height: '5vh',resize: "none" }}
                    id="input"
                    value={inputvalue}
                    onChange={Handlechangeinput}
                    placeholder="Enter input here"
                ></textarea>
            </div>
            <div className="output-area" style={{padding: '1px',width: '100%', height: '6vh',border: '2px solid black' }}>
  Output: {outputvalue}
</div>
        </div>
        <button onClick={Handlecompile}>Compile</button>
    </div>
    )
}
