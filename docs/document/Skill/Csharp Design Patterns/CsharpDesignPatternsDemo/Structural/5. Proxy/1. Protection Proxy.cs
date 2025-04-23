using Xunit;
namespace CSharpDesignPatternsDemo.Structural;

interface ICar
{
    void StartEngine();
}
class Car : ICar
{
    public void StartEngine() => Console.WriteLine("Car is being driven...");
}
record class Person(int Age);
class CarProxy(Car car, Person driver) : ICar
{
    public void StartEngine()
    {
        if (driver.Age > 16)
        {
            car.StartEngine();
        }
        else
        {
            Console.WriteLine("Too young to drive");
        }
    }
}
public class Test
{
    [Fact]
    public void TestName()
    {
        CarProxy c = new(new Car(), new Person(12));
        c.StartEngine();
    }
}