import React from 'react';
import '../../Samples.css'
const Samples = ({sampleInput,sampleOutput}) => {

return (
    <div className="Samples">
      <table>
        <thead>
          <tr>
          </tr>
        </thead>
        <tbody>
          <tr>
            <p>
              <th>Input</th> 
              <pre>{sampleInput}</pre>
            </p>

            <p>
              <th>Output</th>
              <pre>{sampleOutput}</pre>
            </p>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Samples;