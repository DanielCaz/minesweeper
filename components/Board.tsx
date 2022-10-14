import { useCallback, useState } from "react";
import { TileValue } from "../TileValue";
import Tile from "./Tile";

const Board = () => {
  const [board, setBoard] = useState<number[][]>([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const [mines, setMines] = useState<number[][]>([]);
  const [mineCount, setMineCount] = useState<number>(30);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [generatedMines, setGeneratedMines] = useState<boolean>(false);
  const [flagMode, setFlagMode] = useState<boolean>(false);

  const generateMine = (exception?: number[]): number[] => {
    let x = Math.floor(Math.random() * board.length);
    let y = Math.floor(Math.random() * board.length);
    while (
      (exception?.includes(x) && exception?.includes(y)) ||
      mines.includes([x, y])
    ) {
      x = Math.floor(Math.random() * board.length);
      y = Math.floor(Math.random() * board.length);
    }

    return [x, y];
  };

  const generateMines = (exception?: number[]) => {
    const mines: number[][] = [];
    for (let index = 0; index < mineCount; index++) {
      mines.push(generateMine(exception));
    }
    return mines;
  };

  const resetGame = () => {
    setBoard([
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]);
    setMines(generateMines());
    setGeneratedMines(true);
    setGameOver(false);
  };

  const onTileClick = (x: number, y: number) => {
    if (
      gameOver ||
      (board[x][y] !== TileValue.Unopened && board[x][y] !== TileValue.Flagged)
    ) {
      return;
    }

    if (!generatedMines) {
      setMines(generateMines([x, y]));
      setGeneratedMines(true);
    }

    if (!flagMode) {
      if (mines.some((mine) => mine[0] === x && mine[1] === y)) {
        setBoard((prev) => {
          const newBoard = [...prev];
          [...mines, [x, y]].forEach((mine) => {
            newBoard[mine[0]][mine[1]] = TileValue.Mine;
          });
          return newBoard;
        });

        setGameOver(true);
        return;
      }

      let count = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (
            mines.some((mine) => mine[0] === x + i && mine[1] === y + j) &&
            x + i >= 0 &&
            x + i < board.length &&
            y + j >= 0 &&
            y + j < board.length
          ) {
            count++;
          }
        }
      }

      if (count === 0) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (
              x + i >= 0 &&
              x + i < board.length &&
              y + j >= 0 &&
              y + j < board.length
            ) {
              setTimeout(() => {
                onTileClick(x + i, y + j);
              }, 100);
            }
          }
        }
      }

      setBoard((prev) => {
        const newBoard = [...prev];
        if (count === 0) {
          newBoard[x][y] = TileValue.Empty;
        } else {
          newBoard[x][y] = count;
        }
        return newBoard;
      });
    } else {
      setBoard((prev) => {
        const newBoard = [...prev];
        if (newBoard[x][y] === TileValue.Unopened) {
          newBoard[x][y] = TileValue.Flagged;
        }
        return newBoard;
      });
    }
  };

  return (
    <div className="container pt-3">
      <div className="table-responsive">
        <table className="table table-bordered caption-top">
          <caption className="text-center">
            <h1>Minesweeper</h1>
            <button
              className="btn btn-primary me-4"
              onClick={() => setFlagMode(!flagMode)}
            >
              {flagMode ? "Flag Mode" : "Normal Mode"}
            </button>
            <button className="btn btn-info" onClick={resetGame}>
              Reset
            </button>
            <hr />
            {gameOver && (
              <div className="alert alert-danger" role="alert">
                Game Over
              </div>
            )}
          </caption>
          <tbody>
            {board.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <Tile
                    key={cellIndex}
                    cell={cell}
                    onTileClick={() => onTileClick(rowIndex, cellIndex)}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Board;
