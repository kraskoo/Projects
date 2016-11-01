namespace Dx_Ball
{
    using System;

    public struct Entity
    {
        public Entity(int x, int y, char symbolEntity, ConsoleColor consoleColor = ConsoleColor.Gray)
        {
            this.X = x;
            this.Y = y;
            this.SymbolEntity = symbolEntity;
            this.Color = consoleColor;
        }

        public int X { get; private set; }

        public int Y { get; private set; }

        public char SymbolEntity { get; }

        public ConsoleColor Color { get; }

        public Entity GetMovedEntity(int newX, int newY)
        {
            return new Entity(newX, newY, this.SymbolEntity, this.Color);
        }

        public void MoveLeftDirectionOnPosition(int x)
        {
            this.X = x;
        }

        public void MoveTopDirectionOnPosition(int y)
        {
            this.Y = y;
        }
    }
}