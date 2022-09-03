"use strict";

function tokenizer(input) {
  let current = 0;
  const tokens = [];
  while (current < input.length) {
    let char = input[current];
    if (char === "(") {
      tokens.push({
        type: "semi",
        value: "(",
      });
      current++;
      continue;
    }
    if (char === ")") {
      tokens.push({
        type: "semi",
        value: ")",
      });
      current++;
      continue;
    }
    if (char === "{") {
      tokens.push({
        type: "quote",
        value: "{",
      });
      current++;
      continue;
    }
    if (char === "}") {
      tokens.push({
        type: "quote",
        value: "}",
      });
      current++;
      continue;
    }
    const WHITESPACE = /\s/;
    if (WHITESPACE.test(char)) {
      current++;
      continue;
    }
    const NUMBERS = /[0-9]/;
    if (NUMBERS.test(char)) {
      let value = "";
      while (NUMBERS.test(char) && current < input.length) {
        value += char;
        char = input[++current];
      }
      tokens.push({ type: "number", value });
      continue;
    }
    if (char === '"') {
      let value = "";
      char = input[++current];
      while (char !== '"' && current < input.length) {
        value += char;
        char = input[++current];
      }
      char = input[++current];
      tokens.push({ type: "string", value });
      continue;
    }
    const LETTERS = /[a-z+\-\*\/\\&]/i;
    if (LETTERS.test(char)) {
      let value = "";
      while (LETTERS.test(char) && current < input.length) {
        value += char;
        char = input[++current];
      }
      tokens.push({ type: "symbol", value });
      continue;
    }
    throw new TypeError("I dont know what this character is: " + char);
  }
  return tokens;
}

function aster(tokens) {
  let current = 0;
  function walk() {
    let token = tokens[current];
    if (token.type === "symbol") {
      current++;
      return {
        type: token.type,
        content: token.value,
      };
    }
    if (token.type === "number") {
      current++;
      return {
        type: token.type,
        content: token.value,
      };
    }
    if (token.type === "string") {
      current++;
      return {
        type: token.type,
        content: token.value,
      };
    }
    if (token.type === "semi" && token.value === "(") {
      const node = {
        type: "sexpr",
        children: [
          {
            type: token.type,
            content: token.value,
          },
        ],
      };
      token = tokens[++current];
      while (
        token.type !== "semi" ||
        (token.type === "semi" && token.value !== ")")
      ) {
        node.children.push(walk());
        token = tokens[current];
      }
      node.children.push({
        type: "semi",
        content: ")",
      });
      current++;
      return node;
    }
    if (token.type === "quote" && token.value === "{") {
      const node = {
        type: "qexpr",
        children: [
          {
            type: token.type,
            content: token.value,
          },
        ],
      };
      token = tokens[++current];
      while (
        token.type !== "quote" ||
        (token.type === "quote" && token.value !== "}")
      ) {
        node.children.push(walk());
        token = tokens[current];
      }
      node.children.push({
        type: "quote",
        content: "}",
      });
      current++;
      return node;
    }
    throw new TypeError(token.type);
  }
  const ast = {
    type: ">",
    children: [],
  };
  while (current < tokens.length) {
    ast.children.push(walk());
  }
  return ast;
}

function compiler(input) {
  const tokens = tokenizer(input);
  return aster(tokens);
}

module.exports = {
  tokenizer,
  aster,
  compiler,
};
