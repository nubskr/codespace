import React, { useState } from 'react';

const CopyLinkButton = ({ link }) => {
  const [copySuccess, setCopySuccess] = useState('');

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopySuccess('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      setCopySuccess('Failed to copy');
    }
  };

  return (
    <div>
      <button onClick={copyToClipboard}>Copy Link</button>
      {copySuccess && <span>{copySuccess}</span>}
    </div>
  );
};

export default CopyLinkButton;
