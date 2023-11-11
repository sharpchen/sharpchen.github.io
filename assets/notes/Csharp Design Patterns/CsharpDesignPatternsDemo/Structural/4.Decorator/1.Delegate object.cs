using System.Text;
using System.Xml.Serialization;

namespace CsharpDesignPatternsDemo.Structural.Decorator;

class CustomStringBuilder
{
    readonly StringBuilder stringBuilder = new();
    // ...delegate some functionalities using stringBuilder
    public CustomStringBuilder AppendLine(string s)
    {
        stringBuilder.AppendLine(s);
        return this;
    }
}
