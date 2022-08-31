'use strict';

function tokenizer(input) {
  let current = 0;
  let tokens = [];
  while (current < input.length) {
    let char = input[current];
    if (char === '(') {
      tokens.push({
        type: 'sexpr',
        value: '(',
      });
      current++;
      continue;
    }
    if (char === ')') {
      tokens.push({
        type: 'sexpr',
        value: ')',
      });
      current++;
      continue;
    }
    if (char === '{') {
      tokens.push({
        type: 'qexpr',
        value: '{',
      });
      current++;
      continue;
    }
    if (char === '}') {
      tokens.push({
        type: 'qexpr',
        value: '}',
      });
      current++;
      continue;
    }
    let WHITESPACE = /\s/;
    if (WHITESPACE.test(char)) {
      current++;
      continue;
    }
    let NUMBERS = /[0-9]/;
    if (NUMBERS.test(char)) {
      let value = '';
      while (NUMBERS.test(char) && current < input.length) {
        value += char;
        char = input[++current];
      }
      tokens.push({ type: 'number', value });
      continue;
    }
    if (char === '"') {
      let value = '';
      char = input[++current];
      while (char !== '"' && current < input.length) {
        value += char;
        char = input[++current];
      }
      char = input[++current];
      tokens.push({ type: 'string', value });
      continue
    }
    let LETTERS = /[a-z+\-\*\/\\&]/i;
    if (LETTERS.test(char)) {
      let value = '';
      while (LETTERS.test(char) && current < input.length) {
        value += char;
        char = input[++current];
      }
      tokens.push({ type: 'symbol', value });
      continue;
    }
    throw new TypeError('I dont know what this character is: ' + char)
  }
  return tokens;
}

function aster(tokens) {
  let current = 0;
  function walk() {
    let token = tokens[current]
    if (token.type === "symbol") {
      current++;
      return {
        type: token.type,
        content: token.value
      }
    }
    if (token.type === "number") {
      current++;
      return {
        type: token.type,
        content: token.value
      }
    }
    if (token.type === "string") {
      current++;
      return {
        type: token.type,
        content: token.value
      }
    }
    if (token.type === "sexpr" && token.value === "(") {
      let node = {
        type: token.type,
        children: [{
          type: "symbol",
          content: token.value,
        }]
      }
      token = tokens[++current]
      while (
        (token.type !== 'sexpr') ||
        (token.type === 'sexpr') && token.value !== ')'
      ) {
        node.children.push(walk());
        token = tokens[current]
      }
      node.children.push({
        type: "symbol",
        content: ")"
      })
      current++;
      return node
    }
    if (token.type === "qexpr" && token.value === "{") {
      let node = {
        type: token.type,
        children: [{
          type: "symbol",
          content: token.value,
        }]
      }
      token = tokens[++current]
      while (
        (token.type !== "qexpr") ||
        (token.type === "qexpr") && token.value !== "}"
      ) {
        node.children.push(walk());
        token = tokens[current]
        console.log("current token is qexpr close: " + token.value)
      }
      node.children.push({
        type: "symbol",
        content: "}"
      })
      current++;
      return node
    }
    throw new TypeError(token.type)
  }
  let ast = {
    type: ">",
    body: []
  }
  while (current < tokens.length) {
    ast.body.push(walk())
  }
  return ast
}

function compiler(input) {
  let tokens = tokenizer(input)
  return aster(tokens)
}

module.exports = {
  tokenizer,
  aster,
  compiler
}
