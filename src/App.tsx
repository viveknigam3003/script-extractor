/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-okaidia.css";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [llmOutput, setLlmOutput] = useState("");

  const parseScript = () => {
    try {
      let cleaned = input.trim();
      const indexOfFimMiddle = cleaned.indexOf("<|fim_middle|>");

      const llmOutput = getLLMOutput();
      console.log("🚀 ~ parseScript ~ llmOutput:", llmOutput);
      if (llmOutput) {
        // add llmOutput before the indexOfFimMiddle
        cleaned =
          cleaned.substring(0, indexOfFimMiddle).replace(/<\|.*?\|>/g, "") +
          llmOutput;
      } else {
        cleaned = cleaned
          .substring(0, indexOfFimMiddle)
          .replace(/<\|fim_suffix\|>/g, "||")
          .replace(/<\|.*?\|>/g, "");
      }
      console.log("🚀 ~ parseScript ~ cleaned:", cleaned);

      const quoted = `"${cleaned}"`;
      const parsed = JSON.parse(quoted);
      const code = parsed;
      setOutput(code);
      setTimeout(() => Prism.highlightAll(), 0);
    } catch (err: any) {
      setOutput(`⚠️ Parsing Postman Script failed: ${err.message}`);
    }
  };

  const getLLMOutput = () => {
    try {
      const indexOfEnd = llmOutput.length;
      const cleaned = llmOutput
        .replace(/("generated_text": |"text": )/g, "")
        .substring(0, indexOfEnd)
        .trim();
      return cleaned;
    } catch (err: any) {
      throw new Error(`⚠️ Parsing LLM Output failed: ${err.message}`);
    }
  };

  return (
    <div>
      <h2 className="title">🧪 Postman Script Beautifier</h2>
      <div className="section">
        <label htmlFor="input" id="input-label">
          Postman test script
        </label>
        <p style={{ fontSize: "0.8em", color: "#888" }}>
          remove "input": and the quotes from before and after
        </p>
        <textarea
          id="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste escaped input to LLM here..."
        />
      </div>
      <div>
        <label htmlFor="input" id="input-label">
          LLM output
        </label>
        <p style={{ fontSize: "0.8em", color: "#888" }}>
          remove "generated_text": or "text": and the quotes from before and
          after
        </p>
        <textarea
          id="llmOutput"
          value={llmOutput}
          onChange={(e) => setLlmOutput(e.target.value)}
          placeholder="Paste escaped output from LLM here..."
        />
      </div>
      <button onClick={parseScript}>Beautify & Highlight</button>

      <h3>🔍 Parsed & Highlighted Output:</h3>
      <pre>
        <code className="language-javascript">{output}</code>
      </pre>
    </div>
  );
}

export default App;
