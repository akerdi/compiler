# Compiler

词法分析和 ast

用法:

```js
const compiler = require('compiler')

const input = "eval { head { 1 2 3 4} }"
const ast = compiler.compiler(input)

// 或者
const ast = compiler.loadfile("hello.lsp")
```

更具体见[test.js](test.js)

## [词法分析&AST 教程](./tech/README.md)
