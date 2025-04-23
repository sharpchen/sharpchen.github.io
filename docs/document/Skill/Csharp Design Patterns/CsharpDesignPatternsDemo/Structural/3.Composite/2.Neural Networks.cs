using System.Collections;
using System.Collections.ObjectModel;
using Xunit;
namespace CSharpDesignPatternsDemo.Structural;

class Neuron : IEnumerable<Neuron>
{
    public required Half Value { get; set; }
    internal List<Neuron> In { get; } = new();
    internal List<Neuron> Out { get; } = new();


    public IEnumerator<Neuron> GetEnumerator()
    {
        yield return this;
    }
    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}

class NeuralLayer : Collection<Neuron> { }

class NeuralNetwork : Collection<Neuron> { }
static class NeuronExtension
{
    public static void ConnectTo(this IEnumerable<Neuron> from, IEnumerable<Neuron> to)
    {
        foreach (var f in from)
            foreach (var t in to)
            {
                f.Out.Add(t);
                t.In.Add(f);
            }
    }
}

public class NeuronTest
{
    [Fact]
    public void Test()
    {
        Neuron neuron1 = new() { Value = (Half)1 };
        Neuron neuron2 = new() { Value = (Half)2 };
        NeuralLayer layer1 = new();
        NeuralNetwork net = new();
        neuron1.ConnectTo(neuron2);
        neuron2.ConnectTo(layer1);
        layer1.ConnectTo(net);
    }
}