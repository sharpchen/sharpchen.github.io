using System.ComponentModel.DataAnnotations;
using Xunit;
namespace CsharpDesignPatternsDemo.Structural.Decorator;
interface ICreature
{
    int Age { get; set; }
}
interface ICanFly : ICreature
{
    void Fly()
    {
        if (Age > 1)
            Console.WriteLine("I'm flying...");
    }
}

interface ICanWalk : ICreature
{
    void Walk()
    {
        if (Age < 1)
            Console.WriteLine("I'm walking...");
    }
}


class Animal : ICanFly, ICanWalk
{
    public int Age { get; set; }
}


public class MultipleInheritanceTest
{
    [Fact]
    public void Test()
    {
        Animal animal = new() { Age = 1 };
        ((ICanFly)animal).Fly();
        if (animal is ICanWalk a) a.Walk();

    }
}

static class CreatureExtension
{
    public static void Fly(this ICanFly canFly) => canFly.Fly();
}