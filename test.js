const { tokenizer, aster, compiler } = require("./compiler");

// const input = 'if (+ x y) { * 890909 9 } { / 9 3 }'

// tokenizer:
/**
[
  {type:"letter[]", value:"if"},
  {type:"semi", value:"("},
    {type:"letter[]", value: "+"}, {type:"letter[]", value:"x"}, {type:"letter[]", value:"y"},
  {type:"semi", value:")"},
  {type:"quote", value:"{"},
    {type:"letter[]", value="*"}, {type:"num[]", value:"890909"}, {type:"num[]", value:"9"},
  {type:"quote", value:"}"},
  {type:"quote", value:"{"},
    {type: "letter[]", value:"/"}, {type:"num[]", value:"9"}, {type:"num[]", value:"3"},
  {type:"quote",value:"}"}
]
 */

// aster:
/**
  {
    type: ">",
    children: [
      {type: "symbol", content: "if"},


      {
        type: "sexpr",
        children: [
          {type: "symbol", content: "("},
          {type: "symbol", content: "+"},
          {type: "symbol", content: "x"},
          {type: "symbol", content: "y"},
          {type: "symbol", content: ")"},
        ]
      },
      {
        type: "qexpr",
        children: [
          {type: "symbol", content: "{"},
          {type: "symbol", content: "*"},
          {type: "number", content: "890909"},
          {type: "number", content: "9"},
          {type: "symbol", content: "}"},
        ]
      },
      {
        type: "qexpr",
        children: [
          {type: "symbol", content: "{"},
          {type: "symbol", content: "/"},
          {type: "number", content: "9"},
          {type: "number", content: "3"},
          {type: "symbol", content: "}"},
        ]
      }
    ]
  }
 */
// const input = "(add 2 (subtract 4 2))"
// const input = "+ 1 2"
// const input = "if (+ x y) { * 8 9 } { / 9 3 }"
// const input = "+ 1 (* 7 5) 3"
// const input = "(- 100)"
// const input = "/"
// const input = "(/ ())"
// const input = "list 1 2 3 4"
// const input = "{head (list 1 2 3 4)}"
// const input = "eval {head (list 1 2 3 4)}"
// const input = "tail {tail tail tail}"
// const input = "eval (tail {tail tail {5 6 7}})"
// const input = "eval (head {(+ 1 2) (+ 10 20)})"
// const input = "def {x} 100"
// const input = "x"
// const input = "+ x y"
// const input = "def {a b} 5 6"
// const input = "def {arglist} {a b x y}"
// const input = "def {add-mul} (\\ {x y} {+ x (* x y)})"
// const input = "def {fun} (\\ {args body} {def (head args) (\\ (tail args) body)})"
// const input = "fun {add-together x y} {+ x y}"
// const input = "fun {unpack f xs} {eval (join (list f) xs)}"
// const input = "fun {pack f & xs} {f xs}"
// const input = "def {uncurry} pack"
// const input = "def {add-curried} (curry +)"
// const input = "print \"Hello World!\""
const input = 'load "hello.lspy" 111 22 load';

// const tokens = tokenizer(input)
// const ast = aster(tokens)
const ast = compiler(input);
console.log("ast: ", JSON.stringify(ast));
