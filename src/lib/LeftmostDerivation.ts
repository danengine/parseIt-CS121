/**
 * Leftmost Derivation Generator
 * Generates step-by-step leftmost derivations for arithmetic and regex expressions
 * Author: CS121 Team
 * Converted from Python implementation
 */

interface Node {
  name: string;
  prod: string[];
  children: Node[];
}

export class LeftmostDerivation {
  private text: string;
  private pos: number = 0;

  constructor(text: string) {
    this.text = text.replace(/\s+/g, ""); // Remove whitespace
  }

  /**
   * Generate leftmost derivation for the input string
   */
  public generateDerivation(): string[] {
    try {
      const root = this.parse();
      return this.leftmostDerivation(root);
    } catch (error) {
      throw new Error(`Parse error: ${error}`);
    }
  }

  /**
   * Skip whitespace (not needed since we remove it in constructor)
   */
  private skipWs(): void {
    while (this.pos < this.text.length && /\s/.test(this.text[this.pos])) {
      this.pos++;
    }
  }

  /**
   * Peek at the next character
   */
  private peek(): string | null {
    this.skipWs();
    if (this.pos < this.text.length) {
      return this.text[this.pos];
    }
    return null;
  }

  /**
   * Consume the next character
   */
  private consume(expected?: string): string {
    const c = this.peek();
    if (c === null) {
      throw new Error(`Unexpected end of input, expected ${expected}`);
    }
    if (expected !== undefined && c !== expected) {
      throw new Error(`Expected '${expected}' but got '${c}' at pos ${this.pos}`);
    }
    this.pos++;
    return c;
  }

  /**
   * Main parser method
   */
  private parse(): Node {
    const root = this.expr();
    if (this.peek() !== null) {
      throw new Error(`Unexpected input at pos ${this.pos}: '${this.peek()}'`);
    }
    return root;
  }

  /**
   * Parse expression: expr -> union
   */
  private expr(): Node {
    const u = this.union();
    return { name: 'expr', prod: ['<union>'], children: [u] };
  }

  /**
   * Parse union: union -> concat | union "|" concat
   */
  private union(): Node {
    const cnode = this.concat();
    let left: Node = { name: 'union', prod: ['<concat>'], children: [cnode] };
    
    while (this.peek() === '|') {
      this.consume('|');
      const right = this.concat();
      left = { name: 'union', prod: ['<union>', '|', '<concat>'], children: [left, right] };
    }
    
    return left;
  }

  /**
   * Parse concatenation: concat -> arith | concat arith
   */
  private concat(): Node {
    const anode = this.arith();
    let left: Node = { name: 'concat', prod: ['<arith>'], children: [anode] };
    
    // concat when next token begins an arith: digit, letter, '('
    while (true) {
      const p = this.peek();
      if (p === null) break;
      if (/\d/.test(p) || /[a-z]/.test(p) || p === '(') {
        const right = this.arith();
        left = { name: 'concat', prod: ['<concat>', '<arith>'], children: [left, right] };
      } else {
        break;
      }
    }
    
    return left;
  }

  /**
   * Parse arithmetic: arith -> term | arith "+" term | arith "-" term
   */
  private arith(): Node {
    const tnode = this.term();
    let left: Node = { name: 'arith', prod: ['<term>'], children: [tnode] };
    
    while (true) {
      const p = this.peek();
      if (p === '+' || p === '-') {
        const op = this.consume();
        const right = this.term();
        left = { name: 'arith', prod: ['<arith>', op, '<term>'], children: [left, right] };
      } else {
        break;
      }
    }
    
    return left;
  }

  /**
   * Parse term: term -> factor | term "*" factor | term "/" factor
   */
  private term(): Node {
    const fnode = this.factor();
    let left: Node = { name: 'term', prod: ['<factor>'], children: [fnode] };
    
    while (true) {
      const p = this.peek();
      if (p === '*' || p === '/') {
        const op = this.consume();
        const right = this.factor();
        left = { name: 'term', prod: ['<term>', op, '<factor>'], children: [left, right] };
      } else {
        break;
      }
    }
    
    return left;
  }

  /**
   * Parse factor: factor -> base | base "*"
   */
  private factor(): Node {
    const bnode = this.base();
    
    // base or base '*'
    if (this.peek() === '*') {
      this.consume('*');
      return { name: 'factor', prod: ['<base>', '*'], children: [bnode] };
    }
    
    return { name: 'factor', prod: ['<base>'], children: [bnode] };
  }

  /**
   * Parse base: base -> number | char | "(" expr ")"
   */
  private base(): Node {
    const p = this.peek();
    if (p === null) {
      throw new Error("Unexpected end of input in base");
    }
    
    if (/\d/.test(p)) {
      const num = this.number();
      return { name: 'base', prod: ['<number>'], children: [num] };
    }
    
    if (/[a-z]/.test(p)) {
      const ch = this.char();
      return { name: 'base', prod: ['<char>'], children: [ch] };
    }
    
    if (p === '(') {
      this.consume('(');
      const exprNode = this.expr();
      this.consume(')');
      return { name: 'base', prod: ['(', '<expr>', ')'], children: [exprNode] };
    }
    
    throw new Error(`Unexpected character in base at pos ${this.pos}: '${p}'`);
  }

  /**
   * Parse number: number -> digit | digit number | digit "." number
   */
  private number(): Node {
    const dnode = this.digit();
    const p = this.peek();
    
    if (p === '.') {
      this.consume('.');
      const rest = this.number();
      return { name: 'number', prod: ['<digit>', '.', '<number>'], children: [dnode, rest] };
    }
    
    if (p !== null && /\d/.test(p)) {
      const rest = this.number();
      return { name: 'number', prod: ['<digit>', '<number>'], children: [dnode, rest] };
    }
    
    return { name: 'number', prod: ['<digit>'], children: [dnode] };
  }

  /**
   * Parse digit: digit -> 0 | 1 | 2 | ... | 9
   */
  private digit(): Node {
    const p = this.peek();
    if (p === null || !/\d/.test(p)) {
      throw new Error(`Expected digit at pos ${this.pos} but found '${p}'`);
    }
    const c = this.consume();
    return { name: 'digit', prod: [c], children: [] };
  }

  /**
   * Parse char: char -> a | b | c | ... | z
   */
  private char(): Node {
    const p = this.peek();
    if (p === null || !/[a-z]/.test(p)) {
      throw new Error(`Expected letter at pos ${this.pos} but found '${p}'`);
    }
    const c = this.consume();
    return { name: 'char', prod: [c], children: [] };
  }

  /**
   * Collect nonterminal nodes in leftmost (pre-order) order
   */
  private collectNodesPreorder(node: Node): Node[] {
    const nodes = [node];
    for (const child of node.children) {
      nodes.push(...this.collectNodesPreorder(child));
    }
    return nodes;
  }

  /**
   * Produce leftmost derivation sentential forms from the parse-tree root
   */
  private leftmostDerivation(root: Node): string[] {
    // Initial sentential form
    let sentential = [`<${root.name}>`];
    const steps = [sentential.join(' ')];
    
    const nodes = this.collectNodesPreorder(root); // preorder leftmost order
    let idx = 0;
    
    while (sentential.some(tok => tok.startsWith('<') && tok.endsWith('>'))) {
      if (idx >= nodes.length) {
        throw new Error("Node list exhausted while nonterminals remain");
      }
      
      const node = nodes[idx];
      
      // Find leftmost nonterminal position in sentential
      const leftmostI = sentential.findIndex(tok => tok.startsWith('<') && tok.endsWith('>'));
      
      // Replace with node.prod (which already uses '<name>' for nonterminals)
      sentential = [
        ...sentential.slice(0, leftmostI),
        ...node.prod,
        ...sentential.slice(leftmostI + 1)
      ];
      
      steps.push(sentential.join(' '));
      idx++;
    }
    
    return steps;
  }
}

/**
 * Generate leftmost derivation for an expression
 */
export function generateLeftmostDerivation(expression: string): string[] {
  const derivation = new LeftmostDerivation(expression);
  return derivation.generateDerivation();
}