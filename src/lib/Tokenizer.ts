/**
 * Tokenizer for arithmetic expressions and regex patterns
 * Handles lexical analysis and token generation
 * Author: CS121 Team
 */

export interface Token {
  type: string;
  value: string;
  position: number;
}

export const TokenType = {
  // Arithmetic operators
  PLUS: "PLUS",
  MINUS: "MINUS", 
  MULTIPLY: "MULTIPLY",
  DIVIDE: "DIVIDE",
  
  // Regex operators
  UNION: "UNION", // |
  KLEENE_STAR: "KLEENE_STAR", // * (when used as regex operator)
  
  // Literals
  DIGIT: "DIGIT", // 0-9
  CHAR: "CHAR", // a-z
  
  // Structural
  LPAREN: "LPAREN", // (
  RPAREN: "RPAREN", // )
  DOT: "DOT", // .
  
  // End of input
  EOF: "EOF"
} as const;

export class Tokenizer {
  private text: string;
  private pos: number = 0;
  private tokens: Token[] = [];

  constructor(text: string) {
    this.text = text;
    // Check for whitespace and provide specific position information for all occurrences
    const whitespaceMatches = Array.from(this.text.matchAll(/\s/g));
    if (whitespaceMatches.length > 0) {
      const positions = whitespaceMatches.map(match => {
        const position = match.index!;
        const whitespaceChar = match[0];
        const charName = whitespaceChar === ' ' ? 'space' : 
                        whitespaceChar === '\t' ? 'tab' : 
                        whitespaceChar === '\n' ? 'newline' : 
                        'whitespace character';
        return `${charName} at position ${position + 1}`;
      });
      
      let positionText;
      if (positions.length === 1) {
        positionText = positions[0];
      } else {
        // Extract just the position numbers
        const allPositions = positions.map(p => p.split(' at position ')[1]).join(', ');
        // Get the character type from the first position
        const charType = positions[0].split(' at position ')[0];
        positionText = `${charType} at positions ${allPositions}`;
      }
      
      throw new SyntaxError(`Syntax invalid due to ${positionText}. Whitespace is not allowed.`);
    }
  }

  /**
   * Peek at the current character without consuming it
   */
  private peek(): string | null {
    return this.pos < this.text.length ? this.text[this.pos] : null;
  }

  /**
   * Consume and return the current character
   */
  private consume(): string {
    const char = this.peek();
    if (char !== null) {
      this.pos++;
    }
    return char || "";
  }

  /**
   * Check if a character is a digit (0-9)
   */
  private isDigit(char: string): boolean {
    return /[0-9]/.test(char);
  }

  /**
   * Check if a character is a letter (a-z)
   */
  private isChar(char: string): boolean {
    return /[a-z]/i.test(char);
  }

  /**
   * Tokenize a single digit (0-9)
   */
  private tokenizeDigit(): Token {
    const startPos = this.pos;
    const value = this.consume();

    return {
      type: TokenType.DIGIT,
      value,
      position: startPos
    };
  }

  /**
   * Tokenize a character (a-z)
   */
  private tokenizeChar(): Token {
    const startPos = this.pos;
    const value = this.consume();

    return {
      type: TokenType.CHAR,
      value,
      position: startPos
    };
  }

  /**
   * Determine if * should be treated as multiplication or Kleene star
   * based on context
   */
  private isMultiplicationContext(): boolean {
    // Look at previous token to determine context
    if (this.tokens.length === 0) return false;
    
    const prevToken = this.tokens[this.tokens.length - 1];
    
    // If previous token is a digit or closing parenthesis, likely multiplication
    if (prevToken.type === TokenType.DIGIT || prevToken.type === TokenType.RPAREN) {
      return true;
    }
    
    // If previous token is a character, likely Kleene star
    if (prevToken.type === TokenType.CHAR) {
      return false;
    }
    
    return false;
  }

  /**
   * Tokenize the entire input string
   */
  public tokenize(): Token[] {
    this.tokens = [];
    this.pos = 0;

    while (this.peek() !== null) {
      const char = this.peek()!;

      switch (char) {
        case "+":
          this.tokens.push({
            type: TokenType.PLUS,
            value: this.consume(),
            position: this.pos - 1
          });
          break;

        case "-":
          this.tokens.push({
            type: TokenType.MINUS,
            value: this.consume(),
            position: this.pos - 1
          });
          break;

        case "*":
          // Determine if this is multiplication or Kleene star
          const tokenType = this.isMultiplicationContext() 
            ? TokenType.MULTIPLY 
            : TokenType.KLEENE_STAR;
          
          this.tokens.push({
            type: tokenType,
            value: this.consume(),
            position: this.pos - 1
          });
          break;

        case "/":
          this.tokens.push({
            type: TokenType.DIVIDE,
            value: this.consume(),
            position: this.pos - 1
          });
          break;

        case "|":
          this.tokens.push({
            type: TokenType.UNION,
            value: this.consume(),
            position: this.pos - 1
          });
          break;

        case "(":
          this.tokens.push({
            type: TokenType.LPAREN,
            value: this.consume(),
            position: this.pos - 1
          });
          break;

        case ")":
          this.tokens.push({
            type: TokenType.RPAREN,
            value: this.consume(),
            position: this.pos - 1
          });
          break;

        case ".":
          this.tokens.push({
            type: TokenType.DOT,
            value: this.consume(),
            position: this.pos - 1
          });
          break;

        default:
          if (this.isDigit(char)) {
            this.tokens.push(this.tokenizeDigit());
          } else if (this.isChar(char)) {
            this.tokens.push(this.tokenizeChar());
          } else {
            throw new SyntaxError(`Unexpected character '${char}' at position ${this.pos}`);
          }
          break;
      }
    }

    // Add EOF token
    this.tokens.push({
      type: TokenType.EOF,
      value: "",
      position: this.pos
    });

    return this.tokens;
  }

  /**
   * Get the list of tokens
   */
  public getTokens(): Token[] {
    return [...this.tokens];
  }

  /**
   * Get a formatted string representation of tokens for debugging
   */
  public getTokensString(): string {
    return this.tokens
      .filter(token => token.type !== TokenType.EOF)
      .map(token => `${token.type}(${token.value})`)
      .join(" ");
  }
}

// Utility function for tokenization
export function tokenizeExpression(expression: string): {
  tokens: Token[];
  tokensString: string;
} {
  try {
    const tokenizer = new Tokenizer(expression);
    const tokens = tokenizer.tokenize();
    return {
      tokens,
      tokensString: tokenizer.getTokensString()
    };
  } catch (e: any) {
    throw new Error(e.message);
  }
}
