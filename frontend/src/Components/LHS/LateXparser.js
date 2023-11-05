import React, { useEffect, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Button } from '@mui/material';

function App({text,setText}) {
  const [tmptext,setTmpText] = useState(text);
  useEffect(() => {
    // Function to render LaTeX equations
  //   const renderEquations = () => {
  //     const sanitizedLatex = latexCont
  //     .replace(/\n/g, '\\\\')
  //     .replace(/\fjfj/g, '\\\\[12pt]\n')
  //     .replace(/\s/g, '\\ ') // Replace spaces with \ 
  //     .replace(/\*/g, '\\times') // Replace * with \times
  //  // Replace line breaks with \\


  //     katex.render(sanitizedLatex, document.getElementById('inline-math'), {
  //       throwOnError: false
  //     });
  //   };

  //   // Wait for the component to be mounted and then render the equations
  //   renderEquations();
    // renderTextWithKaTeX(latexCont);
  }, []);

  function renderTextWithKaTeX(text) {
    const kaTeXPattern = /\$\$([^$]+)\$\$/g;

    const renderedText = text.replace(kaTeXPattern, (match, content) => {
        try {
            const rendered = katex.renderToString(content, {
                throwOnError: false,
            });
            return `$$${rendered}$$`; // Keep the original formatting inside $$
        } catch (error) {
            console.error("KaTeX rendering error:", error);
            return match; // Return the original text if there's an error
        }
    });

    // Preserve line breaks and formatting, and remove unmatched $$
    return renderedText.replace(/\n/g, "<br>").replace(/\t/g, "&nbsp;&nbsp;")
        .replace(/\$\$/g, "").replace(/\$/g, "&#36;"); // Remove unmatched $$ and escape single $
  }

  function handleChange(e) {
    const inputval = e.target.value;
    const parsedText = renderTextWithKaTeX(inputval);
    setTmpText(parsedText);
    // TODO: whenever this changes broadcast it to everyone in room
  }

  function handleSave(e) {
    const inputval = e.target.value;
    // const parsedText = renderTextWithKaTeX(inputval);
    setText(tmptext);
    // console.log(parsedText);
  }

 return (
        <div>
            <textarea
                onChange={handleChange}
                style={{ whiteSpace: 'pre-wrap' }}
            />
            {/* <p><span id="inline-math" dangerouslySetInnerHTML={{ __html: text }} style={{ fontSize: '18px' }}></span></p> */}
            <p><span id="inline-math" dangerouslySetInnerHTML={{ __html: tmptext }} style={{ fontSize: '18px' }}></span></p>
            <Button onClick={handleSave}>
              Save
            </Button>
        </div>
    );
}

export default App;
