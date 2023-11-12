using Autofac;
using Xunit;
namespace CsharpDesignPatternsDemo.Structural.Adapter;

interface ICommand
{
    void Execute();
}
class CommandOpen : ICommand
{
    public void Execute() => Console.WriteLine("Opening...");
}

class CommandClose : ICommand
{
    public void Execute() => Console.WriteLine("Closing...");
}

class Button
{
    private ICommand _command;

    public Button(ICommand command) => _command = command;
    public void Click() => _command.Execute();
}

class Editor
{
    private IEnumerable<Button> _buttons;

    public Editor(params Button[] buttons) => _buttons = buttons;
}


public class Test
{
    [Fact]
    public void DependencyInjectionTest()
    {
        var builder = new ContainerBuilder();
        builder.RegisterType<CommandOpen>().As<ICommand>();
        builder.RegisterType<CommandClose>().As<ICommand>();
        // builder.RegisterType<Button>();
        builder.RegisterAdapter<ICommand, Button>(cmd => new Button(cmd));
        builder.RegisterType<Editor>();
        using var container = builder.Build();
        var editor = container.Resolve<Editor>();
        Assert.True(container.Resolve<ICommand>() is CommandClose);
    }
}