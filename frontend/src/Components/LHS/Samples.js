import React from 'react';
import '../../Samples.css'
const Samples = ({sampleInput,sampleOutput}) => {

return (
    <div>
      <table>
        <thead>
          <tr>
          </tr>
        </thead>
        <tbody>
          <div className='Samples'>
            <div className='Sample-input'>
              <th>Input</th> 
              <pre>{sampleInput}</pre>
            </div>
            <div>
              <th>Output</th>
              <pre>{sampleOutput}</pre>
            </div>
          </div>
        </tbody>
      </table>
    </div>
  );
}

export default Samples;