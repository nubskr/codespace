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
        
        if ((char==='.') && count>5) {
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
    if(stuff.error){
      // console.log("fcuk");
      setError(stuff.error);
    }
    else{
      var new_statement = `<h2><strong>${stuff.title}</strong></h2>\n`
      new_statement += await sanitize(stuff.statement);
      console.log(stuff.sample_input);
      setProblemName(stuff.title); 
      // new_statement += " \n \n  $$\nInput format$$ \n \n "
      new_statement += "<h3><strong>Input format</strong></h3>\n"
      // new_statement += stuff.input_format;
      new_statement += await sanitize(stuff.input_format)
      // new_statement += " \n \n  $$\n Output format$$ \n \n "
      new_statement += "<h3><strong>Output format</strong></h3>\n"
      new_statement += await sanitize(stuff.output_format);
      new_statement += '\n ';
      setStatement(new_statement); 
      setInput(new_statement);
      setSampleInput(stuff.sample_input);
      setSampleOutput(stuff.sample_outputs);
    }
 
  }

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      setLoading(true);
      setError(null);
      try {
        const encodedURL = encodeURIComponent(param);
        const response = await axios.get(`http://localhost:6909/api/parse_problem/${encodedURL}`);
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
        placeholder="codeforces link" 
      />
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {/* {data && <pre>{JSON.stringify(data, null, 2)}</pre>} */}
    </div>
  );
};

export default CFparser;
