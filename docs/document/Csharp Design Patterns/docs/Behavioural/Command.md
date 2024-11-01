# Command

An object to instruct a specific action with all required information.

## Motivation

Actions and assignments can't be serialized generally, a Command pattern solves by:

- provides a way to store information of actions.
- can undo base on the kept command information.

It's heavily used by cli implementations and GUI development.

## ICommand

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
