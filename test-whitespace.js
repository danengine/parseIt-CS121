// Test whitespace validation
import { generateLeftmostDerivation } from './src/lib/LeftmostDerivation.ts';
import { checkSyntax } from './src/lib/Parser.ts';

const testCases = [
  { input: '2+3', shouldWork: true },
  { input: '2 + 3', shouldWork: false },
  { input: '4+12+2', shouldWork: true },
  { input: '4 + 12 + 2', shouldWork: false },
  { input: 'a|b', shouldWork: true },
  { input: 'a | b', shouldWork: false }
];

console.log('Testing Whitespace Validation\n');
console.log('==============================\n');

testCases.forEach(({ input, shouldWork }) => {
  console.log(`Input: "${input}"`);
  try {
    const result = checkSyntax(input);
    if (shouldWork) {
      console.log(`✅ Expected to work - Result: ${result.isValid ? 'Valid' : 'Invalid'}`);
      if (result.isValid) {
        const derivation = generateLeftmostDerivation(input);
        console.log(`   Last step: "${derivation[derivation.length - 1]}"`);
      }
    } else {
      console.log(`❌ Expected to fail but worked - Result: Valid`);
    }
  } catch (error) {
    if (shouldWork) {
      console.log(`❌ Expected to work but failed - Error: ${error.message}`);
    } else {
      console.log(`✅ Expected to fail - Error: ${error.message}`);
    }
  }
  console.log('');
});

