import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

function ProblemStatement() {
  return (
    <div>
      <p><strong>Description:</strong></p>
      <p>
        You are given two numbers, \(a\) and \(b\). Your task is to find and print their sum, \(a + b\).
      </p>
      <p><strong>Input:</strong></p>
      <p>
        The input consists of two integers, \(a\) and \(b\), separated by a space (\(1 \leq a, b \leq 10^9\)).
      </p>
      <p><strong>Output:</strong></p>
      <p>
        Print a single integer, the sum of \(a\) and \(b\).
      </p>
      <p><strong>Sample Input:</strong></p>
      <pre>3 4</pre>
      <p><strong>Sample Output:</strong></p>
      <pre>7</pre>
      <p><strong>Explanation:</strong></p>
      <p>
        In the sample case, \(a = 3\) and \(b = 4\), so the sum \(a + b = 3 + 4 = 7\), which is printed as the output.
      </p>
    </div>
  );
}

export default ProblemStatement;
