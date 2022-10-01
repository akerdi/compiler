"use strict";

const LETTERS = /[a-zA-Z0-9_+\-*\/=<>!&\\]+/i;
const NUMBERS = /[0-9]/;
const CHAR = '"';
const WHITESPACE = /\s/;
const COMMENT = ";";

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
    if (WHITESPACE.test(char)) {
      current++;
      continue;
    }
    if (NUMBERS.test(char)) {
      let value = "";
      while (NUMBERS.test(char) && current < input.length) {
        value += char;
        char = input[++current];
      }
      tokens.push({ type: "num[]", value });
      continue;
    }
    if (char === CHAR) {
      let value = "";
      char = input[++current];
      while (char !== CHAR && current < input.length) {
        value += char;
        char = input[++current];
      }
      char = input[++current];
      tokens.push({ type: "char[]", value });
      continue;
    }
    if (char === COMMENT) {
      let value = "";
      char = input[++current];
      while (WHITESPACE.test(char)) {
        char = input[++current];
      }
      while (char !== "\r\n" && char !== "\n" && current < input.length) {
        value += char;
        char = input[++current];
      }
      char = input[++current];
      tokens.push({ type: "comment", value });
      continue;
    }
    if (LETTERS.test(char)) {
      let value = "";
      while (LETTERS.test(char) && current < input.length) {
        value += char;
        char = input[++current];
      }
      tokens.push({ type: "letter[]", value });
      continue;
    }
    throw new TypeError("未识别的类型: " + char);
  }
  return tokens;
}

function aster(tokens) {
  let current = 0;
  function walk() {
    let token = tokens[current];
    if (token.type === "comment") {
      current++;
      return {
        type: token.type,
        content: token.value,
      };
    }
    if (token.type === "letter[]") {
      current++;
      return {
        type: "symbol",
        content: token.value,
      };
    }
    if (token.type === "num[]") {
      current++;
      return {
        type: "number",
        content: token.value,
      };
    }
    if (token.type === "char[]") {
      current++;
      return {
        type: "string",
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
      while (token.type !== "semi" || (token.type === "semi" && token.value !== ")")) {
        node.children.push(walk());
        token = tokens[current];
      }
      current++;
      node.children.push({
        type: "semi",
        content: ")",
      });
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
      while (token.type !== "quote" || (token.type === "quote" && token.value !== "}")) {
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
function loadfile(filepath) {
  const fs = require("fs");
  const data = fs.readFileSync(filepath, { encoding: "utf-8" });
  return compiler(data);
}

module.exports = {
  tokenizer,
  aster,
  compiler,
  loadfile,
};
