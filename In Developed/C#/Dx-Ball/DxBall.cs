namespace Dx_Ball
{
    using System;
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;

    public class DxBall
    {
        private static readonly List<Entity?> Blocks = new List<Entity?>();
        private static readonly ConcurrentQueue<int> ScrollTrails = new ConcurrentQueue<int>();
        private static readonly ConcurrentQueue<int[]> PositionTrails = new ConcurrentQueue<int[]>();
        private static readonly Random RandomGenerator = new Random();
        private static ConcurrentDictionary<int, Entity> scroll;
        private static IEnumerable<Entity> rightPartScroll;
        private static IEnumerable<Entity> leftPartScroll;
        private static bool isRunningGame = true;
        private static bool hasBallTopDirection = true;
        private static bool hasBallLeftDirection = true;
        private static bool hasLastActionMove;
        private static Action lastMoveAtEndPointOfScroll;
        private static Entity ball;
        private static int width;
        private static int height;
        private static int playScreenWidth;

        public static void Main()
        {
            Console.Title = "DX-Ball";
            Console.CursorVisible = false;
            width = Console.WindowWidth;
            height = Console.WindowHeight;
            playScreenWidth = width - 18;
            int middleWidth = playScreenWidth / 2;
            int middleHeight = height / 2;
            IntializeBlocks();
            IntilizeScroll(middleWidth, height, '=', ConsoleColor.White);
            leftPartScroll = scroll
                .Take(scroll.Count / 2)
                .Select(e => e.Value);
            rightPartScroll = scroll
                .Skip(scroll.Count / 2)
                .Take(scroll.Count - scroll.Count / 2 - 1)
                .Select(e => e.Value);
            Console.BufferWidth = width;
            Console.BufferHeight = height;
            InitializeBall(middleWidth, middleHeight);
            Task.Run(() =>
            {
                while (true)
                {
                    if (Console.KeyAvailable)
                    {
                        ConsoleKeyInfo pressedkey = Console.ReadKey();
                        switch (pressedkey.Key)
                        {
                            case ConsoleKey.LeftArrow:
                                MoveScrollToLeft();
                                break;
                            case ConsoleKey.RightArrow:
                                MoveScrollToRight();
                                break;
                            case ConsoleKey.Q:
                                isRunningGame = false;
                                break;
                            default:
                                PositionTrails.Enqueue(
                                    new[] { height - 1, scroll[scroll.Count - 1].X + 1 });
                                PositionTrails.Enqueue(
                                     new[] { height - 1, scroll[scroll.Count - 1].X + 2 });
                                PositionTrails.Enqueue(
                                    new[] { height - 1, scroll[scroll.Count - 1].X + 3 });
                                break;
                        }
                    }
                }
            });

            StartGame();
        }

        private static void StartGame()
        {
            DrawGameField();
            DrawBlocks();
            while (isRunningGame)
            {
                MoveBall();
                BlockCollisionDetection();
                ClearTrails();
                DrawBall();
                DrawScroll();
                Thread.Sleep(100);
            }
        }

        private static void DrawBlocks()
        {
            foreach (Entity? block in Blocks)
            {
                DrawAtPosition(
                    block.GetValueOrDefault().X,
                    block.GetValueOrDefault().Y,
                    '#',
                    block.GetValueOrDefault().Color);
            }
        }

        private static void IntializeBlocks()
        {
            for (int row = 3; row < 6; row++)
            {
                for (int col = 2; col < playScreenWidth - 5; col++)
                {
                    Blocks.Add(new Entity(col + 2, row + 1, '#', ConsoleColor.Green));
                }
            }
        }

        private static void ClearTrails()
        {
            while (ScrollTrails.Count > 0 || PositionTrails.Count > 0)
            {
                int trail;
                if (ScrollTrails.TryDequeue(out trail))
                {
                    DrawAtPosition(trail, height - 1, '\0');
                }

                int[] posTrail;
                if (PositionTrails.TryDequeue(out posTrail))
                {
                    DrawAtPosition(posTrail[1], posTrail[0], '\0');
                }
            }
        }

        private static void InitializeBall(int middleWidth, int middleHeight)
        {
            ball = new Entity(middleWidth, middleHeight, '*');
        }

        private static void MoveScrollToLeft()
        {
            if (scroll[0].X > 2)
            {
                ScrollTrails.Enqueue(scroll[scroll.Count - 1].X);
                ScrollTrails.Enqueue(scroll[scroll.Count - 1].X + 1);
                for (int i = 0; i < scroll.Count; i++)
                {
                    scroll[i] = scroll[i].GetMovedEntity(scroll[i].X - 2, scroll[i].Y);
                }
            }
            else if (scroll[0].X > 1)
            {
                ScrollTrails.Enqueue(scroll[scroll.Count - 1].X);
                for (int i = 0; i < scroll.Count; i++)
                {
                    scroll[i] = scroll[i].GetMovedEntity(scroll[i].X - 1, scroll[i].Y);
                }
            }
        }

        private static void MoveScrollToRight()
        {
            if (scroll[scroll.Count - 1].X < playScreenWidth - 3)
            {
                ScrollTrails.Enqueue(scroll[0].X);
                ScrollTrails.Enqueue(scroll[0].X - 1);
                for (int i = 0; i < scroll.Count; i++)
                {
                    scroll[i] = scroll[i].GetMovedEntity(scroll[i].X + 2, scroll[i].Y);
                }
            }
            else if (scroll[scroll.Count - 1].X < playScreenWidth - 2)
            {
                ScrollTrails.Enqueue(scroll[0].X);
                for (int i = 0; i < scroll.Count; i++)
                {
                    scroll[i] = scroll[i].GetMovedEntity(scroll[i].X + 1, scroll[i].Y);
                }
            }
        }

        private static void DrawScroll()
        {
            foreach (var scrollPiece in scroll)
            {
                DrawAtPosition(
                    scrollPiece.Value.X,
                    scrollPiece.Value.Y,
                    scrollPiece.Value.SymbolEntity,
                    scrollPiece.Value.Color);
            }
        }

        private static void IntilizeScroll(
            int middleWidth,
            int windowHeight,
            char symbol,
            ConsoleColor consoleColor)
        {
            scroll = new ConcurrentDictionary<int, Entity>();
            scroll.TryAdd(0, new Entity(middleWidth - 2, windowHeight - 1, symbol, consoleColor));
            scroll.TryAdd(1, new Entity(middleWidth - 1, windowHeight - 1, symbol, consoleColor));
            scroll.TryAdd(2, new Entity(middleWidth, windowHeight - 1, symbol, consoleColor));
            scroll.TryAdd(3, new Entity(middleWidth + 1, windowHeight - 1, symbol, consoleColor));
            scroll.TryAdd(4, new Entity(middleWidth + 2, windowHeight - 1, symbol, consoleColor));
        }

        private static void DrawBall()
        {
            DrawAtPosition(ball.X, ball.Y, ball.SymbolEntity, ConsoleColor.Yellow);
        }

        private static void MoveBall()
        {
            PositionTrails.Enqueue(new[] { ball.Y, ball.X });
            ball.MoveTopDirectionOnPosition(
                hasBallTopDirection ? ball.Y - 1 : ball.Y + 1);
            ball.MoveLeftDirectionOnPosition(
                hasBallLeftDirection ? ball.X - 1 : ball.X + 1);
            if (hasLastActionMove)
            {
                hasLastActionMove = false;
                lastMoveAtEndPointOfScroll();
            }

            if (ball.X == 1)
            {
                hasBallLeftDirection = false;
            }
            else if (ball.X == playScreenWidth - 1)
            {
                hasBallLeftDirection = true;
            }

            if (ball.Y == 0)
            {
                hasBallTopDirection = false;
            }
            else if (ball.Y == height - 2)
            {
                if (scroll.Any(s => s.Value.X == ball.X))
                {
                    hasBallTopDirection = true;
                    if (leftPartScroll.Any(p => p.X == ball.X) &&
                        ball.X > 1)
                    {
                        hasBallLeftDirection = true;
                        if (ball.X > 2 &&
                            leftPartScroll.First().X == ball.X - 1)
                        {
                            lastMoveAtEndPointOfScroll = null;
                            lastMoveAtEndPointOfScroll += MoveOnceBallToLeft;
                            hasLastActionMove = true;
                        }
                    }
                    else if (rightPartScroll.Any(p => p.X == ball.X) &&
                        ball.X < playScreenWidth - 1)
                    {
                        hasBallLeftDirection = false;
                        if (ball.X < playScreenWidth - 2 &&
                            rightPartScroll.Last().X == ball.X + 1)
                        {
                            lastMoveAtEndPointOfScroll = null;
                            lastMoveAtEndPointOfScroll += MoveOnceBallToRight;
                            hasLastActionMove = true;
                        }
                    }
                }
            }
            else if (ball.Y == height - 1)
            {
                InitializeBall(
                    RandomGenerator
                        .Next(
                            playScreenWidth - (playScreenWidth - 25),
                            playScreenWidth - 24),
                    height - 5);
                hasBallTopDirection = true;
            }
        }

        private static void BlockCollisionDetection()
        {
            int indexOf =
                Blocks.FindIndex(
                    b =>
                    b.GetValueOrDefault().Y == ball.Y &&
                    b.GetValueOrDefault().X == ball.X);
            if (indexOf != -1)
            {
                hasBallTopDirection = !hasBallTopDirection;
                PositionTrails
                    .Enqueue(
                        new[]
                        {
                            Blocks[indexOf].GetValueOrDefault().Y,
                            Blocks[indexOf].GetValueOrDefault().X
                        });
                Blocks[indexOf] = null;
            }
        }

        private static void DrawAtPosition(
            int x,
            int y,
            char symbol,
            ConsoleColor consoleColor = ConsoleColor.Gray)
        {
            SetCursorAtPosition(x, y);
            Console.ForegroundColor = consoleColor;
            Console.Write(symbol);
        }

        private static void SetCursorAtPosition(int x, int y)
        {
            Console.SetCursorPosition(x, y);
        }

        private static void DrawGameField()
        {
            for (int i = 0; i < height - 1; i++)
            {
                DrawAtPosition(0, i, '|');
                DrawAtPosition(playScreenWidth, i, '|');
            }
        }

        private static void MoveOnceBallToLeft()
        {
            ball.MoveLeftDirectionOnPosition(ball.X - 1);
            PositionTrails.Enqueue(new[] { ball.Y, ball.X - 1 });
        }

        private static void MoveOnceBallToRight()
        {
            ball.MoveLeftDirectionOnPosition(ball.X + 1);
            PositionTrails.Enqueue(new[] { ball.Y, ball.X + 1 });
        }
    }
}