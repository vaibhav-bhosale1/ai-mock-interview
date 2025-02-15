import React from 'react';

const AnswerDisplay = ({ content }) => {
  const codePatterns = {
    'import ': 'TypeScript/JavaScript',
    'from ': 'TypeScript/JavaScript/Python',
    'package ': 'Java',
    'using ': 'C#',
    'require ': 'Node.js/Ruby',
    '#include ': 'C/C++',
    'function ': 'JavaScript',
    'def ': 'Python',
    'func ': 'Go',
    'public ': 'Java/C#',
    'private ': 'Java/C#',
    'class ': 'Multiple',
    'const ': 'JavaScript',
    'let ': 'JavaScript',
    'var ': 'JavaScript',
    'return ': 'JavaScript',
    '// ': 'Comment',
    '# ': 'Comment',
    '/* ': 'Comment',
    "''' ": 'Python',
    '/** ': 'JSDoc',
    '<? ': 'PHP',
    '<?php ': 'PHP',
    'SELECT ': 'SQL',
    'INSERT ': 'SQL',
    'UPDATE ': 'SQL',
    'DELETE ': 'SQL',
  };

  const isCodeStart = (line) => {
    const trimmedLine = line.trim();
    // Check for code fence markers
    if (trimmedLine.startsWith('```')) return true;
    // Check for Example: marker
    if (trimmedLine.startsWith('Example:')) return true;
    // Check for numbered code examples
    if (/^\d+\.\s*[`]{0,3}(javascript|python|java|jsx|tsx|html|css|sql|json)/i.test(trimmedLine)) return true;
    // Check for common code patterns
    return Object.keys(codePatterns).some(pattern => 
      trimmedLine.startsWith(pattern)
    );
  };

  const isCodeContinuation = (line, prevLine) => {
    const trimmedLine = line.trim();
    const trimmedPrevLine = prevLine?.trim() || '';
    
    // Check if we're inside a JSX/code block
    const jsxPatterns = ['<', '/>', '};', '})', '{', '}', ');', '),', ']);', '],'];
    const isJSXLine = jsxPatterns.some(pattern => trimmedLine.includes(pattern));
    const wasPrevJSXLine = jsxPatterns.some(pattern => trimmedPrevLine.includes(pattern));
    
    // Check for indentation
    const currentIndent = line.search(/\S/);
    const prevIndent = prevLine ? prevLine.search(/\S/) : 0;
    const isIndented = currentIndent > 0 && currentIndent >= prevIndent;
    
    // Check if line is a comment
    const isComment = trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || trimmedLine.startsWith('*');
    
    // Check if previous line ends with operators or brackets
    const prevLineEndsWithContinuation = /[{(\[+\-*/<>=,]$/.test(trimmedPrevLine);
    
    return isJSXLine || wasPrevJSXLine || isIndented || isComment || prevLineEndsWithContinuation;
  };

  const collectCodeBlock = (lines, startIndex) => {
    let codeLines = [];
    let i = startIndex;
    let inCode = true;
    let bracketsCount = 0;
    let prevLine = '';

    // Skip fence line if present
    if (lines[i].trim().startsWith('```')) {
      i++;
    }

    while (i < lines.length && (inCode || isCodeContinuation(lines[i], prevLine))) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      if (trimmedLine === '```') {
        i++;
        continue;
      }

      // Add the original line with indentation preserved
      codeLines.push(line);
      
      // Track brackets for nested structures
      bracketsCount += (trimmedLine.match(/{/g) || []).length;
      bracketsCount -= (trimmedLine.match(/}/g) || []).length;

      // Check if we should continue the code block
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1];
        if (!isCodeContinuation(nextLine, line) && 
            bracketsCount <= 0 && 
            !nextLine.trim().startsWith('//') && 
            !isCodeStart(nextLine)) {
          inCode = false;
        }
      }

      prevLine = line;
      i++;
    }

    return {
      code: codeLines.join('\n'),
      endIndex: i - 1
    };
  };

  const processInlineFormatting = (text) => {
    // Handle bold code
    text = text.replace(/\*`([^`]+)`\*/g, '<strong class="font-mono">$1</strong>');
    
    // Handle inline code
    text = text.replace(/`([^`]+)`/g, '<span class="font-mono bg-gray-100 px-1 rounded">$1</span>');
    
    // Handle bold text
    text = text.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');

    return (
      <span 
        dangerouslySetInnerHTML={{ 
          __html: text
        }} 
      />
    );
  };

  const formatCodeBlock = (code, index) => {
    const language = detectLanguage(code);
    const cleanCode = code.replace(/```\w*\n?/, '').replace(/```$/, '');

    return (
      <div key={index} className="my-8 first:mt-4 last:mb-4">
        <div className="bg-gray-800 text-gray-200 rounded-t-lg px-4 py-2 text-sm font-mono flex justify-between items-center">
          <span>{language}</span>
        </div>
        <pre className="bg-gray-100 p-4 rounded-b-lg overflow-x-auto">
          <code className="text-sm font-mono text-gray-800 block whitespace-pre">
            {cleanCode}
          </code>
        </pre>
      </div>
    );
  };

  const detectLanguage = (code) => {
    const firstLine = code.trim().split('\n')[0];
    
    // Check for explicit language marker in code fence
    const fenceMatch = firstLine.match(/```(\w+)/);
    if (fenceMatch) return fenceMatch[1];

    // Check for numbered examples with language
    const numberedMatch = firstLine.match(/^\d+\.\s*[`]{0,3}(\w+)/);
    if (numberedMatch) return numberedMatch[1];

    // Check for common patterns
    for (const [pattern, language] of Object.entries(codePatterns)) {
      if (code.includes(pattern)) {
        return language;
      }
    }

    return 'Code';
  };

  const processContent = (content) => {
    const lines = content.split('\n');
    const elements = [];
    let textBuffer = [];

    const flushTextBuffer = () => {
      if (textBuffer.length > 0) {
        elements.push(
          <div key={elements.length} className="mb-4">
            {textBuffer.map((text, idx) => (
              <p key={idx} className="mb-2">
                {processInlineFormatting(text)}
              </p>
            ))}
          </div>
        );
        textBuffer = [];
      }
    };
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (isCodeStart(line)) {
        flushTextBuffer();
        const { code, endIndex } = collectCodeBlock(lines, i);
        elements.push(formatCodeBlock(code, elements.length));
        i = endIndex;
      } else if (line.trim()) {
        textBuffer.push(line);
      } else if (textBuffer.length > 0) {
        flushTextBuffer();
      }
    }
    
    flushTextBuffer();
    return elements;
  };

  return (
    <div className="p-6 rounded-lg bg-white shadow-sm">
      <div className="text-gray-800">
        <div className="prose max-w-none">
          {processContent(content)}
        </div>
      </div>
    </div>
  );
};

export default AnswerDisplay;