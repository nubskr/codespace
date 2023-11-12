import React, { useEffect, useState } from 'react'
import ProblemInputModal from './ProblemInputModal'
import katex from 'katex';
import 'katex/dist/katex.min.css';
import NestedModal from './NestedModal';

export default function Main_LHS({socketRef}) {
  const [text, setText] = useState("");
  const [input, setInput] = useState("");

  function renderTextWithKaTeX(text) {
    const kaTeXPattern = /\$\$([^$]+)\$\$/g;
    const imagePattern = /\${img:([^}]+)}/g; // Updated image pattern

    const renderedText = text
        .replace(kaTeXPattern, (match, content) => {
            try {
                const rendered = katex.renderToString(content, {
                    throwOnError: false,
                });
                return `$$${rendered}$$`; // Keep the original formatting inside $$
            } catch (error) {
                console.error("KaTeX rendering error:", error);
                return match; // Return the original text if there's an error
            }
        })
        .replace(imagePattern, (match, link) => {
            return `<img src="${link}" alt="Image" />`; // Render image tag
        });

    // Preserve line breaks and formatting, remove unmatched $$ and escape single $
    return renderedText
        .replace(/\n/g, "<br>")
        .replace(/\t/g, "&nbsp;&nbsp;")
        .replace(/\$\$/g, "")
        .replace(/\$/g, "&#36");
  }
  
  function SocketEmit(channel,msg){
    if(socketRef.current){
      socketRef.current.emit(channel,{statement:msg});
    }
  }
  
  useEffect(() => {
    if(socketRef.current){
        socketRef.current.on('receive-problem-statement', (payload) => {
          setInput(payload.statement);
        });   
    }
  },[socketRef.current]);

  useEffect(() => {
    setText(renderTextWithKaTeX(input));
    SocketEmit('update-problem-statement',input);
  },[input])

  return (
    <div>
      <p><span id="inline-math" dangerouslySetInnerHTML={{ __html: text }} style={{ fontSize: '18px' }}></span></p>
      {/* <ProblemInputModal text={text} setText={setText} input={input} setInput={setInput}/> */}
      <NestedModal text={text} setText={setText} input={input} setInput={setInput}/>
    </div>
  )
}
