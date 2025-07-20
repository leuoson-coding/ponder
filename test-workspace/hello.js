// Welcome to Ponder IDE!
// This is a test file to verify the interface is working

console.log("Hello from Ponder IDE!");

function greetUser(name) {
    return `Hello, ${name}! Welcome to Ponder IDE.`;
}

const message = greetUser("Developer");
console.log(message);

// Test some syntax highlighting
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);

console.log("Original numbers:", numbers);
console.log("Doubled numbers:", doubled);
