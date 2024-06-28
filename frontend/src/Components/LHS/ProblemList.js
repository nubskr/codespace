import axios from 'axios';
import React, { useEffect, useState } from 'react'

const api = 'http://localhost:6909/api/problem-list';

function ProblemList({socketRef , setCurrentProb , setProblemName, setSampleInput, setSampleOutput, setInput}) {
    const [data, setData] = useState([]);
    // const [problem_package,setProblemPackage] = useState([]);
    useEffect(() => {
        // Fetch data from the backend when the component mounts
        console.log('fetching data');
        fetchData();
    }, []);

    function SocketEmit(channel,msg){
      if(socketRef.current){
        socketRef.current.emit(channel,{statement:msg});
      }
    }

    const fetchData = async () => {
        try {
            const response = await axios.get(api);
            setData(response.data);
            // console.log(response.data);
        } 
        catch (error) {
            console.error('Error fetching data from backend:', error.message);
        }
    };
    
    function getProblemPackage(problem_id){
      const matchingPackage = data.find(problem => problem.id === problem_id);

      if (!matchingPackage) {
        console.log('not found');
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

    async function handleItemClick(problem_id){
      const problem_package = await getProblemPackage(problem_id);
      SocketEmit('change-main-problem',problem_id);
      console.log("sending this package ");
      console.log(problem_package);
      await setCurrentProb(problem_id);
      go(problem_package);
      console.log("Problem changed to " + problem_id);
    }

  return (
    <div>
      <ul>
        {data.map(problem => (
          <p key={problem.id} onClick={() => handleItemClick(problem.id)}>
          {problem.problem_name}
        </p>
        ))}
      </ul>
    </div>
  )
}

export default ProblemList