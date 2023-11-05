import React, { useState } from 'react'
import ProblemInputModal from './ProblemInputModal'

export default function Main_LHS() {
  const [text, setText] = useState(""); // this needs to be global
  return (
    <div>
      {/* <p>{text}</p> */}
      <p><span id="inline-math" dangerouslySetInnerHTML={{ __html: text }} style={{ fontSize: '18px' }}></span></p>
      <ProblemInputModal text={text} setText={setText}/>
    </div>
  )
}
