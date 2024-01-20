import axios from 'axios';
import React, { useEffect, useState } from 'react'

const api = 'http://localhost:6909/api/problem-list';

function ProblemList() {
    const [data, setData] = useState([]);
    useEffect(() => {
        // Fetch data from the backend when the component mounts
        fetchData();
    }, []);

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
    
  return (
    <div>
      <ul>
        {data.map(problem => (
          <li key={problem.id}>
            <h3>{problem.problem_name}</h3>
            <p>{problem.statement}</p>
            <p>Sample Input: {problem.sinput}</p>
            <p>Sample Output: {problem.soutput}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ProblemList