import React, { useState, useEffect } from "react";

interface Player {
  name: string;
  score: number;
  setsWon: number;
}

interface Set {
  player1Score: number;
  player2Score: number;
  winner: 1 | 2 | null;
}

const BadmintonScoreCard = () => {
  const [player1, setPlayer1] = useState<Player>({
    name: "Player 1",
    score: 0,
    setsWon: 0,
  });
  const [player2, setPlayer2] = useState<Player>({
    name: "Player 2",
    score: 0,
    setsWon: 0,
  });
  const [currentSet, setCurrentSet] = useState<number>(1);
  const [matchOver, setMatchOver] = useState<boolean>(false);
  const [setsHistory, setSetsHistory] = useState<Set[]>([]);

  const [scoreLimit, setScoreLimit] = useState<number>(21);

  useEffect(() => {
    checkSetWinner();
  }, [player1.score, player2.score]);

  useEffect(() => {
    if (player1.setsWon >= 2 || player2.setsWon >= 2) {
      setMatchOver(true);
    }
  }, [player1.setsWon, player2.setsWon]);

  const handlePlayer1NameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayer1({ ...player1, name: e.target.value });
  };

  const handlePlayer2NameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayer2({ ...player2, name: e.target.value });
  };

  const checkSetWinner = () => {
    if (player1.score >= scoreLimit && player1.score - player2.score >= 2) {
      setPlayer1((prev) => ({ ...prev, setsWon: prev.setsWon + 1 }));
      recordSet(1);
      resetScores();
    } else if (
      player2.score >= scoreLimit &&
      player2.score - player1.score >= 2
    ) {
      setPlayer2((prev) => ({ ...prev, setsWon: prev.setsWon + 1 }));
      recordSet(2);
      resetScores();
    }
  };

  const recordSet = (winner: 1 | 2) => {
    setSetsHistory((prev) => [
      ...prev,
      { player1Score: player1.score, player2Score: player2.score, winner },
    ]);
    setCurrentSet((prev) => prev + 1);
  };

  const resetScores = () => {
    setPlayer1((prev) => ({ ...prev, score: 0 }));
    setPlayer2((prev) => ({ ...prev, score: 0 }));
  };

  const incrementScore = (player: 1 | 2) => {
    if (matchOver) return;
    if (player === 1) {
      setPlayer1({ ...player1, score: player1.score + 1 });
    } else {
      setPlayer2({ ...player2, score: player2.score + 1 });
    }
  };

  const decrementScore = (player: 1 | 2) => {
    if (matchOver) return;
    if (player === 1 && player1.score > 0) {
      setPlayer1({ ...player1, score: player1.score - 1 });
    } else if (player === 2 && player2.score > 0) {
      setPlayer2({ ...player2, score: player2.score - 1 });
    }
  };

  const handleScoreLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setScoreLimit(parseInt(e.target.value, 10));
    resetScores();
  };

  const resetMatch = () => {
    setPlayer1({ name: "Player 1", score: 0, setsWon: 0 });
    setPlayer2({ name: "Player 2", score: 0, setsWon: 0 });
    setCurrentSet(1);
    setMatchOver(false);
    setSetsHistory([]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-700">
        Badminton ScoreCard - KAC
      </h1>

      <div className="flex space-x-8 mb-8">
        <div className="flex flex-col items-center">
          <input
            type="text"
            placeholder="Player 1 Name"
            value={player1.name}
            onChange={handlePlayer1NameChange}
            className="px-3 py-2 border border-gray-300 rounded-md mb-2 text-gray-700"
          />
          <div className="flex items-center space-x-4">
            <button
              onClick={() => decrementScore(1)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              -
            </button>
            <div className="text-5xl font-bold text-gray-800">
              {player1.score}
            </div>
            <button
              onClick={() => incrementScore(1)}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              +
            </button>
          </div>
          <div className="text-xl mt-2 text-gray-600">
            Sets Won: {player1.setsWon}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <input
            type="text"
            placeholder="Player 2 Name"
            value={player2.name}
            onChange={handlePlayer2NameChange}
            className="px-3 py-2 border border-gray-300 rounded-md mb-2 text-gray-700"
          />
          <div className="flex items-center space-x-4">
            <button
              onClick={() => decrementScore(2)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              -
            </button>
            <div className="text-5xl font-bold text-gray-800">
              {player2.score}
            </div>
            <button
              onClick={() => incrementScore(2)}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              +
            </button>
          </div>
          <div className="text-xl mt-2 text-gray-600">
            Sets Won: {player2.setsWon}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label
          htmlFor="scoreLimit"
          className="block text-sm font-medium text-gray-700 mr-2"
        >
          Score Limit:
        </label>
        <select
          id="scoreLimit"
          value={scoreLimit}
          onChange={handleScoreLimitChange}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value={15}>15</option>
          <option value={21}>21</option>
        </select>
      </div>

      <div className="mb-8 text-gray-600">Current Set: {currentSet}</div>

      {matchOver && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">
            {player1.setsWon > player2.setsWon
              ? `${player1.name} wins!`
              : `${player2.name} wins!`}
          </span>
        </div>
      )}
      {setsHistory.length > 0 && (
        <div className="mb-8 border border-gray-300 rounded-md p-4 w-full max-w-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Set History
          </h3>
          <ul className="text-gray-600">
            {setsHistory.map((set, index) => (
              <li key={index} className="mb-1">
                Set {index + 1}: {player1.name} {set.player1Score} -{" "}
                {set.player2Score} {player2.name} | Winner:{" "}
                {set.winner === 1
                  ? player1.name
                  : set.winner === 2
                  ? player2.name
                  : "N/A"}
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        onClick={resetMatch}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Reset Match
      </button>
    </div>
  );
};

export default BadmintonScoreCard;
