import React, { useEffect, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Button } from '@mui/material';

function App({text,setText,input,setInput,handleClose}) {
  const [tmptext,setTmpText] = useState('');
  const [inputval,setInputVal] = useState(input); // this is the main stuff

  useEffect(() => {
    setTmpText(renderTextWithKaTeX(inputval));
    setText(inputval);
  }, [inputval]);

  useEffect(() => {
    setTmpText(renderTextWithKaTeX(input));
    setText(input);
  }, [input]);


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


  function handleChange(e) {
    setInputVal(e.target.value);
    // TODO: whenever this changes broadcast it to everyone in room
  }

  function handleSave(e) {
    setInput(inputval);
    handleClose();
  }

 return (
        <form>
            <textarea style={{whiteSpace: 'pre-wrap', width: '100%', height: '100%', overflow: 'auto' }}
                onChange={handleChange}
                defaultValue={inputval}
            />
            <p><span id="inline-math" dangerouslySetInnerHTML={{ __html: tmptext }} style={{ fontSize: '18px' }}></span></p>
            <Button onClick={handleSave}>
              Save
            </Button>
        </form>
    );
}

export default App;
