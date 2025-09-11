import React, { useState, useEffect } from "react";
import { checkSyntax2 } from "../lib/Parser2";

interface ParseTreeNodeProps {
  node: any;
  level?: number;
}

const ParseTreeNode: React.FC<ParseTreeNodeProps> = ({ node, level = 0 }) => {
  const hasChildren = node.children && node.children.length > 0;
  
  // Color coding for different node types
  const getNodeColor = (type: string) => {
    switch (type) {
      case 'start': return 'border-blue-400 bg-blue-900/20';
      case 'union': return 'border-red-400 bg-red-900/20';
      case 'concat': return 'border-green-400 bg-green-900/20';
      case 'arith': return 'border-yellow-400 bg-yellow-900/20';
      case 'term': return 'border-orange-400 bg-orange-900/20';
      case 'factor': return 'border-purple-400 bg-purple-900/20';
      case 'base': return 'border-pink-400 bg-pink-900/20';
      case 'number': return 'border-cyan-400 bg-cyan-900/20';
      case 'char': return 'border-indigo-400 bg-indigo-900/20';
      case 'digit': return 'border-emerald-400 bg-emerald-900/20';
      default: return 'border-teal-400 bg-gray-900/20';
    }
  };

  const getTextColor = (type: string) => {
    switch (type) {
      case 'start': return 'text-blue-400';
      case 'union': return 'text-red-400';
      case 'concat': return 'text-green-400';
      case 'arith': return 'text-yellow-400';
      case 'term': return 'text-orange-400';
      case 'factor': return 'text-purple-400';
      case 'base': return 'text-pink-400';
      case 'number': return 'text-cyan-400';
      case 'char': return 'text-indigo-400';
      case 'digit': return 'text-emerald-400';
      default: return 'text-teal-400';
    }
  };
  
  return (
    <div className="relative">
      {/* Node Box */}
      <div className="flex items-center justify-center mb-2">
        <div className={`border-2 rounded-lg px-3 py-2 shadow-lg ${getNodeColor(node.type)}`}>
          <div className="text-center">
            <div 
              className={`font-bold text-sm ${getTextColor(node.type)}`}
              style={{ fontFamily: "DM Mono, monospace" }}
            >
              {node.type}
            </div>
            <div 
              className="text-yellow-400 text-xs mt-1"
              style={{ fontFamily: "DM Mono, monospace" }}
            >
              "{node.value}"
            </div>
            {node.precedence !== undefined && (
              <div 
                className="text-purple-400 text-xs mt-1"
                style={{ fontFamily: "DM Mono, monospace" }}
              >
                prec: {node.precedence}
              </div>
            )}
            {node.associativity && (
              <div 
                className="text-gray-400 text-xs mt-1"
                style={{ fontFamily: "DM Mono, monospace" }}
              >
                {node.associativity}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Children Container */}
      {hasChildren && (
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 top-0 w-0.5 h-4 bg-teal-400 transform -translate-x-1/2"></div>
          
          {/* Horizontal Line */}
          <div className="absolute left-1/2 top-4 w-full h-0.5 bg-teal-400 transform -translate-x-1/2"></div>
          
          {/* Children */}
          <div className="flex justify-center space-x-4 pt-6">
            {node.children.map((child: any, index: number) => (
              <div key={index} className="relative">
                {/* Connection Line to Child */}
                <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-teal-400 transform -translate-x-1/2"></div>
                
                {/* Child Node */}
                <ParseTreeNode node={child} level={level + 1} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Playground: React.FC = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{ 
    isValid: boolean; 
    message: string; 
    derivation?: string[];
    parseTree?: any;
  } | null>(null);
  const [showDerivation, setShowDerivation] = useState(false);
  const [showParseTree, setShowParseTree] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [isGrammarVisible, setIsGrammarVisible] = useState(false);
  const [isResultsVisible, setIsResultsVisible] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Staggered animations for different sections
    const headerTimer = setTimeout(() => setIsHeaderVisible(true), 200);
    const inputTimer = setTimeout(() => setIsInputVisible(true), 400);
    const grammarTimer = setTimeout(() => setIsGrammarVisible(true), 600);
    
    return () => {
      clearTimeout(headerTimer);
      clearTimeout(inputTimer);
      clearTimeout(grammarTimer);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setResult(null);
    setShowDerivation(false);
    setShowParseTree(false);
  };

  const handleCheckSyntax = () => {
    if (input.trim() === "") {
      setResult({ isValid: false, message: "❌ Please enter an expression" });
      setIsResultsVisible(false);
      setTimeout(() => setIsResultsVisible(true), 100);
      return;
    }
    
    const syntaxResult = checkSyntax2(input);
    setResult(syntaxResult);
    setShowDerivation(syntaxResult.isValid && !!syntaxResult.derivation);
    setShowParseTree(syntaxResult.isValid && !!syntaxResult.parseTree);
    setIsResultsVisible(false);
    setTimeout(() => setIsResultsVisible(true), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCheckSyntax();
    }
  };

  return (
    <div className="min-h-screen text-white pt-20 md:pt-32 pb-20 px-4 md:px-6 relative" style={{ backgroundColor: "#131415" }}>
      {/* Desktop Background Pattern */}
      <div 
        className="absolute inset-0 md:block hidden"
        style={{
          backgroundImage: "url(/bg.png)",
          backgroundSize: "auto",
          backgroundPosition: "center top",
          backgroundRepeat: "repeat",
          opacity: 1
        }}
      ></div>
      
      {/* Mobile Background Pattern */}
      <div 
        className="absolute inset-0 md:hidden"
        style={{
          backgroundImage: "url(/bg.png)",
          backgroundSize: "600px 600px",
          backgroundPosition: "center top",
          backgroundRepeat: "repeat",
          opacity: 1
        }}
      ></div>
      
      <div className="max-w-4xl mx-auto relative z-10 px-2 md:px-0">
        {/* Header */}
        <div 
          className={`text-center mb-12 transition-all duration-700 ease-out ${
            isHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h1 
            className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4"
            style={{ fontFamily: "DM Mono, monospace" }}
          >
            PLAYGROUND
          </h1>
          <p 
            className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto px-4 md:px-0"
            style={{ fontFamily: "DM Mono, monospace" }}
          >
            Enter an arithmetic expression or regex pattern (no spaces allowed) to check its syntax and see the derivation tree
          </p>
        </div>

        {/* Input Section */}
        <div 
          className={`bg-gray-800 rounded-lg p-4 md:p-6 mb-8 border border-gray-600 transition-all duration-700 ease-out ${
            isInputVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="mb-4">
            <label 
              htmlFor="expression-input"
              className="block text-sm font-medium mb-2"
              style={{ fontFamily: "DM Mono, monospace" }}
            >
              Enter Expression:
            </label>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <input
                id="expression-input"
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="e.g., 2+3*4, a|b, (a+b)*c, 1.5+2.3"
                className="flex-1 px-3 sm:px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 text-sm sm:text-base"
                style={{ fontFamily: "DM Mono, monospace" }}
              />
              <button
                onClick={handleCheckSyntax}
                className="px-4 sm:px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors font-medium text-sm sm:text-base whitespace-nowrap"
                style={{ fontFamily: "DM Mono, monospace" }}
              >
                CHECK SYNTAX
              </button>
            </div>
          </div>

          {/* Example expressions */}
          <div className="mt-4">
            <p 
              className="text-sm text-gray-400 mb-2"
              style={{ fontFamily: "DM Mono, monospace" }}
            >
              Try these examples:
            </p>
            <div className="flex flex-wrap gap-2">
              {["2+3", "a|b", "5*4+2", "(a+b)*c", "1.5+2.3", "ab*|cd", "a*b|c*d"].map((example, index) => (
                <button
                  key={index}
                  onClick={() => setInput(example)}
                  className="px-2 sm:px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs sm:text-sm rounded transition-colors"
                  style={{ fontFamily: "DM Mono, monospace" }}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div 
            className={`space-y-6 transition-all duration-700 ease-out ${
              isResultsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Syntax Result */}
            <div 
              className={`p-4 md:p-6 rounded-lg border-2 ${
                result.isValid 
                  ? "bg-green-900/20 border-green-500" 
                  : "bg-red-900/20 border-red-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 
                    className="text-base md:text-lg font-semibold mb-2"
                    style={{ fontFamily: "DM Mono, monospace" }}
                  >
                    Syntax Check Result
                  </h3>
                  <p 
                    className={`text-sm md:text-lg ${
                      result.isValid ? "text-green-400" : "text-red-400"
                    }`}
                    style={{ fontFamily: "DM Mono, monospace" }}
                  >
                    {result.message}
                  </p>
                </div>
                {result.isValid && (
                  <div 
                    className="text-4xl"
                    style={{ color: "#14B984" }}
                  >
                    ✓
                  </div>
                )}
              </div>
            </div>

            {/* Derivation Section */}
            {result.isValid && result.derivation && (
              <div className="bg-gray-800 rounded-lg border border-gray-600 overflow-hidden">
                <button
                  onClick={() => setShowDerivation(!showDerivation)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-700 transition-colors"
                  style={{ fontFamily: "DM Mono, monospace" }}
                >
                  <span className="text-lg font-semibold">Derivation Tree</span>
                  <span className="text-xl">
                    {showDerivation ? "−" : "+"}
                  </span>
                </button>
                
                {showDerivation && (
                  <div className="px-6 py-4 bg-gray-700">
                    <div className="space-y-2">
                      {result.derivation.map((step, index) => (
                        <div 
                          key={index}
                          className="flex items-center space-x-4 py-2"
                        >
                          <span 
                            className="text-sm text-gray-400 w-8"
                            style={{ fontFamily: "DM Mono, monospace" }}
                          >
                            {index + 1}.
                          </span>
                          <code 
                            className="text-teal-400 bg-gray-800 px-3 py-1 rounded text-sm"
                            style={{ fontFamily: "DM Mono, monospace" }}
                          >
                            {step}
                          </code>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 p-4 bg-gray-600 rounded-lg">
                      <p 
                        className="text-sm text-gray-300"
                        style={{ fontFamily: "DM Mono, monospace" }}
                      >
                        <strong>How it works:</strong> This derivation shows how your expression 
                        is parsed according to the combined arithmetic and regex grammar rules. Each step represents a 
                        production rule being applied to transform the input into a valid parse tree structure. 
                        The parser handles both arithmetic expressions (like "2+3*4") and regex patterns 
                        (like "ab*|cd") using the same grammar hierarchy. Note that whitespace is not allowed in expressions.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Parse Tree Visualization */}
            {result.isValid && result.parseTree && (
              <div className="bg-gray-800 rounded-lg border border-gray-600 overflow-hidden">
                <button
                  onClick={() => setShowParseTree(!showParseTree)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-700 transition-colors"
                  style={{ fontFamily: "DM Mono, monospace" }}
                >
                  <span className="text-lg font-semibold">Parse Tree Visualization</span>
                  <span className="text-xl">
                    {showParseTree ? "−" : "+"}
                  </span>
                </button>
                
                {showParseTree && (
                  <div className="px-4 md:px-6 py-4 bg-gray-700">
                    <div className="bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-600 overflow-x-auto">
                      <h4 
                        className="text-base md:text-lg font-semibold mb-4 md:mb-6 text-purple-400 text-center"
                        style={{ fontFamily: "DM Mono, monospace" }}
                      >
                        Tree Structure
                      </h4>
                      <div className="flex justify-center min-w-max">
                        <ParseTreeNode node={result.parseTree} />
                      </div>
                    </div>
                    
                    <div className="mt-4 p-4 bg-gray-600 rounded-lg">
                      <p 
                        className="text-sm text-gray-300"
                        style={{ fontFamily: "DM Mono, monospace" }}
                      >
                        <strong>Parse Tree:</strong> This shows the complete hierarchical structure of your expression with ALL intermediate nodes visible. 
                        Each node represents a grammar rule application, with children showing how the expression 
                        is broken down step by step. The tree supports both arithmetic operations (+, -, *, /) and regex operations 
                        (| for union, · for concatenation, * for Kleene star). 
                        <br/><br/>
                        <strong>Color Coding:</strong> Each node type has a unique color to make the tree structure clearer:
                        <br/>• <span className="text-blue-400">Start</span> - Root node
                        <br/>• <span className="text-red-400">Union</span> - | operator
                        <br/>• <span className="text-green-400">Concat</span> - · concatenation
                        <br/>• <span className="text-yellow-400">Arith</span> - + and - operations
                        <br/>• <span className="text-orange-400">Term</span> - * and / operations
                        <br/>• <span className="text-purple-400">Factor</span> - Kleene star
                        <br/>• <span className="text-pink-400">Base</span> - Parentheses
                        <br/>• <span className="text-cyan-400">Number</span> - Numeric literals
                        <br/>• <span className="text-indigo-400">Char</span> - Character literals
                        <br/>• <span className="text-emerald-400">Digit</span> - Individual digits
                        <br/><br/>
                        <strong>Precedence levels:</strong> Union (0.5), Addition/Subtraction (1), Multiplication/Division (2), 
                        Concatenation (2.5), Parentheses (3), Kleene Star (4). All operations are now explicitly shown in the tree.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Grammar Reference */}
        <div 
          className={`mt-8 md:mt-12 bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-600 transition-all duration-700 ease-out ${
            isGrammarVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h3 
            className="text-lg md:text-xl font-semibold mb-4 md:mb-6"
            style={{ fontFamily: "DM Mono, monospace" }}
          >
            Combined Arithmetic & Regex Grammar
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <div>
              <h4 
                className="text-lg font-medium mb-3 text-teal-400"
                style={{ fontFamily: "DM Mono, monospace" }}
              >
                Grammar Rules
              </h4>
              <div className="space-y-3 text-sm">
                <div style={{ fontFamily: "DM Mono, monospace" }}>
                  <code className="text-teal-400">expr</code> → <code className="text-yellow-400">union</code>
                </div>
                <div style={{ fontFamily: "DM Mono, monospace" }}>
                  <code className="text-teal-400">union</code> → <code className="text-yellow-400">concat</code> | <code className="text-yellow-400">union</code> <code className="text-red-400">"|"</code> <code className="text-yellow-400">concat</code>
                </div>
                <div style={{ fontFamily: "DM Mono, monospace" }}>
                  <code className="text-teal-400">concat</code> → <code className="text-yellow-400">arith</code> | <code className="text-yellow-400">concat</code> <code className="text-yellow-400">arith</code>
                </div>
                <div style={{ fontFamily: "DM Mono, monospace" }}>
                  <code className="text-teal-400">arith</code> → <code className="text-yellow-400">term</code> | <code className="text-yellow-400">arith</code> <code className="text-red-400">"+"</code> <code className="text-yellow-400">term</code> | <code className="text-yellow-400">arith</code> <code className="text-red-400">"-"</code> <code className="text-yellow-400">term</code>
                </div>
                <div style={{ fontFamily: "DM Mono, monospace" }}>
                  <code className="text-teal-400">term</code> → <code className="text-yellow-400">factor</code> | <code className="text-yellow-400">term</code> <code className="text-red-400">"*"</code> <code className="text-yellow-400">factor</code> | <code className="text-yellow-400">term</code> <code className="text-red-400">"/"</code> <code className="text-yellow-400">factor</code>
                </div>
                <div style={{ fontFamily: "DM Mono, monospace" }}>
                  <code className="text-teal-400">factor</code> → <code className="text-yellow-400">base</code> | <code className="text-yellow-400">base</code> <code className="text-red-400">"*"</code>
                </div>
                <div style={{ fontFamily: "DM Mono, monospace" }}>
                  <code className="text-teal-400">base</code> → <code className="text-yellow-400">number</code> | <code className="text-yellow-400">char</code> | <code className="text-red-400">"("</code> <code className="text-yellow-400">expr</code> <code className="text-red-400">")"</code>
                </div>
                <div style={{ fontFamily: "DM Mono, monospace" }}>
                  <code className="text-teal-400">number</code> → <code className="text-yellow-400">digit</code> | <code className="text-yellow-400">digit</code> <code className="text-yellow-400">number</code> | <code className="text-yellow-400">digit</code> <code className="text-red-400">"."</code> <code className="text-yellow-400">number</code>
                </div>
                <div style={{ fontFamily: "DM Mono, monospace" }}>
                  <code className="text-teal-400">char</code> → <code className="text-red-400">"a"</code> | <code className="text-red-400">"b"</code> | <code className="text-red-400">"c"</code> | ... | <code className="text-red-400">"z"</code>
                </div>
                <div style={{ fontFamily: "DM Mono, monospace" }}>
                  <code className="text-teal-400">digit</code> → 0 | 1 | 2 | ... | 9
                </div>
              </div>
            </div>
            
            <div>
              <h4 
                className="text-lg font-medium mb-3 text-teal-400"
                style={{ fontFamily: "DM Mono, monospace" }}
              >
                Supported Operators
              </h4>
              <div className="space-y-2 text-sm">
                <div className="mb-3">
                  <div className="text-purple-400 font-semibold mb-2">Arithmetic Operators:</div>
                  <div style={{ fontFamily: "DM Mono, monospace" }}>
                    <span className="text-gray-400">Addition:</span> <code className="text-green-400">+</code> <span className="text-gray-500">(precedence 1)</span>
                  </div>
                  <div style={{ fontFamily: "DM Mono, monospace" }}>
                    <span className="text-gray-400">Subtraction:</span> <code className="text-green-400">-</code> <span className="text-gray-500">(precedence 1)</span>
                  </div>
                  <div style={{ fontFamily: "DM Mono, monospace" }}>
                    <span className="text-gray-400">Multiplication:</span> <code className="text-green-400">*</code> <span className="text-gray-500">(precedence 2)</span>
                  </div>
                  <div style={{ fontFamily: "DM Mono, monospace" }}>
                    <span className="text-gray-400">Division:</span> <code className="text-green-400">/</code> <span className="text-gray-500">(precedence 2)</span>
                  </div>
                  <div style={{ fontFamily: "DM Mono, monospace" }}>
                    <span className="text-gray-400">Numbers:</span> <code className="text-green-400">0-9</code> <span className="text-gray-500">(precedence 0)</span>
                  </div>
                </div>
                <div>
                  <div className="text-purple-400 font-semibold mb-2">Regex Operators:</div>
                  <div style={{ fontFamily: "DM Mono, monospace" }}>
                    <span className="text-gray-400">Union:</span> <code className="text-green-400">|</code> <span className="text-gray-500">(precedence 0.5)</span>
                  </div>
                  <div style={{ fontFamily: "DM Mono, monospace" }}>
                    <span className="text-gray-400">Concatenation:</span> <code className="text-green-400">implicit</code> <span className="text-gray-500">(precedence 2.5)</span>
                  </div>
                  <div style={{ fontFamily: "DM Mono, monospace" }}>
                    <span className="text-gray-400">Kleene Star:</span> <code className="text-green-400">*</code> <span className="text-gray-500">(precedence 4)</span>
                  </div>
                  <div style={{ fontFamily: "DM Mono, monospace" }}>
                    <span className="text-gray-400">Characters:</span> <code className="text-green-400">a-z</code> <span className="text-gray-500">(precedence 0)</span>
                  </div>
                  <div style={{ fontFamily: "DM Mono, monospace" }}>
                    <span className="text-gray-400">Parentheses:</span> <code className="text-green-400">( )</code> <span className="text-gray-500">(precedence 3)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Playground;
