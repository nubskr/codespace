import React, { useEffect, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

function App() {
  const [latexCont,setlatexCont] = useState('');
  useEffect(() => {
    // Function to render LaTeX equations
    const renderEquations = () => {
      const sanitizedLatex = latexCont
      .replace(/\n/g, '\\\\')
      .replace(/\fjfj/g, '\\\\[12pt]\n')
      .replace(/\s/g, '\\ ') // Replace spaces with \ 
      .replace(/\*/g, '\\times') // Replace * with \times
   // Replace line breaks with \\


      katex.render(sanitizedLatex, document.getElementById('inline-math'), {
        throwOnError: false
      });
    };

    // Wait for the component to be mounted and then render the equations
    renderEquations();
  }, [latexCont]);

  function handleChange(e) {
    setlatexCont(e.target.value);
  }

  return (
    <div>
      <textarea 
        onChange={handleChange}
        style={{ whiteSpace: 'pre-wrap' }}
      />
      <p><span id="inline-math"></span></p>
    </div>
  );
}

export default App;
