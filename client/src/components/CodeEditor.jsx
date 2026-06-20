import Editor from '@monaco-editor/react';

const STARTER_CODE = {
  javascript: '// Write your solution here\nfunction solution(input) {\n  \n}',
  python: '# Write your solution here\ndef solution(input):\n    pass',
  java: 'public class Solution {\n    public static void main(String[] args) {\n        \n    }\n}',
  cpp: '#include \nusing namespace std;\n\nint main() {\n    \n    return 0;\n}',
};

export default function CodeEditor({ language, onChange }) {
  return (
    <div style={{ border: '0.5px solid #333', borderRadius: 8, overflow: 'hidden' }}>
      <Editor
        height="400px"
        language={language}
        defaultValue={STARTER_CODE[language] || '// Write your solution'}
        theme="vs-dark"
        onChange={onChange}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}