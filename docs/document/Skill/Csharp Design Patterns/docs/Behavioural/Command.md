# Command

An object to instruct a specific action with all required information.

## Motivation

Actions and assignments can't be serialized generally, a Command pattern solves by:

- provides a way to store information of actions.
- can undo base on the kept command information.
- can be serialized, logged.

It's heavily used by cli implementations and GUI development.

## ICommand

A simple command implementation is an `ICommand` interface + an object can be applied on by commands.

A Command should be a immutable object which we will represent it as a record.

```cs
var editor = new Editor(content: "hello");
// wrap command info inside a instance
var commandInsert = new EditorCommand(editor, EditorCommandType.Insert, ", world"); // [!code highlight] 
var commandDelete = new EditorCommand(editor, EditorCommandType.Delete, 7); // [!code highlight] 

commandInsert.Execute(); // [!code highlight] 
commandDelete.Execute(); // [!code highlight] 

public interface ICommand
{
    void Execute();
}

public record class EditorCommand(Editor Editor, EditorCommandType CommandType, params object[]? Args) : ICommand
{
    public void Execute()
    {
        switch (CommandType)
        {
            case EditorCommandType.Insert:
                Editor.Insert((string)(Args?[0] ?? string.Empty));
                break;
            case EditorCommandType.Delete:
                Editor.Delete((int)(Args?[0] ?? 0));
                break;
            default:
                break;
        }
    }

    public enum EditorCommandType
    {
        Insert, Delete
    }
}

public class Editor
{
    private string _content = string.Empty;

    public Editor(string content) => _content = content;

    public void Insert(string content)
    {
        _content += content;
        Console.WriteLine(_content);
    }
    public void Delete(int count)
    {
        _content = _content[..(_content.Length - count)];
        Console.WriteLine(_content);
    }
}
```

## Undo a Command

```cs
var editor = new Editor(content: "hello");
var commandInsert = new EditorCommand(editor, EditorCommandType.Insert, ", world");
var commandDelete = new EditorCommand(editor, EditorCommandType.Delete, 7);

commandInsert.Execute();
commandDelete.Execute();

commandDelete.Undo(); // [!code ++] 
commandInsert.Undo(); // [!code ++] 

public interface ICommand
{
    void Execute();
    void Undo(); // [!code ++] 
}

public enum EditorCommandType
{
    Insert, Delete
}

public record class EditorCommand(Editor Editor, EditorCommandType CommandType, params object[]? Args) : ICommand
{
    public int InsertLenght { get; init; } = Args?[0] is string s ? s.Length : 0; // [!code ++] 

    private bool succeed; // implying last execute succeed or not // [!code ++] 

    public void Execute()
    {
        switch (CommandType)
        {
            case EditorCommandType.Insert:
                Editor.Insert((string)(Args?[0] ?? string.Empty));
                succeed = true;
                break;
            case EditorCommandType.Delete:
                succeed = Editor.Delete((int)(Args?[0] ?? 0));
                break;
            default:
                break;
        }
    }

    public void Undo() // [!code ++] 
    { // [!code ++] 
        if (!succeed) return; // if previous execution failed, no need to undo // [!code ++] 
        switch (CommandType) // [!code ++] 
        { // [!code ++] 
            case EditorCommandType.Insert: // [!code ++] 
                Editor.Delete(InsertLenght); // [!code ++] 
                break; // [!code ++] 
            case EditorCommandType.Delete: // [!code ++] 
                Editor.Insert(Editor.Deleted); // [!code ++] 
                break; // [!code ++] 
            default: // [!code ++] 
                break; // [!code ++] 
        } // [!code ++] 
    } // [!code ++] 
}

public class Editor
{
    private string _content = string.Empty;

    public string Deleted { get; set; } = string.Empty; // [!code ++] 

    public Editor(string content) => _content = content;

    public void Insert(string content)
    {
        _content += content;
        Console.WriteLine(_content);
    }
    public bool Delete(int count) // [!code highlight] 
    {
        if (_content.Length >= count) // [!code ++] 
        { // [!code ++] 
            Deleted = _content[^count..]; // [!code ++] 
            _content = _content[..(_content.Length - count)]; // [!code ++] 
            Console.WriteLine(_content); // [!code ++] 
            return true; // [!code ++] 
        } // [!code ++] 
        return false; // [!code ++] 
    }
}
```

## Composite Command

A composite command is the combination of Command pattern and Composite pattern.

- Collection like to store commands with order.
- Execute as chaining, be aware to handle exceptions.
- Undo as chaining, be aware to handle exceptions.

> [!tip]
> Commands might also need context to perform actions one by one.

A base class can be like the following.

- A composite command should be `ICommand` too.
- A composite command should be a collection like command.
- Default `Execute` can revoke all executed when any command failed.

```cs
using System.Runtime.InteropServices;

public interface ICommand
{
    void Execute();
    void Undo();
    bool Success { get; set; }
}

public abstract class CompositeCommand<T> : List<T>, ICommand where T : class?, ICommand
{
    public bool Success
    {
        get => this.All(cmd => cmd.Success);
        set => field = value;
    }

    public virtual void Execute()
    {
        foreach (var cmd in this)
        {
            cmd.Execute();
            // if any cmd failed, revoke all executed // [!code highlight] 
            if (!cmd.Success) // [!code highlight] 
            { // [!code highlight] 
                var reverse = CollectionsMarshal.AsSpan(this)[..IndexOf(cmd)]; // [!code highlight] 
                reverse.Reverse(); // [!code highlight] 
                foreach (var c in reverse) // [!code highlight] 
                    c.Undo(); // [!code highlight] 
            // [!code highlight] 
                return; // [!code highlight] 
            } // [!code highlight] 
        }

        Success = true;
    }

    public virtual void Undo()
    {
        foreach (var cmd in Enumerable.Reverse(this))
            // only undo executed
            if (cmd.Success) cmd.Undo();
    }
}
```

Then we can try a deletion with count that exceeds the current content length, which should rollback the content to initial `hello`.

```cs
var editor = new Editor(content: "hello");

var commandInsert = new EditorCommand(editor, EditorCommandType.Insert, ", world");
var commandDelete = new EditorCommand(editor, EditorCommandType.Delete, 1);
// deletion exceeds the length. will revoke all executions. // [!code highlight] 
var wrongCommand = new EditorCommand(editor, EditorCommandType.Delete, 100); // [!code highlight] 

// should edit back to `hello` // [!code highlight] 
var combined = new EditorCompositeCommand() { commandInsert, commandDelete, wrongCommand }; // [!code highlight] 

combined.Execute();

// default implementations are just fine for this.
class EditorCompositeCommand : CompositeCommand<EditorCommand>;
```

> [!TIP]
> Macros in vim can be implemented using composite commands.
