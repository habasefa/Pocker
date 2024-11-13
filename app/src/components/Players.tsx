"use client";

import { DSB } from "@/app/page";
import { useEffect, useRef, useState } from "react";

interface Player {
  player: string;
  dealt: string;
}

interface Action {
  player: string;
  action: string;
  amount?: number;
}

interface PlayersProps {
  data: Player[];
  action: { [key: string]: Action[] }; // Updated to be an object keyed by round name
  currentRound: "preFlop" | "flop" | "turn" | "river";
  currentPlayerIndex: number;
  dsb: DSB;
  isGameStarted: boolean;
}

const Players = ({
  data = [],
  action = {},
  currentRound,
  currentPlayerIndex,
  dsb,
  isGameStarted,
}: PlayersProps) => {
  const rounds = ["preFlop", "flop", "turn", "river"];
  const currentRoundIndex = rounds.indexOf(currentRound);

  const currentPlayerRef = useRef<HTMLDivElement | null>(null);

  const [showRoles, setShowRoles] = useState(false);
  const [showDealtCards, setShowDealtCards] = useState(
    Array(data.length).fill(false)
  );
  const [animationsComplete, setAnimationsComplete] = useState(false);
  const [initialAnimationsTriggered, setInitialAnimationsTriggered] =
    useState(false);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (!isGameStarted || initialAnimationsTriggered) return;

    setShowRoles(false);
    setShowDealtCards(Array(data.length).fill(false));
    setAnimationsComplete(false);

    setTimeout(() => {
      setShowRoles(true);
    }, 500);

    data.forEach((_, index) => {
      setTimeout(() => {
        setShowDealtCards((prev) => {
          const updated = [...prev];
          updated[index] = true;
          return updated;
        });

        if (index === data.length - 1) {
          cardRefs.current[index]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 1000 + index * 500);
    });

    setTimeout(() => {
      setAnimationsComplete(true);
      setInitialAnimationsTriggered(true);
    }, 1000 + data.length * 500 + 500);
  }, [isGameStarted, data, initialAnimationsTriggered]);

  useEffect(() => {
    if (animationsComplete) {
      currentPlayerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentPlayerIndex, currentRound, animationsComplete]);

  if (!isGameStarted) {
    return (
      <div className="bg-gray-900 items-center flex flex-row justify-center p-6 rounded-lg shadow-lg text-white">
        <p className="text-md text-pink-500">Game is not started yet</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-white">
      <h1 className="text-2xl font-bold mb-6">Game Field</h1>

      <div className="space-y-2">
        {Object.entries(dsb).map(([key, value]) => (
          <div
            key={key}
            className={`flex justify-between items-center p-2 bg-gray-800 rounded-lg shadow-inner transition-opacity duration-700 ${
              showRoles ? "opacity-100" : "opacity-0"
            }`}
          >
            <p className="text-lg font-bold text-gray-200">{key}</p>
            {!value?.amount ? (
              <p className="text-md text-pink-500">Player {value.player}</p>
            ) : (
              <p className="text-md text-pink-500">
                Player {value.player} posts
                <span className="text-yellow-300"> {value.amount} Chips</span>
              </p>
            )}
          </div>
        ))}
      </div>

      <hr className="my-6 border-white" />

      <div className="space-y-2 mb-6">
        {data.map((player, index) => (
          <div
            key={index}
            ref={(el) => (cardRefs.current[index] = el)}
            className={`flex justify-between items-center p-2 bg-gray-800 rounded-lg shadow-inner transition-opacity duration-700 ${
              showDealtCards[index] ? "opacity-100" : "opacity-0"
            }`}
          >
            <p className="text-lg font-bold text-gray-200">
              Player {player.player}
            </p>
            <p className="text-md text-pink-500">Dealt: {player.dealt}</p>
          </div>
        ))}
      </div>

      {animationsComplete &&
        rounds.map((round, index) => {
          if (index > currentRoundIndex) return null;

          return (
            <div key={round} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-300 mb-4 capitalize">
                {round} Actions
              </h2>

              <div className="space-y-2">
                {(action[round] || []).map((actionData, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-2 bg-gray-800 rounded-lg shadow-inner"
                  >
                    <p className="text-lg font-bold text-gray-200">
                      Player {actionData.player}
                    </p>
                    <p className="text-md text-gray-300">
                      {actionData.action}
                      {actionData.amount !== undefined && (
                        <span className="text-green-400 ml-2">
                          {actionData.amount} chips
                        </span>
                      )}
                    </p>
                  </div>
                ))}
              </div>

              {round === currentRound && (
                <div
                  ref={currentPlayerRef}
                  className="flex justify-between items-center p-2 mt-3 bg-gray-800 rounded-lg shadow-inner animate-pulse border-2 border-green-500"
                >
                  <p className="text-lg font-bold text-gray-200">
                    Player {data[currentPlayerIndex]?.player}
                  </p>
                  <p className="text-md text-gray-300">Waiting for action...</p>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default Players;
