using Xunit;
using CSharpDesignPatternsDemo.Structural;
using CSharpDesignPatternsDemo.Creational;
using System.Numerics;
using System.Text.Json;
using BenchmarkDotNet.Attributes;
using BenchmarkDotNet.Running;
using BenchmarkDotNet.Configs;
using BenchmarkDotNet.Validators;
using BenchmarkDotNet.Loggers;
using BenchmarkDotNet.Columns;

// var enemyCollection = EnemyCollection.Create(10, () => (Random.Shared.Next(18, 36), Random.Shared.NextDouble()));
// Magic.Freeze(enemyCollection);
// enemyCollection[2].Agility = 250;
// Console.WriteLine(enemyCollection._agility![2]);
// var enemies = new EnemySpan(5, () => (1, 2));
// foreach (ref var e in enemies.Agility)
// {
//     e = 250;
// }
// foreach (var e in enemies._agility!)
// {
//     Console.WriteLine(e);
// }

var config = new ManualConfig()
        .WithOptions(ConfigOptions.DisableOptimizationsValidator)
        .AddValidator(JitOptimizationsValidator.DontFailOnError)
        .AddLogger(ConsoleLogger.Default)
        .AddColumnProvider(DefaultColumnProviders.Instance);

BenchmarkRunner.Run<AoS_SoA>(config);

[MemoryDiagnoser]
public class AoS_SoA
{
    private Enemy[]? _aos;
    private EnemyCollection? _soa;
    private EnemyCollection2 _soaS;

    private EnemySpan _soaSpan;
    [Params(10000)] public int _size;

    [GlobalSetup]
    public void SetUp()
    {
        _aos = Enumerable.Range(1, _size)
            .Select(x => new Enemy() { Age = Random.Shared.Next(18, 36), Agility = Random.Shared.NextDouble() })
            .ToArray();
        _soa = EnemyCollection.Create(_size, () => (Random.Shared.Next(18, 36), Random.Shared.NextDouble()));
        _soaS = EnemyCollection2.Create(_size, () => (Random.Shared.Next(18, 36), Random.Shared.NextDouble()));
        _soaSpan = new(_size, () => (Random.Shared.Next(18, 36), Random.Shared.NextDouble()));
    }
    [Benchmark]
    public void Freeze_AoS()
    {
        for (int i = 0; i < _aos!.Length; i++)
        {
            ref Enemy e = ref _aos![i];
            e.Agility = 0;
        }
    }
    [Benchmark]
    public void Freeze_SoA()
    {
        foreach (var e in _soa!)
        {
            e.Agility = 0;
        }
    }
    [Benchmark]
    public void Freeze_SoA_Enumerator()
    {
        var e = _soa!._agility!.GetEnumerator2();
        while (e.MoveNext())
        {
            e.Current = 0;
        }
    }
    [Benchmark]
    public void Freeze_SoA_Struct()
    {
        foreach (var e in _soaS)
        {
            e.Agility = 0;
        }
    }
    [Benchmark]
    public void Freeze_SoA_Span()
    {
        foreach (ref var e in _soaSpan.Agility)
        {
            e = 0;
        }
    }
}
