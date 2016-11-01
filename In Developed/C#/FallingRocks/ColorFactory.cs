namespace FallingRocks
{
    using System;

    public class ColorFactory
    {
        public static ConsoleColor GetColor(char rockType)
        {
            switch (rockType)
            {
                case '@':
                    return ConsoleColor.DarkGreen;
                case '#':
                    return ConsoleColor.Magenta;
                case '$':
                    return ConsoleColor.White;
                case '%':
                    return ConsoleColor.Red;
                case '^':
                    return ConsoleColor.Green;
                case '&':
                    return ConsoleColor.DarkCyan;
                case '*':
                    return ConsoleColor.Yellow;
                default:
                    throw new ArgumentException("Unknown type.");
            }
        }
    }
}