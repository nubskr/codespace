import React, { useEffect, useState } from 'react'
import ProblemInputModal from './ProblemInputModal'
import katex from 'katex';
import 'katex/dist/katex.min.css';
import NestedModal from './NestedModal';
import axios from 'axios';
import CopyLinkButton from './ShareRoom';
import { useParams } from 'react-router-dom';
import Samples from './Samples';

const api = `${process.env.REACT_APP_BACKEND_URL}/api/problem-list`;

export default function Main_LHS({socketRef,currentProbId,setCurrentProb}) {
  // when we change the problem, just broadcast the problem id, and everything will change
  const [text, setText] = useState("");
  const [input, setInput] = useState(""); // current raw statement
  const [problemName,setProblemName] = useState("");
  const [sampleInput,setSampleInput] = useState("");
  const [sampleOutput,setSampleOutput] = useState("");
  const [data,setData] = useState("");

  const {roomid} = useParams();

  function renderTextWithKaTeX(text) {
    // Normalize multiple dollar signs to exactly two dollar signs
    function normalizeDollarSigns(input) {
        // This regex matches sequences of three or more dollar signs and ensures we only replace them with $$.
        return input.replace(/\${3,}/g, '$$$$');
    }

    // Preprocess text to normalize dollar signs
    const normalizedText = normalizeDollarSigns(text);

    // Patterns for KaTeX and image rendering
    const kaTeXPattern = /\$\$([^$]+)\$\$/g;
    const imagePattern = /\${img:([^}]+)}/g; // Updated image pattern

    const renderedText = normalizedText
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
        .replace(/\$/g, "&#36;");
}

  
  function SocketEmit(channel,msg){
    if(socketRef.current){
      socketRef.current.emit(channel,{statement:msg});
    }
  }
  
  const fetchData = async () => {
    try {
        const response = await axios.get(api);
        setData(response.data);
        console.log(response.data);
    } 
    catch (error) {
        console.error('Error fetching data from backend:', error.message);
    }
};

function getProblemPackage(problem_id){
  const matchingPackage = data.find(problem => problem.id === problem_id);

  if (!matchingPackage) {
    throw new Error('Problem not found in the local list');
  }

  return matchingPackage; 
}

function go(problem_package){
  console.log('received package is' + problem_package)
  // setCurrentProb(problem_package.id);  
  setInput(problem_package.statement);
  setSampleOutput(problem_package.soutput);
  setSampleInput(problem_package.sinput);
  setProblemName(problem_package.problem_name);
}

  useEffect(() => {
    if(socketRef.current){
        socketRef.current.on('receive-problem-statement', (payload) => {
          setInput(payload.statement);
        });

        socketRef.current.on('change-main-problem', (payload) => {
          async function yo(){
            fetchData();
           const problem_package = getProblemPackage(payload.problem_id);
            go();
          }
          yo();
        });
        
    }
  },[socketRef.current]);

  useEffect(() => {
    console.log("input is " + input);
    setText(renderTextWithKaTeX(input));
    console.log("$$$$$ " + text);
    SocketEmit('update-problem-statement',input);
  },[input])

  return (
    <div>
      {/* <div style={{ fontSize: '32px', fontWeight: 'bold' , marginBottom: '20  px'}}>{problemName}</div> */}

      <div className='problem-statement'><span id="inline-math" dangerouslySetInnerHTML={{ __html: text }} style={{ fontSize: '18px' }}></span></div>
      {/* <ProblemInputModal text={text} setText={setText} input={input} setInput={setInput}/> */}
      {/* <CopyLinkButton link={sharedlink} /> */}

      {text!=="" && <Samples sampleInput={sampleInput} sampleOutput={sampleOutput}/>}
      <NestedModal socketRef={socketRef} setCurrentProb={setCurrentProb} setProblemName={setProblemName} setSampleInput={setSampleInput} setSampleOutput={setSampleOutput} text={text} setText={setText} input={input} setInput = {setInput} />

    </div>
  )
}
