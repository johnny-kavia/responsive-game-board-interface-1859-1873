import React, { useMemo, useState } from "react";

/**
 * Calculate winner and winning line indices for a 3x3 board.
 * @param {Array<"X"|"O"|null>} squares
 * @returns {{ winner: ("X"|"O"|null), line: number[] | null }}
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // cols
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diagonals
    [2, 4, 6]
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

/**
 * @param {Array<"X"|"O"|null>} squares
 * @returns {boolean}
 */
function isDraw(squares) {
  return squares.every((s) => s !== null);
}

/**
 * PUBLIC_INTERFACE
 */
export default function TicTacToe() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  // Score tracking persists across rounds.
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  const { winner, line: winningLine } = useMemo(
    () => calculateWinner(squares),
    [squares]
  );

  const draw = useMemo(() => !winner && isDraw(squares), [winner, squares]);

  const status = useMemo(() => {
    if (winner) return `Winner: ${winner}`;
    if (draw) return "It's a draw";
    return `Turn: ${xIsNext ? "X" : "O"}`;
  }, [winner, draw, xIsNext]);

  /**
   * Start a new round but keep the scoreboard.
   */
  function newRound() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  /**
   * Reset everything, including scores.
   */
  function resetAll() {
    setScores({ X: 0, O: 0, draws: 0 });
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  /**
   * Handle a user move on a square.
   * @param {number} idx
   */
  function handleMove(idx) {
    if (winner || draw) return;
    if (squares[idx] !== null) return;

    const next = squares.slice();
    next[idx] = xIsNext ? "X" : "O";
    setSquares(next);

    const outcome = calculateWinner(next);
    if (outcome.winner) {
      setScores((prev) => ({ ...prev, [outcome.winner]: prev[outcome.winner] + 1 }));
    } else if (isDraw(next)) {
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
    } else {
      setXIsNext((v) => !v);
    }
  }

  return (
    <div className="tttRoot">
      <div className="tttTop">
        <div className="tttStatus" role="status" aria-live="polite">
          <span className={`tttStatusPill ${winner ? "isWin" : draw ? "isDraw" : ""}`}>
            {status}
          </span>
        </div>

        <div className="tttScores" aria-label="Scoreboard">
          <div className="scoreCard">
            <div className="scoreLabel">X</div>
            <div className="scoreValue">{scores.X}</div>
          </div>
          <div className="scoreCard">
            <div className="scoreLabel">Draws</div>
            <div className="scoreValue">{scores.draws}</div>
          </div>
          <div className="scoreCard">
            <div className="scoreLabel">O</div>
            <div className="scoreValue">{scores.O}</div>
          </div>
        </div>
      </div>

      <div className="tttBoardWrap">
        <div className="tttBoard" role="grid" aria-label="Tic Tac Toe board">
          {squares.map((value, idx) => {
            const isWinning = winningLine ? winningLine.includes(idx) : false;
            const isDisabled = Boolean(winner || draw || value !== null);

            return (
              <button
                key={idx}
                type="button"
                className={`square ${isWinning ? "isWinning" : ""} ${
                  value ? "isFilled" : ""
                }`}
                onClick={() => handleMove(idx)}
                disabled={isDisabled}
                role="gridcell"
                aria-label={`Square ${idx + 1}${value ? `: ${value}` : ""}`}
              >
                <span className={`squareMark ${value === "X" ? "isX" : value === "O" ? "isO" : ""}`}>
                  {value ?? ""}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="tttControls" aria-label="Controls">
        <button type="button" className="btn btnPrimary" onClick={newRound}>
          New round
        </button>
        <button type="button" className="btn btnGhost" onClick={resetAll}>
          Reset scores
        </button>
      </div>
    </div>
  );
}
