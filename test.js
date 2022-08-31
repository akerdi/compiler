const {
  tokenizer,
  aster,
  compiler
} = require("./compiler")


// const input = 'if (+ x y) { * 8 9 } { / 9 3 }'
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
const input = "load \"hello.lspy\""

// const tokens = tokenizer(input)
// const ast = aster(tokens)
const ast = compiler(input)
console.log("ast: ", JSON.stringify(ast))
