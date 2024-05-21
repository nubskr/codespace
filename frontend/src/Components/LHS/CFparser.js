import React, { useState } from 'react';
import axios from 'axios';

const CFparser = ({setStatement,setProblemName,setSampleInput,setSampleOutput,setInput}) => {
  const [param, setparam] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setparam(e.target.value);
  };

  function sanitize(statement) {
    var res = "";
    var buffer = "";
    var count = 0;

    for (var i = 0; i < statement.length; i++) {
        var char = statement.charAt(i);
        
        // Check if char is a word character
        if (/\w/.test(char)) {
            buffer += char;
        } else {
            // If buffer is not empty, append it to res
            if (buffer !== "") {
                res += buffer;
                buffer = "";
                count++;
            }
            
            // If char is $$$, replace it with $$
            if (char === "$" && statement.charAt(i + 1) === "$" && statement.charAt(i + 2) === "$") {
                res += "$$";
                i += 2; 
            } else {
                res += char;
            }
        }
        
        if (char==='.' && count>10) {
            res += "\n";
            count = 0;
        }
    }
    
    // Append the remaining buffer
    if (buffer !== "") {
        res += buffer;
    }

    return res;
}

  async function go(stuff){
    // print
    const new_statement = await sanitize(stuff.statement);
    console.log(stuff.sample_input);
    setProblemName(stuff.title); 
    setStatement(new_statement); 
    setInput(new_statement);
    setSampleInput(stuff.sample_input);
    setSampleOutput(stuff.sample_outputs); 
  }

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:6909/api/parse_problem/${param}`);
        setData(response.data);
        go(response.data); 
      } catch (err) {   
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <input 
        type="text" 
        value={param} 
        onChange={handleInputChange} 
        onKeyPress={handleKeyPress} 
        placeholder="Enter parameters" 
      />
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default CFparser;
