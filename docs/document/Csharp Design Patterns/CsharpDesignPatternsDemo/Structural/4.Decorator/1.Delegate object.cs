using System.Text;

namespace CSharpDesignPatternsDemo.Structural;

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
