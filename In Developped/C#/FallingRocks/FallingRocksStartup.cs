namespace FallingRocks
{
    using System;
    using System.Collections.Generic;
    using System.Threading;

    public class FallingRocksStartup
    {
        private const string Player = "<O>";
        private static readonly char[] rockTypes = { '@', '#', '$', '%', '^', '&', '*' };
        private static List<Rock> rocks;
        private static int playerLeftPosition;
        private static int screenWidth;
        private static int screenHeight;
        private static int middleWidth;
        private static int middleHeight;
        private static int gameFieldWidth;
        private static int score = 0;
        private static int lives = 10;
        private static int dropChanceByPercentage = 25;
        private static int sleepTimeSpan = 70;
        private static bool isLastRockIsOnLeft = false;
        private static bool isRunning;
        private static Random randomGenerator = new Random();

        public static void Main()
        {
            Initialize();
            StartNewGame();
        }

        private static void StartNewGame()
        {
            isRunning = true;
            while (isRunning)
            {
                LevelupByScore();
                GenerateRocks();
                if (Console.KeyAvailable)
                {
                    ConsoleKeyInfo key = Console.ReadKey();
                    switch (key.Key)
                    {
                        case ConsoleKey.LeftArrow:
                            MoveLeft();
                            break;
                        case ConsoleKey.RightArrow:
                            MoveRight();
                            break;
                        case ConsoleKey.Q:
                        case ConsoleKey.Escape:
                            isRunning = false;
                            EndOfGame();
                            break;
                    }
                }

                Console.Clear();
                DrawRocks();
                DrawPlayer();
                DrawGameField();
                DrawScore();
                Thread.Sleep(sleepTimeSpan);
            }
        }

        private static void Initialize()
        {
            Console.Title = "Falling Rocks";
            Console.CursorVisible = false;
            screenWidth = Console.WindowWidth;
            screenHeight = Console.WindowHeight;
            middleWidth = screenWidth / 2;
            middleHeight = screenHeight / 2;
            gameFieldWidth = screenWidth - 15;
            Console.BufferHeight = screenHeight;
            Console.BufferWidth = screenWidth;
            playerLeftPosition = gameFieldWidth / 2;
            rocks = new List<Rock>();
        }

        private static void LevelupByScore()
        {
            if (score == 100)
            {
                dropChanceByPercentage = 40;
                sleepTimeSpan -= 5;
            }
            else if (score == 200)
            {
                dropChanceByPercentage = 60;
                sleepTimeSpan -= 5;
            }
            else if (score == 500)
            {
                lives++;
                dropChanceByPercentage = 80;
                sleepTimeSpan -= 5;
            }
            else if (score == 700)
            {
                dropChanceByPercentage = 95;
                sleepTimeSpan -= 5;
            }
            else if (score == 900)
            {
                dropChanceByPercentage = 100;
                sleepTimeSpan -= 10;
            }
            else if (score == 1000)
            {
                lives++;
                sleepTimeSpan -= 20;
            }
        }

        private static void EndOfGame()
        {
            Console.Clear();
            string lineOne = "Game over";
            string lineTwo = string.Format("Your score is: {0}", score);
            string lineThree = "Do you want to play again? (y/n)";
            SetCursorAtPosition(
                (middleWidth - lineOne.Length) + (lineOne.Length / 2),
                middleHeight - 3);
            Console.Write(lineOne);
            SetCursorAtPosition(
                (middleWidth - lineTwo.Length) + (lineTwo.Length / 2),
                middleHeight - 2);
            Console.Write(lineTwo);
            SetCursorAtPosition(
                (middleWidth - lineThree.Length) + (lineThree.Length / 2),
                middleHeight - 1);
            Console.Write(lineThree);
            var key = Console.ReadKey();
            int positionOfLastX = Console.CursorLeft - 1;
            while (key.Key != ConsoleKey.Y || key.Key != ConsoleKey.N)
            {
                switch (key.Key)
                {
                    case ConsoleKey.Y:
                        score = 0;
                        lives = 10;
                        dropChanceByPercentage = 25;
                        sleepTimeSpan = 70;
                        isLastRockIsOnLeft = false;
                        rocks = new List<Rock>();
                        StartNewGame();
                        break;
                    case ConsoleKey.N:
                        Environment.Exit(1);
                        break;
                    default:
                        SetCursorAtPosition(positionOfLastX, middleHeight - 1);
                        Console.Write(' ');
                        SetCursorAtPosition(positionOfLastX, middleHeight - 1);
                        break;
                }

                key = Console.ReadKey();
            }

        }

        private static void DrawScore()
        {
            SetCursorAtPosition(gameFieldWidth + 2, 0);
            Console.Write("Score:");
            SetCursorAtPosition(gameFieldWidth + 2, 1);
            Console.Write(score);
            SetCursorAtPosition(gameFieldWidth + 2, 2);
            Console.Write("Lives:");
            SetCursorAtPosition(gameFieldWidth + 2, 3);
            Console.Write(lives);
        }

        private static void DrawGameField()
        {
            SetCursorAtPosition(0, 0);
            Console.Write(new string('=', gameFieldWidth));
            SetCursorAtPosition(0, screenHeight - 1);
            Console.Write(new string('_', gameFieldWidth));
            for (int i = 0; i < screenHeight; i++)
            {
                SetCursorAtPosition(0, i);
                Console.Write('|');
                SetCursorAtPosition(gameFieldWidth, i);
                Console.Write('|');
            }
        }

        private static void GenerateRocks()
        {
            int level = randomGenerator.Next(1, 101);
            if (level <= dropChanceByPercentage)
            {
                int rockIndex = randomGenerator.Next(0, rockTypes.Length);
                int xPosition;
                Rock rock;
                if (!isLastRockIsOnLeft)
                {
                    xPosition = randomGenerator.Next(1, gameFieldWidth / 2);
                    rock = new Rock(xPosition, 1, rockTypes[rockIndex]);
                    rocks.Add(rock);
                    isLastRockIsOnLeft = true;
                }
                else
                {
                    xPosition = randomGenerator.Next(gameFieldWidth / 2, gameFieldWidth);
                    rock = new Rock(xPosition, 1, rockTypes[rockIndex]);
                    rocks.Add(rock);
                    isLastRockIsOnLeft = false;
                }
            }
        }

        private static void DrawRocks()
        {
            for (int i = 0; i < rocks.Count; i++)
            {
                if (rocks[i] != null)
                {
                    DrawRock(rocks[i]);
                    rocks[i].Fall();
                    if (rocks[i].GetY == screenHeight - 2)
                    {
                        if (playerLeftPosition - 2 < rocks[i].GetX &&
                        playerLeftPosition + 2 > rocks[i].GetX)
                        {
                            lives--;
                        }
                        else
                        {
                            score++;
                        }

                        if (lives == 0)
                        {
                            EndOfGame();
                        }

                        rocks.RemoveAt(i);
                    }
                }
            }
        }

        private static void DrawRock(Rock rock)
        {
            ConsoleColor currentColor = Console.ForegroundColor;
            SetCursorAtPosition(rock.GetX, rock.GetY);
            Console.ForegroundColor = rock.Color;
            Console.Write(rock.RockType);
            Console.ForegroundColor = currentColor;
        }

        private static void MoveRight()
        {
            if (playerLeftPosition + 2 < gameFieldWidth)
            {
                playerLeftPosition++;
            }
        }

        private static void MoveLeft()
        {
            if (playerLeftPosition > 2)
            {
                playerLeftPosition--;
            }
        }

        private static void SetCursorAtPosition(int x, int y)
        {
            Console.SetCursorPosition(x, y);
        }

        private static void DrawPlayer()
        {
            ConsoleColor currentColor = Console.ForegroundColor;
            SetCursorAtPosition(playerLeftPosition - 1, screenHeight - 2);
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.Write(Player);
            Console.ForegroundColor = currentColor;
        }
    }
}