namespace FallingRocks
{
    using System;

    public class Rock
    {
        private int xPosition;
        private int yPosition;
        private char rockType;

        public Rock(int xPosition, int yPosition, char rockType)
        {
            this.xPosition = xPosition;
            this.yPosition = yPosition;
            this.rockType = rockType;
            this.Color = ColorFactory.GetColor(rockType);
        }

        public int GetX => this.xPosition;

        public int GetY => this.yPosition;

        public char RockType => this.rockType;

        public ConsoleColor Color { get; }

        public void Fall()
        {
            this.yPosition++;
        }
    }
}