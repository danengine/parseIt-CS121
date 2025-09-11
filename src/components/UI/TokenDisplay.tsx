import React from "react";
import { TokenType } from "../../lib/Tokenizer";

interface Token {
  type: string;
  value: string;
  position: number;
}

interface TokenDisplayProps {
  tokens: Token[];
  tokensString: string;
}

/**
 * Component to display tokenization results
 * Shows the breakdown of input into individual tokens
 */
const TokenDisplay: React.FC<TokenDisplayProps> = ({ tokens, tokensString }) => {
  const getTokenTypeColor = (type: string): string => {
    switch (type) {
      case TokenType.DIGIT:
        return "text-blue-400";
      case TokenType.CHAR:
        return "text-green-400";
      case TokenType.PLUS:
      case TokenType.MINUS:
      case TokenType.MULTIPLY:
      case TokenType.DIVIDE:
        return "text-orange-400";
      case TokenType.UNION:
      case TokenType.KLEENE_STAR:
        return "text-purple-400";
      case TokenType.LPAREN:
      case TokenType.RPAREN:
        return "text-yellow-400";
      case TokenType.DOT:
        return "text-gray-400";
      case TokenType.EOF:
        return "text-red-400";
      default:
        return "text-white";
    }
  };

  const getTokenDescription = (type: string): string => {
    switch (type) {
      case TokenType.DIGIT:
        return "Digit (0-9)";
      case TokenType.CHAR:
        return "Character literal";
      case TokenType.PLUS:
        return "Addition operator";
      case TokenType.MINUS:
        return "Subtraction operator";
      case TokenType.MULTIPLY:
        return "Multiplication operator";
      case TokenType.DIVIDE:
        return "Division operator";
      case TokenType.UNION:
        return "Regex union operator";
      case TokenType.KLEENE_STAR:
        return "Regex Kleene star";
      case TokenType.LPAREN:
        return "Left parenthesis";
      case TokenType.RPAREN:
        return "Right parenthesis";
      case TokenType.DOT:
        return "Decimal point";
      case TokenType.EOF:
        return "End of input";
      default:
        return "Unknown token";
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-600 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-700 border-b border-gray-600">
        <h4 
          className="text-lg font-semibold text-teal-400"
          style={{ fontFamily: "DM Mono, monospace" }}
        >
          Tokenization Results
        </h4>
        <p 
          className="text-sm text-gray-300 mt-1"
          style={{ fontFamily: "DM Mono, monospace" }}
        >
          Input broken down into individual tokens
        </p>
      </div>

      {/* Token String */}
      <div className="px-6 py-4 bg-gray-750">
        <div className="mb-3">
          <span 
            className="text-sm text-gray-400"
            style={{ fontFamily: "DM Mono, monospace" }}
          >
            Token sequence:
          </span>
        </div>
        <code 
          className="text-teal-400 bg-gray-800 px-3 py-2 rounded text-sm block"
          style={{ fontFamily: "DM Mono, monospace" }}
        >
          {tokensString}
        </code>
      </div>

      {/* Token Details */}
      <div className="px-6 py-4">
        <div className="mb-3">
          <span 
            className="text-sm text-gray-400"
            style={{ fontFamily: "DM Mono, monospace" }}
          >
            Token details:
          </span>
        </div>
        
        <div className="space-y-2">
          {tokens
            .filter(token => token.type !== TokenType.EOF)
            .map((token, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <span 
                    className="text-xs text-gray-500 w-6"
                    style={{ fontFamily: "DM Mono, monospace" }}
                  >
                    {index + 1}.
                  </span>
                  
                  <div className="flex items-center space-x-3">
                    <code 
                      className={`font-bold text-sm ${getTokenTypeColor(token.type)}`}
                      style={{ fontFamily: "DM Mono, monospace" }}
                    >
                      "{token.value}"
                    </code>
                    
                    <span 
                      className="text-xs text-gray-400 bg-gray-600 px-2 py-1 rounded"
                      style={{ fontFamily: "DM Mono, monospace" }}
                    >
                      {token.type}
                    </span>
                  </div>
                </div>
                
                <span 
                  className="text-xs text-gray-400"
                  style={{ fontFamily: "DM Mono, monospace" }}
                >
                  {getTokenDescription(token.type)}
                </span>
              </div>
            ))}
        </div>

        {/* Explanation */}
        <div className="mt-4 p-4 bg-gray-600 rounded-lg">
          <p 
            className="text-sm text-gray-300"
            style={{ fontFamily: "DM Mono, monospace" }}
          >
            <strong>Tokenization:</strong> This shows how your input is broken down into individual tokens 
            before parsing. Each token represents a meaningful unit (digit, operator, character, etc.) 
            that the parser will process. The tokenizer automatically distinguishes between multiplication 
            (*) and Kleene star (*) based on context. Decimals like 1.5 are tokenized as separate tokens: 
            digit, dot, digit.
            <br/><br/>
            <strong>Token Types:</strong> Digits (blue), Characters (green), Arithmetic operators (orange), 
            Regex operators (purple), Parentheses (yellow), Special symbols (gray).
          </p>
        </div>
      </div>
    </div>
  );
};

export default TokenDisplay;
