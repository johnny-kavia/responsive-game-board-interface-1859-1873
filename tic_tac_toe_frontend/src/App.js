import React from "react";
import TicTacToe from "./components/TicTacToe";

/**
 * App shell: centered layout for the game.
 */
export default function App() {
  return (
    <div className="appRoot">
      <main className="appMain" aria-label="Tic Tac Toe application">
        <header className="appHeader">
          <div>
            <h1 className="appTitle">Tic Tac Toe</h1>
            <p className="appSubtitle">
              Two players • modern light UI • responsive board
            </p>
          </div>
        </header>

        <section className="appCard" aria-label="Game">
          <TicTacToe />
        </section>

        <footer className="appFooter">
          <span className="appFooterText">
            Tip: Click any square to play. “New round” keeps scores.
          </span>
        </footer>
      </main>
    </div>
  );
}
