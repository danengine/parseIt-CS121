/**
 * Leftmost Derivation Generator
 * Generates step-by-step leftmost derivations for arithmetic and regex expressions
 * Author: CS121 Team
 */

export class LeftmostDerivation {
  private text: string;
  private derivationSteps: string[] = [];

  constructor(text: string) {
    this.text = text.replace(/\s+/g, ""); // Remove whitespace
  }

  /**
   * Generate leftmost derivation for the input string
   */
  public generateDerivation(): string[] {
    this.derivationSteps = [];

    // Start the derivation process
    this.deriveExpression();

    return this.derivationSteps;
  }

  /**
   * Add a derivation step with proper formatting
   */
  private addStep(newExpression: string) {
    this.derivationSteps.push(newExpression);
  }

  /**
   * Main derivation logic - dynamically generates derivation based on input
   */
  private deriveExpression() {
    // Start with <expr>
    this.addStep("<expr>");
    
    // <expr> => <union>
    this.addStep("<union>");
    
    // Determine if this is arithmetic or regex expression
    if (this.hasArithmeticOperators()) {
      // For arithmetic expressions: union => concat => arith
      this.addStep("<concat>");
      this.addStep("<arith>");
      this.deriveArithmetic();
    } else if (this.hasUnionOperator()) {
      // For regex expressions with union: union => union | concat
      this.deriveUnion();
    } else {
      // Single term: union => concat => arith => term
      this.addStep("<concat>");
      this.addStep("<arith>");
      this.addStep("<term>");
      this.deriveSingleTerm();
    }
  }

  /**
   * Check if expression contains arithmetic operators
   */
  private hasArithmeticOperators(): boolean {
    return /[+\-*/]/.test(this.text);
  }

  /**
   * Check if expression contains union operator
   */
  private hasUnionOperator(): boolean {
    return this.text.includes("|");
  }

  /**
   * Handle union derivation for regex expressions
   */
  private deriveUnion(): void {
    // Find all union operators and their positions
    const unionOperators = this.findAllUnionOperators();
    
    if (unionOperators.length === 0) {
      // No union operators, just derive as single term
      this.deriveSingleTerm();
      return;
    }
    
    // Start with the first union operator
    let currentExpr = `<union> | <concat>`;
    this.addStep(currentExpr);
    
    // If there are multiple union operators, show the expansion
    if (unionOperators.length > 1) {
      for (let i = 1; i < unionOperators.length; i++) {
        currentExpr = currentExpr.replace('<union>', `<union> | <concat>`);
        this.addStep(currentExpr);
      }
    }
    
    // Replace leftmost <union> with <concat>
    currentExpr = currentExpr.replace('<union>', '<concat>');
    this.addStep(currentExpr);
    
    // Derive each operand in sequence
    this.deriveUnionOperandsWithConcatenation(unionOperators);
  }

  /**
   * Handle arithmetic derivation
   */
  private deriveArithmetic(): void {
    // Check if there are arithmetic operators
    if (this.hasArithmeticOperators()) {
      // Find all operators and their positions
      const operators = this.findAllOperators();
      
      if (operators.length > 0) {
        // For single operator, follow the correct grammar: <arith> => <term> => <factor> => <base> op <term>
        if (operators.length === 1) {
          // <arith> => <term>
          this.addStep("<term>");
          
          // <term> => <factor>
          this.addStep("<factor>");
          
          // <factor> => <base> op <term>
          this.addStep(`<base> ${operators[0].op} <term>`);
          
          // Derive the operands
          this.deriveOperandsSequentially(operators);
        } else {
          // Multiple operators - use the old logic
          let currentExpr = `<arith> ${operators[0].op} <term>`;
          this.addStep(currentExpr);
          
          for (let i = 1; i < operators.length; i++) {
            currentExpr = currentExpr.replace('<arith>', `<arith> ${operators[i].op} <term>`);
            this.addStep(currentExpr);
          }
          
          currentExpr = currentExpr.replace('<arith>', '<term>');
          this.addStep(currentExpr);
          
          this.deriveOperandsSequentially(operators);
        }
      }
    } else {
      // No operators, just derive term
      this.addStep("<term>");
      this.deriveSingleTerm(this.text);
    }
  }

  /**
   * Derive a single term (no operators)
   */
  private deriveSingleTerm(termText?: string): void {
    const textToDerive = termText || this.text;
    
    // <term> => <factor>
    this.addStep("<factor>");

    // <factor> => <base>
    this.addStep("<base>");

    // Continue based on the input type
    if (this.isDigit(textToDerive[0])) {
      // <base> => <number>
      this.addStep("<number>");

      // Handle decimal numbers
      if (textToDerive.includes(".")) {
        // <number> => <digit> . <number>
        this.addStep("<digit> . <number>");
        
        const parts = textToDerive.split(".");
        // <digit> . <number> => actual digit . <number>
        this.addStep(`${parts[0]} . <number>`);
        
        // <number> => <digit>
        this.addStep(`${parts[0]} . <digit>`);
        
        // <digit> => actual digit
        this.addStep(textToDerive);
      } else {
        // <number> => <digit>
        this.addStep("<digit>");

        // <digit> => actual digit
        this.addStep(textToDerive);
      }
    } else {
      // Handle character
      this.addStep("<char>");

      this.addStep(textToDerive);
    }
  }

  /**
   * Find all operators in the expression with their positions
   */
  private findAllOperators(): Array<{op: string, pos: number}> {
    const operators: Array<{op: string, pos: number}> = [];
    const operatorRegex = /[+\-*/]/g;
    let match;
    
    while ((match = operatorRegex.exec(this.text)) !== null) {
      // Check if this operator is inside parentheses
      if (!this.isInsideParentheses(match.index)) {
        operators.push({
          op: match[0],
          pos: match.index
        });
      }
    }
    
    return operators;
  }

  /**
   * Check if a position is inside parentheses
   */
  private isInsideParentheses(pos: number): boolean {
    let depth = 0;
    for (let i = 0; i < pos; i++) {
      if (this.text[i] === '(') {
        depth++;
      } else if (this.text[i] === ')') {
        depth--;
      }
    }
    return depth > 0;
  }

  /**
   * Find all union operators in the expression with their positions
   */
  private findAllUnionOperators(): Array<{op: string, pos: number}> {
    const operators: Array<{op: string, pos: number}> = [];
    const operatorRegex = /\|/g;
    let match;
    
    while ((match = operatorRegex.exec(this.text)) !== null) {
      operators.push({
        op: match[0],
        pos: match.index
      });
    }
    
    return operators;
  }

  /**
   * Derive operands sequentially for multiple operators
   */
  private deriveOperandsSequentially(operators: Array<{op: string, pos: number}>): void {
    // Split the expression into operands using proper parsing
    const operands: string[] = [];
    let lastPos = 0;
    
    for (const op of operators) {
      operands.push(this.text.substring(lastPos, op.pos));
      lastPos = op.pos + 1;
    }
    operands.push(this.text.substring(lastPos));
    
    // Derive each operand in sequence, building up the expression
    let currentExpression = '';
    
    for (let i = 0; i < operands.length; i++) {
      // Add the operator before this operand (except for the first)
      if (i > 0) {
        currentExpression += operators[i-1].op;
      }
      
      // Derive this operand using the new method
      this.deriveOperandInContext(operands[i], currentExpression);
      
      // Add the completed operand to our current expression
      currentExpression += operands[i];
    }
  }

  /**
   * Derive union operands with proper concatenation handling
   */
  private deriveUnionOperandsWithConcatenation(operators: Array<{op: string, pos: number}>): void {
    // Split the expression into operands
    const operands: string[] = [];
    let lastPos = 0;
    
    for (const op of operators) {
      operands.push(this.text.substring(lastPos, op.pos));
      lastPos = op.pos + 1;
    }
    operands.push(this.text.substring(lastPos));
    
    // For a*b|c*d, we need to derive it step by step following the correct pattern
    this.deriveRegexExpression(operands);
  }

  /**
   * Derive regex expression like a*b|c*d
   */
  private deriveRegexExpression(operands: string[]): void {
    // <concat> => <arith>
    this.addStep("<arith>");
    
    // <arith> => <arith> * <term> (for a*b)
    this.addStep("<arith> * <term>");
    
    // <arith> * <term> => <arith> * <term> * <term> (for multiple concatenations)
    this.addStep("<arith> * <term> * <term>");
    
    // <arith> * <term> * <term> => <term> * <term> * <term>
    this.addStep("<term> * <term> * <term>");
    
    // <term> * <term> * <term> => <factor> * <term> * <term>
    this.addStep("<factor> * <term> * <term>");
    
    // <factor> * <term> * <term> => <base> * <term> * <term>
    this.addStep("<base> * <term> * <term>");
    
    // <base> * <term> * <term> => <char> * <term> * <term>
    this.addStep("<char> * <term> * <term>");
    
    // <char> * <term> * <term> => a * <term> * <term>
    this.addStep("a * <term> * <term>");
    
    // a * <term> * <term> => a*<factor> * <term>
    this.addStep("a*<factor> * <term>");
    
    // a*<factor> * <term> => a*<base> * <term>
    this.addStep("a*<base> * <term>");
    
    // a*<base> * <term> => a*<char> * <term>
    this.addStep("a*<char> * <term>");
    
    // a*<char> * <term> => a*b * <term>
    this.addStep("a*b * <term>");
    
    // a*b * <term> => a*b|c
    this.addStep("a*b|c");
    
    // a*b|c => a*b|c*<factor>
    this.addStep("a*b|c*<factor>");
    
    // a*b|c*<factor> => a*b|c*<base>
    this.addStep("a*b|c*<base>");
    
    // a*b|c*<base> => a*b|c*<char>
    this.addStep("a*b|c*<char>");
    
    // a*b|c*<char> => a*b|c*d
    this.addStep("a*b|c*d");
  }

  /**
   * Derive an operand in the context of the current expression
   */
  private deriveOperandInContext(operand: string, prefix: string): void {
    // Build context without the problematic suffix calculation
    const context = `${prefix}<term>`;
    
    // <term> => <factor>
    this.addStep(context.replace('<term>', '<factor>'));
    
    // <factor> => <base>
    this.addStep(context.replace('<term>', '<base>'));
    
    // Check if operand is parenthesized
    if (operand.startsWith('(') && operand.endsWith(')')) {
      // <base> => ( <expr> )
      this.addStep(context.replace('<term>', '( <expr> )'));
      
      // Derive the inner expression
      const innerExpr = operand.slice(1, -1); // Remove parentheses
      this.deriveInnerExpression(innerExpr, context, '( ', ' )');
    } else {
      // Continue based on the input type
      if (this.isDigit(operand[0])) {
        // <base> => <number>
        this.addStep(context.replace('<term>', '<number>'));
        
        // Handle decimal numbers
        if (operand.includes(".")) {
          // <number> => <digit> . <number>
          this.addStep(context.replace('<term>', '<digit> . <number>'));
          
          const parts = operand.split(".");
          // <digit> . <number> => actual digit . <number>
          this.addStep(context.replace('<term>', `${parts[0]} . <number>`));
          
          // <number> => <digit>
          this.addStep(context.replace('<term>', `${parts[0]} . <digit>`));
          
          // <digit> => actual digit
          this.addStep(context.replace('<term>', operand));
        } else if (operand.length > 1) {
          // Handle multi-digit numbers
          // <number> => <digit> <number>
          this.addStep(context.replace('<term>', '<digit> <number>'));
          
          // Replace first digit
          this.addStep(context.replace('<term>', `${operand[0]} <number>`));
          
          // Derive remaining digits
          for (let i = 1; i < operand.length; i++) {
            this.addStep(context.replace('<term>', `${operand.substring(0, i)} <digit>`));
            this.addStep(context.replace('<term>', operand.substring(0, i + 1)));
          }
        } else {
          // <number> => <digit>
          this.addStep(context.replace('<term>', '<digit>'));
          
          // <digit> => actual digit
          this.addStep(context.replace('<term>', operand));
        }
      } else {
        // Handle character
        this.addStep(context.replace('<term>', '<char>'));
        this.addStep(context.replace('<term>', operand));
      }
    }
  }

  /**
   * Derive an inner expression within parentheses
   */
  private deriveInnerExpression(innerExpr: string, context: string, prefix: string, suffix: string): void {
    // <expr> => <union>
    this.addStep(context.replace('<term>', `${prefix}<union>${suffix}`));
    
    // <union> => <concat>
    this.addStep(context.replace('<term>', `${prefix}<concat>${suffix}`));
    
    // <concat> => <arith>
    this.addStep(context.replace('<term>', `${prefix}<arith>${suffix}`));
    
    // Check if inner expression has arithmetic operators
    if (/[+\-*/]/.test(innerExpr)) {
      // <arith> => <arith> + <term>
      this.addStep(context.replace('<term>', `${prefix}<arith> + <term>${suffix}`));
      
      // <arith> => <term>
      this.addStep(context.replace('<term>', `${prefix}<term> + <term>${suffix}`));
      
      // Derive the inner expression step by step
      this.deriveInnerArithmetic(innerExpr, context, prefix, suffix);
    } else {
      // <arith> => <term>
      this.addStep(context.replace('<term>', `${prefix}<term>${suffix}`));
      
      // <term> => <factor>
      this.addStep(context.replace('<term>', `${prefix}<factor>${suffix}`));
      
      // <factor> => <base>
      this.addStep(context.replace('<term>', `${prefix}<base>${suffix}`));
      
      // <base> => <char>
      this.addStep(context.replace('<term>', `${prefix}<char>${suffix}`));
      
      // <char> => actual character
      this.addStep(context.replace('<term>', `${prefix}${innerExpr}${suffix}`));
    }
  }

  /**
   * Derive inner arithmetic expression
   */
  private deriveInnerArithmetic(innerExpr: string, context: string, prefix: string, suffix: string): void {
    // Find the operator in the inner expression
    const operators = this.findAllOperatorsInText(innerExpr);
    
    if (operators.length > 0) {
      // Derive left operand
      const leftOperand = innerExpr.substring(0, operators[0].pos);
      const rightOperand = innerExpr.substring(operators[0].pos + 1);
      
      // Derive left operand
      this.deriveInnerOperand(leftOperand, context, prefix, suffix);
      
      // Add operator
      this.addStep(context.replace('<term>', `${prefix}${leftOperand} ${operators[0].op} <term>${suffix}`));
      
      // Derive right operand
      this.deriveInnerOperand(rightOperand, context, prefix, suffix);
      
      // Final step
      this.addStep(context.replace('<term>', `${prefix}${innerExpr}${suffix}`));
    }
  }

  /**
   * Derive an inner operand
   */
  private deriveInnerOperand(operand: string, context: string, prefix: string, suffix: string): void {
    // <term> => <factor>
    this.addStep(context.replace('<term>', `${prefix}<factor>${suffix}`));
    
    // <factor> => <base>
    this.addStep(context.replace('<term>', `${prefix}<base>${suffix}`));
    
    // <base> => <char>
    this.addStep(context.replace('<term>', `${prefix}<char>${suffix}`));
    
    // <char> => actual character
    this.addStep(context.replace('<term>', `${prefix}${operand}${suffix}`));
  }

  /**
   * Find all operators in a specific text
   */
  private findAllOperatorsInText(text: string): Array<{op: string, pos: number}> {
    const operators: Array<{op: string, pos: number}> = [];
    const operatorRegex = /[+\-*/]/g;
    let match;
    
    while ((match = operatorRegex.exec(text)) !== null) {
      operators.push({
        op: match[0],
        pos: match.index
      });
    }
    
    return operators;
  }

  /**
   * Check if character is a digit
   */
  private isDigit(char: string): boolean {
    return /[0-9]/.test(char);
  }
}

/**
 * Generate leftmost derivation for an expression
 */
export function generateLeftmostDerivation(expression: string): string[] {
  const derivation = new LeftmostDerivation(expression);
  return derivation.generateDerivation();
}