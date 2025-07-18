# Writing Treesitter Parser

## Treesitter CLI Util

## AST & CTS

- A tree only contains **named nodes** is a abstract syntax tree(AST)
- A tree contains **both named and unnamed nodes** is a concrete syntax tree(CST)

## Grammar Structure

- `name`: name of that parser
- `rules`: rules for generating nodes
- see [doc](https://tree-sitter.github.io/tree-sitter/creating-parsers/2-the-grammar-dsl.html) for more properties of a grammar.

## Tree Structure

Treesitter syntax tree(and its query) is generally represented in scheme language, a lisp dialect.
Each `()` initializes a new list, each element in the list is either presented as node type(named nodes) or string literal(unnamed nodes).
The **node type** is name of rule that matched the section.

- **field** : Each element might have a *field name* such as `kind: "const"` to give the element(node) a **descriptive** name in context.
- **token**: Each atomic node is considered as a token, such as `(number)` and `(comment)` in the example.

> [!NOTE]
> A unnamed node could have *field name*, the field name is for node representation in tree, not the nominal identity of that node.

```query
; generated tree for javascript code
; const foo = 1 + 2 // this is foo
(program ; [0, 0] - [1, 0]
  (lexical_declaration ; [0, 0] - [0, 18]
    kind: "const" ; [0, 0] - [0, 5]
    (variable_declarator ; [0, 6] - [0, 17]
      name: (identifier) ; [0, 6] - [0, 9]
      "=" ; [0, 10] - [0, 11]
      value: (binary_expression ; [0, 12] - [0, 17]
        left: (number) ; [0, 12] - [0, 13]
        operator: "+" ; [0, 14] - [0, 15]
        right: (number))) ; [0, 16] - [0, 17]
    ";") ; [0, 17] - [0, 18]
  (comment)) ; [0, 19] - [0, 33]
```



## Writing Rules

1. **The top level rule**: the most generic wrapper rule to cover all possible content to be parsed.
    - **top level rule MUST be the first rule property declared in `rules` field.**
    - the name of top level rule can be arbitrary, usually depend on language specification.
        - `C#` for example uses the `compilation_unit` as the name of top level rule.
```js
module.exports = grammar({
  name: 'c_sharp',
  rules: {
    /*...*/
    compilation_unit: $ => seq( // must be the first rule // [!code highlight]
      optional($.shebang_directive),
      repeat($._top_level_item),
    ),
    _top_level_item: $ => prec(2, choice(
      $._top_level_item_no_statement,
      $.global_statement,
    )),
    /*...*/
  }
});
```

### Named & Unnamed Nodes

A node generated by a rule that was assigned to a property of `rules` is called a *named node*.
A node generated by a rule that was written in literal string/regex is *unnamed nodes*.

```js
module.exports = grammar({
  name: 'foo',
  rules: {
    if_statement: $ => seq("if", "(", $._expression, ")", $._statement);
  },
});
```

> [!NOTE]
> Unnamed nodes are not visible from treesitter CST by default, but they does exist in the structure and can be inspected.
> They just don't have a node type.

### Aliased Rule


### Tokenized Rule

`token(rule)` made a complex rule as a **atomic** node, tree-sitter would only match but does not generate the concrete sub-tree for this node.
The following rule would made comment as `(comment)` in concrete tree, it does not include the unnamed nodes match that pattern.

```js
module.exports = grammar({
  name: 'foo',
  rules: {
    /* ... */
    comment: _ => token(choice(
      seq('//', /[^\n\r]*/),
      seq(
        '/*',
        /[^*]*\*+([^/*][^*]*\*+)*/,
        '/',
      ),
    )),
  },
});
```

### Node Description

A field of node is a **descriptive name** for semantic of that node in certain context.

The following rule defines descriptive name for each node of that function node.

```js
module.exports = grammar({
  name: 'foo',
  rules: {
    /* ... */
    function_definition: $ =>
      seq(
        "func",
        field("name", $.identifier),
        field("parameters", $.parameter_list),
        field("return_type", $._type),
        field("body", $.block),
      )
  },
});
```

