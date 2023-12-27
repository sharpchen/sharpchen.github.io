namespace CSharpDesignPatternsDemo.Creational.Singleton;
class Singleton
{
    private static readonly Lazy<Singleton> _instance = new(() => new());
    public static Singleton Instance => _instance.Value;
    private Singleton() { }

    // ...elided
}
