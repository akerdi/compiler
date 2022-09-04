# 词法分析&AST

为了得到用户输入转化为虚拟状态树的数据，这篇文章分为两个步骤:

1. 词法分析 - tokenizer

2. 虚拟树生成 - aster

<!-- 这篇开始讲词法分析和 AST 的实现。实现 AST 即可基本完成语义的分析。 -->

## 词法分析 - tokenizer

`function tokenizer`将输入的 input 参数解析为一维词组。

首先设置`current = 0`, 记录读取偏移量。并且用 tokens 来存储识别到的词对象(`{ type, value }`).

```ts
interface IToken {
  type:
    | "semi"      // `(`, `)`
    | "quote"     // `{`, `}`
    | "num[]"     // 数字集
    | "char[]"    // 字符集
    | "letter[]"; // 字母集
  value: string;  // 保存实际数据
}
function tokenizer(input: string) {
  // 记录读取偏移量
  let current = 0;
  // 存储接下来识别到的词对象
  const tokens: IToken[] = [];
  // 循环读取字符
  while (current < input.length) {
    // 优先识别单个、特殊的字符(如`(|)|{|}|\s`)，接着识别连着的词(`999|"hello world"|eval`)

    // 从字符串中获得对应的字符
    let char = input[current];
    if (char === "(") {
      // 写入并记录对应type
      tokens.push({
        type: "semi",
        value: "(",
      });
      // 偏移量增加
      current++;
      continue;
    }
    // 与上面`(`处理方式相同
    ...)
    ...{
    ...}
    // 接着识别空格, 直接忽略这类
    const WHITESPACE = /\s/;
    if (WHITESPACE.test(char)) {
      current++;
      continue;
    }
    // 识别数字00000
    const NUMBERS = /[0-9]/;
    if (NUMBERS.test(char)) {
      let value = "";
      while (NUMBERS.test(char) && current < input.length) {
        value += char;
        char = input[++current];
      }
      tokens.push({ type: "num[]", value });
      continue;
    }
    // 识别字符串, 只要是`""`双引号括起来的就是字符串
    const CHAR = '"';
    if (char === CHAR) {
      let value = "";
      char = input[++current];
      while (char !== CHAR && current < input.length) {
        value += char;
        char = input[++current];
      }
      char = input[++current];
      tokens.push({ type: "char[]", value });
    }
    // 识别字母集, 满足识别基础的字母的集合
    const LETTERS = /[a-zA-Z0-9_+\-*\/=<>!&]+/i;
    if (LETTERS.test(char)) {
      let char = "";
      while (LETTERS.test(char) && current < input.length) {
        value += char;
        char = input[++current];
      }
      tokens.push({ type: "letter[]", value });
      continue;
    }
    // 其他的作为补充，否则报错不识别类型
    throw new TypeError("未识别的类型: " + char);
  }
  return tokens;
}
```

例如`input`的值为: `if (+ x y) { * 890909 9 } { / 9 3 }`

tokenizer 之后就是:

```json
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
```

`tokenizer`方法处理得到上面的一维词组。为了得到最终需要的虚拟状态树的数据，那么将该一维词组传入到接下来的`aster`方法.

## 虚拟树生成 - aster

同样设移量置偏`current = 0`. 当遇到起始字符为`(`, `{`时，都会开启进入内层读取，使用 walk 函数帮助内层数据读取.

```ts
interface INode {
  type:
    ">" |           // program
    "symbol"|
    "number"|
    "string"|
    "semi"|         // 保存 `(`, `)`
    "quote"         // 保存 `{`, `}`
  content?: string  // 保存实际数据
  children?: INode[]// 保存下层数据
}
function aster(tokens: IToken[]):INode {
  // 记录读取偏移量
  let current = 0;
  // walk函数接下来会详细说明
  function walk():INode {
    ...
  }
  // ast总对象
  const ast:INode = {
    type: ">",
    children: [] as INode[]// 保存内层INode
  };
  // 循环读取词组
  while (current < tokens.length) {
    const node:INode = walk()
    ast.children.push(node);
  }
  return ast;
}
```

上面是根据词组转化为虚拟状态树的数据。方法很简单，就是将一维词组数据，转化为多层的节点数据结构. `walk`函数读取词组数据，转化为对应的节点数据，并返回:

```ts
function walk(): INode {
  // 读取词
  let token = tokens[current];
  // 优先读取没有特殊含义的词(letter[]|num[]|char[]), 转化为INode
  if (token.type === "letter[]") {
    current++;
    return {
      type: "symbol",
      content: token.value
    };
  }
  // 与上面`letter[]`处理方式相同
  ...number
  ...string
  // 开始读取起始词('(','{'), 转化为多层的节点数据结构
  if (token.type === "semi" && token.value === "(") {
    // 如果遇到`(`则认定为sexpr
    // 并且children的第一个node 为`{type: "semi", content: "("}`
    const node = {
      type: "sexpr",
      children: [
        {
          type: token.type,
          content: token.value,
        }
      ]
    };
    // 接着往下读取，直至读到反括号`)`
    token = tokens[++current];
    while (
      token.type !== "semi" ||
      (token.type === "semi" && token.value !== ")")
    ) {
      // 这里读取的都是children 的子集
      // 如果又读取到了起始词('(','{')?
      // 那就继续往下包裹起来
      const sub_nodes:INode = walk()
      node.children.push(sub_nodes);
    }
    // 偏移量调整为下一个
    current++;
    // node的children补充一个结束节点数据
    node.children.push({
      type: "semi",
      content: ")"
    });
    return node;
  }
  // 与上面`sexpr`处理方式相同
  ...quote
  // 其他未识别到的词类型
  throw new TypeError(token.type);
}
```

最终 aster 转化虚拟状态树数据如:

```json
// const input = if (+ x y) { * 890909 9 } { / 9 3 }
{
  "type": ">",
  "children": [
    { "type": "symbol", "content": "if" },
    {
      "type": "sexpr",
      "children": [
        { "type": "symbol", "content": "(" },
        { "type": "symbol", "content": "+" },
        { "type": "symbol", "content": "x" },
        { "type": "symbol", "content": "y" },
        { "type": "symbol", "content": ")" }
      ]
    },
    {
      "type": "qexpr",
      "children": [
        { "type": "symbol", "content": "{" },
        { "type": "symbol", "content": "*" },
        { "type": "number", "content": "890909" },
        { "type": "number", "content": "9" },
        { "type": "symbol", "content": "}" }
      ]
    },
    {
      "type": "qexpr",
      "children": [
        { "type": "symbol", "content": "{" },
        { "type": "symbol", "content": "/" },
        { "type": "number", "content": "9" },
        { "type": "number", "content": "3" },
        { "type": "symbol", "content": "}" }
      ]
    }
  ]
}
```

## Compiler

最后联合`tokenizer`和`aster`, 将用户的 input 数据方便的转化为了虚拟状态树的数据:

```ts
function compiler(input: string): INode {
  const tokens = tokenizer(input);
  return aster(tokens);
}
```
