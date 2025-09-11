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
    this.derivationSteps = ["<expr>"];

    // Start the derivation process
    this.deriveExpression();

    return this.derivationSteps;
  }


  /**
   * Add a derivation step
   */
  private addStep(newExpression: string) {
    this.derivationSteps.push(newExpression);
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
   * Check if expression has concatenation (multiple chars/numbers without operators)
   */
  private hasConcatenation(): boolean {
    // Simple heuristic: if we have multiple chars or mixed chars/digits without operators
    const withoutParens = this.text.replace(/[()]/g, "");
    return withoutParens.length > 1 && !/[+\-*/|]/.test(withoutParens);
  }

  /**
   * Main derivation logic - dynamically generates derivation based on input
   */
  private deriveExpression() {
    // Start with expr → union
    this.addStep("<union>");
    
    // Determine if this is arithmetic or regex expression
    if (this.hasArithmeticOperators()) {
      // For arithmetic expressions: union → concat → arith
      this.addStep("<concat>");
      this.addStep("<arith>");
      this.deriveArithmetic();
    } else if (this.hasUnionOperator()) {
      // For regex expressions with union: union → union | concat
      this.deriveUnion();
    } else if (this.hasConcatenation()) {
      // For regex concatenation: union → concat → concat arith
      this.addStep("<concat>");
      this.deriveConcatenation();
    } else {
      // Single term: union → concat → arith → term
      this.addStep("<concat>");
      this.addStep("<arith>");
      this.addStep("<term>");
      this.deriveSingleTerm();
    }
  }

  /**
   * Handle union derivation for regex expressions
   */
  private deriveUnion(): void {
    // Find the union operator position
    const unionPos = this.text.indexOf("|");
    const leftPart = this.text.substring(0, unionPos);
    const rightPart = this.text.substring(unionPos + 1);
    
    // union → union | concat
    this.addStep("<union> | <concat>");
    
    // Derive left side (union)
    this.addStep("<concat> | <concat>");
    
    // Derive left concat
    this.deriveLeftConcat(leftPart);
    
    // Derive right concat
    this.deriveRightConcat(rightPart);
    
    // Add the final complete expression
    this.addStep(this.text);
  }

  /**
   * Handle concatenation derivation for regex expressions
   */
  private deriveConcatenation(): void {
    // concat → concat arith
    this.addStep("<concat> <arith>");
    
    // Derive left concat
    this.deriveLeftConcatForConcat(this.text.substring(0, 1));
    
    // Derive right arith
    this.deriveRightArithForConcat(this.text.substring(1));
    
    // Add the final complete expression
    this.addStep(this.text);
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
        // Start with the first operator
        let currentExpr = `<arith> ${operators[0].op} <term>`;
        this.addStep(currentExpr);
        
        // If there are multiple operators, show the expansion
        if (operators.length > 1) {
          for (let i = 1; i < operators.length; i++) {
            currentExpr = currentExpr.replace('<arith>', `<arith> ${operators[i].op} <term>`);
            this.addStep(currentExpr);
          }
        }
        
        // Replace leftmost <arith> with <term>
        currentExpr = currentExpr.replace('<arith>', '<term>');
        this.addStep(currentExpr);
        
        // Derive each operand in sequence
        this.deriveOperandsSequentially(operators);
      }
    } else {
      // No operators, just derive term
      this.addStep("<term>");
      this.deriveSingleTerm(this.text);
    }
  }

  /**
   * Derive left concatenation part for concatenation expressions
   */
  private deriveLeftConcatForConcat(leftPart: string): void {
    // <concat> → <arith>
    this.addStep("<arith> <arith>");

    // <arith> → <term>
    this.addStep("<term> <arith>");

    // <term> → <factor>
    this.addStep("<factor> <arith>");

    // <factor> → <base>
    this.addStep("<base> <arith>");

    // Continue based on the input type
    if (this.isDigit(leftPart[0])) {
      // <base> → <number>
      this.addStep("<number> <arith>");

      // Handle decimal numbers
      if (leftPart.includes(".")) {
        // <number> → <digit> . <number>
        this.addStep("<digit> . <number> <arith>");
        
        const parts = leftPart.split(".");
        // <digit> . <number> → actual digit . <number>
        this.addStep(`${parts[0]} . <number> <arith>`);
        
        // <number> → <digit>
        this.addStep(`${parts[0]} . <digit> <arith>`);
        
        // <digit> → actual digit
        this.addStep(`${leftPart} <arith>`);
      } else {
        // <number> → <digit>
        this.addStep("<digit> <arith>");

        // <digit> → actual digit
        this.addStep(`${leftPart} <arith>`);
      }
    } else {
      // Handle character
      this.addStep("<char> <arith>");

      this.addStep(`${leftPart} <arith>`);
    }
  }

  /**
   * Derive right arithmetic part for concatenation expressions
   */
  private deriveRightArithForConcat(rightPart: string): void {
    // <arith> → <term>
    this.addStep(`${this.text.substring(0, 1)} <term>`);

    // <term> → <factor>
    this.addStep(`${this.text.substring(0, 1)} <factor>`);

    // <factor> → <base>
    this.addStep(`${this.text.substring(0, 1)} <base>`);

    // Continue based on the input type
    if (this.isDigit(rightPart[0])) {
      // <base> → <number>
      this.addStep(`${this.text.substring(0, 1)} <number>`);

      // Handle decimal numbers
      if (rightPart.includes(".")) {
        // <number> → <digit> . <number>
        this.addStep(`${this.text.substring(0, 1)} <digit> . <number>`);
        
        const parts = rightPart.split(".");
        // <digit> . <number> → actual digit . <number>
        this.addStep(`${this.text.substring(0, 1)} ${parts[0]} . <number>`);
        
        // <number> → <digit>
        this.addStep(`${this.text.substring(0, 1)} ${parts[0]} . <digit>`);
        
        // <digit> → actual digit
        this.addStep(this.text);
      } else {
        // <number> → <digit>
        this.addStep(`${this.text.substring(0, 1)} <digit>`);

        // <digit> → actual digit
        this.addStep(this.text);
      }
    } else {
      // Handle character
      this.addStep(`${this.text.substring(0, 1)} <char>`);

      this.addStep(this.text);
    }
  }

  /**
   * Derive left concatenation part
   */
  private deriveLeftConcat(leftPart: string): void {
    // <concat> → <arith>
    this.addStep("<arith> | <concat>");

    // <arith> → <term>
    this.addStep("<term> | <concat>");

    // <term> → <factor>
    this.addStep("<factor> | <concat>");

    // <factor> → <base>
    this.addStep("<base> | <concat>");

    // Continue based on the input type
    if (this.isDigit(leftPart[0])) {
      // <base> → <number>
      this.addStep("<number> | <concat>");

      // Handle decimal numbers
      if (leftPart.includes(".")) {
        // <number> → <digit> . <number>
        this.addStep("<digit> . <number> | <concat>");
        
        const parts = leftPart.split(".");
        // <digit> . <number> → actual digit . <number>
        this.addStep(`${parts[0]} . <number> | <concat>`);
        
        // <number> → <digit>
        this.addStep(`${parts[0]} . <digit> | <concat>`);
        
        // <digit> → actual digit
        this.addStep(`${leftPart} | <concat>`);
      } else {
        // <number> → <digit>
        this.addStep("<digit> | <concat>");

        // <digit> → actual digit
        this.addStep(`${leftPart} | <concat>`);
      }
    } else {
      // Handle character
      this.addStep("<char> | <concat>");

      this.addStep(`${leftPart} | <concat>`);
    }
  }

  /**
   * Derive right concatenation part
   */
  private deriveRightConcat(rightPart: string): void {
    // <concat> → <arith>
    this.addStep(`${this.text.substring(0, this.text.indexOf("|"))} | <arith>`);

    // <arith> → <term>
    this.addStep(`${this.text.substring(0, this.text.indexOf("|"))} | <term>`);

    // <term> → <factor>
    this.addStep(`${this.text.substring(0, this.text.indexOf("|"))} | <factor>`);

    // <factor> → <base>
    this.addStep(`${this.text.substring(0, this.text.indexOf("|"))} | <base>`);

    // Continue based on the input type
    if (this.isDigit(rightPart[0])) {
      // <base> → <number>
      this.addStep(`${this.text.substring(0, this.text.indexOf("|"))} | <number>`);

      // Handle decimal numbers
      if (rightPart.includes(".")) {
        // <number> → <digit> . <number>
        this.addStep(`${this.text.substring(0, this.text.indexOf("|"))} | <digit> . <number>`);
        
        const parts = rightPart.split(".");
        // <digit> . <number> → actual digit . <number>
        this.addStep(`${this.text.substring(0, this.text.indexOf("|"))} | ${parts[0]} . <number>`);
        
        // <number> → <digit>
        this.addStep(`${this.text.substring(0, this.text.indexOf("|"))} | ${parts[0]} . <digit>`);
        
        // <digit> → actual digit
        this.addStep(this.text);
      } else {
        // <number> → <digit>
        this.addStep(`${this.text.substring(0, this.text.indexOf("|"))} | <digit>`);

        // <digit> → actual digit
        this.addStep(this.text);
      }
    } else {
      // Handle character
      this.addStep(`${this.text.substring(0, this.text.indexOf("|"))} | <char>`);

      this.addStep(this.text);
    }
  }

  /**
   * Derive left operand of arithmetic expression
   */
  private deriveLeftOperand(leftPart: string, operator: string): void {
    // <term> → <factor>
    this.addStep(`<factor> ${operator} <term>`);

    // <factor> → <base>
    this.addStep(`<base> ${operator} <term>`);

    // Continue based on the input type
    if (this.isDigit(leftPart[0])) {
      // <base> → <number>
      this.addStep(`<number> ${operator} <term>`);

      // Handle decimal numbers
      if (leftPart.includes(".")) {
        // <number> → <digit> . <number>
        this.addStep(`<digit> . <number> ${operator} <term>`);
        
        const parts = leftPart.split(".");
        // <digit> . <number> → actual digit . <number>
        this.addStep(`${parts[0]} . <number> ${operator} <term>`);
        
        // <number> → <digit>
        this.addStep(`${parts[0]} . <digit> ${operator} <term>`);
        
        // <digit> → actual digit
        this.addStep(`${leftPart} ${operator} <term>`);
      } else {
        // <number> → <digit>
        this.addStep(`<digit> ${operator} <term>`);

        // <digit> → actual digit
        this.addStep(`${leftPart} ${operator} <term>`);
      }
    } else {
      // Handle character
      this.addStep(`<char> ${operator} <term>`);

      this.addStep(`${leftPart} ${operator} <term>`);
    }
  }

  /**
   * Derive right operand of arithmetic expression
   */
  private deriveRightOperand(rightPart: string, operator: string): void {
    // <term> → <factor>
    this.addStep(`${this.text.substring(0, this.text.indexOf(operator))} ${operator} <factor>`);

    // <factor> → <base>
    this.addStep(`${this.text.substring(0, this.text.indexOf(operator))} ${operator} <base>`);

    // Continue based on the input type
    if (this.isDigit(rightPart[0])) {
      // <base> → <number>
      this.addStep(`${this.text.substring(0, this.text.indexOf(operator))} ${operator} <number>`);

      // Handle decimal numbers
      if (rightPart.includes(".")) {
        // <number> → <digit> . <number>
        this.addStep(`${this.text.substring(0, this.text.indexOf(operator))} ${operator} <digit> . <number>`);
        
        const parts = rightPart.split(".");
        // <digit> . <number> → actual digit . <number>
        this.addStep(`${this.text.substring(0, this.text.indexOf(operator))} ${operator} ${parts[0]} . <number>`);
        
        // <number> → <digit>
        this.addStep(`${this.text.substring(0, this.text.indexOf(operator))} ${operator} ${parts[0]} . <digit>`);
        
        // <digit> → actual digit
        this.addStep(this.text);
      } else {
        // <number> → <digit>
        this.addStep(`${this.text.substring(0, this.text.indexOf(operator))} ${operator} <digit>`);

        // <digit> → actual digit
        this.addStep(this.text);
      }
    } else {
      // Handle character
      this.addStep(`${this.text.substring(0, this.text.indexOf(operator))} ${operator} <char>`);

      this.addStep(this.text);
    }
  }

  /**
   * Derive a single term (no operators)
   */
  private deriveSingleTerm(termText?: string): void {
    const textToDerive = termText || this.text;
    
    // <term> → <factor>
    this.addStep("<factor>");

    // <factor> → <base>
    this.addStep("<base>");

    // Continue based on the input type
    if (this.isDigit(textToDerive[0])) {
      // <base> → <number>
      this.addStep("<number>");

      // Handle decimal numbers
      if (textToDerive.includes(".")) {
        // <number> → <digit> . <number>
        this.addStep("<digit> . <number>");
        
        const parts = textToDerive.split(".");
        // <digit> . <number> → actual digit . <number>
        this.addStep(`${parts[0]} . <number>`);
        
        // <number> → <digit>
        this.addStep(`${parts[0]} . <digit>`);
        
        // <digit> → actual digit
        this.addStep(textToDerive);
      } else {
        // <number> → <digit>
        this.addStep("<digit>");

        // <digit> → actual digit
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
    // Split the expression into operands
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
        currentExpression += ` ${operators[i-1].op} `;
      }
      
      // Derive this operand
      this.deriveOperandInContext(operands[i], currentExpression, i === operands.length - 1);
      
      // Add the completed operand to our current expression
      currentExpression += operands[i];
    }
  }

  /**
   * Derive an operand in the context of the current expression
   */
  private deriveOperandInContext(operand: string, prefix: string, isLast: boolean): void {
    const suffix = isLast ? '' : ' + <term>'.repeat(this.text.split(/[+\-*/]/).length - operand.length);
    const context = `${prefix}<term>${suffix}`;
    
    // <term> → <factor>
    this.addStep(context.replace('<term>', '<factor>'));
    
    // <factor> → <base>
    this.addStep(context.replace('<term>', '<base>'));
    
    // Continue based on the input type
    if (this.isDigit(operand[0])) {
      // <base> → <number>
      this.addStep(context.replace('<term>', '<number>'));
      
      // Handle multi-digit numbers
      if (operand.length > 1) {
        // <number> → <digit> <number>
        this.addStep(context.replace('<term>', '<digit> <number>'));
        
        // Replace first digit
        this.addStep(context.replace('<term>', `${operand[0]} <number>`));
        
        // Derive remaining digits
        for (let i = 1; i < operand.length; i++) {
          this.addStep(context.replace('<term>', `${operand.substring(0, i)} <digit>`));
          this.addStep(context.replace('<term>', operand.substring(0, i + 1)));
        }
      } else {
        // <number> → <digit>
        this.addStep(context.replace('<term>', '<digit>'));
        
        // <digit> → actual digit
        this.addStep(context.replace('<term>', operand));
      }
    } else {
      // Handle character
      this.addStep(context.replace('<term>', '<char>'));
      this.addStep(context.replace('<term>', operand));
    }
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
