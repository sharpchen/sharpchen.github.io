# Interpreter

A component to turning structural text into lexical tokens(lexing) and then interpreting sequences as tokens(parsing)

## Motivation

- Convert textual content into certain structure, an executable or an object in memory.

Examples using Interpreter pattern:

- Expression parsing: `1 + 2 / 3`
- Regular expression parsing
- Structural marker language parsing
- Syntax tree parsing

## Numeric Expression

### Lexing

Lexing means extracting textual content into different parts by certain rules.
Lexing results are called **tokens**.

```cs
using System.Text;

var tokens = Lex("1 + 3 - 2 = 2");
Console.WriteLine(string.Join(' ', tokens));

static List<Token> Lex(ReadOnlySpan<char> expr)
{
    List<Token> ret = [];
    for (var i = 0; i < expr.Length; i++)
    {
        switch (expr[i])
        {
            case '+':
                ret.Add(new Token { Content = expr[i].ToString(), TokenType = Token.Type.Plus });
                break;
            case '-':
                ret.Add(new Token { Content = expr[i].ToString(), TokenType = Token.Type.Minus });
                break;
            case '(':
                ret.Add(new Token { Content = expr[i].ToString(), TokenType = Token.Type.LeftParentsis });
                break;
            case ')':
                ret.Add(new Token { Content = expr[i].ToString(), TokenType = Token.Type.RightParentsis });
                break;
            case '=':
                ret.Add(new Token { Content = expr[i].ToString(), TokenType = Token.Type.Equal });
                break;
            case var c when char.IsDigit(c):
                //  directly add as the last digit char
                if (i == expr.Length - 1)
                {
                    ret.Add(new Token { Content = c.ToString(), TokenType = Token.Type.Int });
                    break;
                }
                var sb = new StringBuilder(c.ToString());
                for (int j = i + 1; j < expr.Length; j++)
                {
                    if (char.IsDigit(expr[j]))
                    {
                        sb.Append(expr[j]);
                        i++;
                    }
                    else
                    {
                        ret.Add(new Token { Content = sb.ToString(), TokenType = Token.Type.Int });
                        break;
                    }
                }
                break;
            default: // ignore spaces
                break;
        }
    }

    return ret;
}

class Token
{
    public enum Type
    {
        Int, LeftParentsis, RightParentsis, Plus, Minus, Equal
    }

    public string? Content { get; set; }
    public Type TokenType { get; set; }

    public override string ToString() => $"'{Content}'";
}
```

### Parsing

Now we're going to parse these tokens into real values since they're numeric.

Here we should use a composition pattern to let all items in the expression having the same form.
A getter is here to represents the evaluation of an expression element.

```cs
interface INumericExpressionElement<TValue> where TValue : INumber<TValue>
{
    TValue Value { get; } // represents a value evaluation // [!code highlight] 
}
```

There can be two kinds of element expression:

- numeric literal like `123`
- sub expressions like `(1 + 2)` in `(1 + 2) - (1 + 3)`

A numeric literal can be wrapped as any type implements `INumber<T>`
```cs
class Number<TValue> : INumericExpressionElement<TValue> where TValue : INumber<TValue>
{
    public required TValue Value { get; init; }
}
```

Sub-Expression can have many kinds, like binary operation, unary operation and more...
**In this example we only handles the binary operation.**

```cs
enum BinaryOperationType { Addition, Substraction }
class BinaryOperation<TValue>(
        INumericExpressionElement<TValue> left,
        INumericExpressionElement<TValue> right,
        BinaryOperationType type)
    : INumericExpressionElement<TValue> where TValue : INumber<TValue>
{

    public BinaryOperation() : this(default!, default!, default) { }

    public TValue Value
    {
        get => Type switch // [!code highlight] 
        { // [!code highlight] 
            BinaryOperationType.Addition => Left.Value + Right.Value, // [!code highlight] 
            BinaryOperationType.Substraction => Left.Value - Right.Value, // [!code highlight] 
            _ => TValue.Zero // [!code highlight] 
        }; // [!code highlight] 
    }
    public INumericExpressionElement<TValue> Left { get; set; } = left;
    public INumericExpressionElement<TValue> Right { get; set; } = right;
    public BinaryOperationType Type { get; set; } = type;
}
```

And then we do the parsing, the implementation is quite similar to lexing.

```cs
static INumericExpressionElement<TValue> Parse<TValue>(ReadOnlySpan<Token> tokens) where TValue : INumber<TValue>
{
    var operation = new BinaryOperation<TValue>();
    bool lhs = false;
    for (int i = 0; i < tokens.Length; i++)
    {
        Token? token = tokens[i];
        switch (token.TokenType)
        {
            case Token.Type.Number:
                var number = new Number<TValue> { Value = TValue.Parse(token.Content.AsSpan(), NumberStyles.Number, null) };
                if (!lhs)
                {
                    operation.Left = number;
                    lhs = true;
                }
                else
                    operation.Right = number;
                break;
            case Token.Type.Plus:
                operation.Type = BinaryOperationType.Addition;
                break;
            case Token.Type.Minus:
                operation.Type = BinaryOperationType.Substraction;
                break;
            case Token.Type.LeftParentsis:
                int left = i;
                int right = i;

                // find the nearest right parentsis index.
                for (; left < tokens.Length; right++)
                    if (tokens[right].TokenType is Token.Type.RightParentsis) break;
                // clamp the sub expression
                var subExpr = tokens[(left + 1)..right]; // [!code highlight] 
                // parse subExpr recursively
                var element = Parse<TValue>(subExpr); // [!code highlight] 
                if (!lhs)
                {
                    operation.Left = element;
                    lhs = true;
                }
                else
                    operation.Right = element;
                i = right; // remember to skip the whole range for next iteration. // [!code highlight] 
                break;
            default:
                throw new InvalidOperationException();
        }
    }
    return operation;
}
```
