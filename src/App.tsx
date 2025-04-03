/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-okaidia.css';
import './App.css';

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const parseScript = () => {
    try {
      let cleaned = input.trim().replace(/"inputs": "/g, '');
      const indexOfFimMiddle = cleaned.indexOf('<|fim_middle|>');
      cleaned = cleaned
        .substring(0, indexOfFimMiddle)
        .replace(/<\|fim_suffix\|>/g, '||')
        .replace(/<\|.*?\|>/g, '');
      const quoted = `"${cleaned}"`;
      const parsed = JSON.parse(quoted);
      const code = parsed;
      setOutput(code);
      setTimeout(() => Prism.highlightAll(), 0);
    } catch (err: any) {
      setOutput(`⚠️ Parsing failed: ${err.message}`);
    }
  };

  return (
    <div>
      <h2 className="title">🧪 Postman Script Beautifier</h2>
      <label htmlFor="input" id="input-label">
        Paste your escaped Postman test script:
      </label>
      <textarea
        id="input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste escaped content here..."
      />
      <button onClick={parseScript}>Beautify & Highlight</button>

      <h3>🔍 Parsed & Highlighted Output:</h3>
      <pre>
        <code className="language-javascript">{output}</code>
      </pre>
    </div>
  );
}

export default App;