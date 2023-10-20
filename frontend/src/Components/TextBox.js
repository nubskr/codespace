import io from 'socket.io-client';
import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import axios from 'axios';
import '../App.css'
import CodeMirror from '@uiw/react-codemirror';
import { StreamLanguage } from '@codemirror/language';
import { cpp } from '@codemirror/lang-cpp';

// Replace with the URL you want to send the request to
const apiUrl = 'http://localhost:6909/test'; // cpp compilation docker container 

// Declare socket outside the component

export default function TextBox({roomid , socket}) {
    // console.log(roomid);
    const [textvalue, setTextvalue] = useState('rand value');
    const [inputvalue, setInputvalue] = useState('');
    const [outputvalue, setOutputvalue] = useState('');

    function SocketEmit(channel,msg){
        socket.emit(channel,{ roomid:roomid , code:msg});
    }

    useEffect(() => {
        socket.on('receive-code-update', (code) => {
            setTextvalue(code);
        });
        // socket.on('update-room-user-list', (newList) => {
        //     setTextvalue('run');                                                                        
        //   });
    },[]);

    const Handlechange = React.useCallback((val, viewUpdate) => {
        setTextvalue(val);
        SocketEmit('update-code',val);
    }, []);

    function Handlechangeinput(e) {
        setInputvalue(e.target.value);
        const newval = e.target.value;
        SocketEmit('update-input',newval);
    }

    async function sendreq(){
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
    
    return (
    <div className="RHS">
        <div className="code-area">
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
