/**
 * Let's make a calculator 🧮
 */
console.log(calculate('add', 1, 3)); // 4
console.log(calculate('substract', 3, 1)); // 2
console.log(calculate('multiply', 4, 2)); // 8
console.log(calculate('divide', 4, 2)); // 2
console.log(calculate('remain', 5, 2)); // 1

type Command = 'add' | 'substract' | 'multiply' | 'divide' | 'remain';

function calculate(command: Command, a: number, b: number) {
  switch (command) {
    case 'add':
      return a + b;
    case 'substract':
      return a - b;
    case 'multiply':
      return a * b;
    case 'divide':
      if (b === 0) {
        throw new Error('Cannot divide by zero');
      }
      return a / b;
    case 'remain':
      return a % b;
    default:
      throw new Error(`Invalid command: ${command}`);
  }
}
