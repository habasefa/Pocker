"use client";

import { Action } from "@/app/page";
import { BIG_BLIND } from "@/utils/gameUtils";
import { useState } from "react";
import { Button } from "./ui/button";

interface ActionsTabProps {
  allowedActions: Action[];
  updater: (action: string, amount?: number) => void;
}

const ActionsTab = (props: ActionsTabProps) => {
  const { updater, allowedActions } = props;
  const [betAmount, setBetAmount] = useState(BIG_BLIND);
  const [raiseAmount, setRaiseAmount] = useState(BIG_BLIND);

  const isAllowed = (action: Action) => {
    return allowedActions.includes(action);
  };

  const handleFold = () => {
    updater("fold");
  };

  const handleCheck = () => {
    updater("check");
  };

  const handleCall = () => {
    updater("call");
  };

  const handleDecreaseBet = () => {
    setBetAmount(betAmount - BIG_BLIND);
  };

  const handleBet = () => {
    updater("bet", betAmount);
  };

  const handleIncreaseBet = () => {
    setBetAmount(betAmount + BIG_BLIND);
  };

  const handleDecreaseRaise = () => {
    setRaiseAmount(raiseAmount - BIG_BLIND);
  };

  const handleRaise = () => {
    updater("raise", raiseAmount);
  };

  const handleIncreaseRaise = () => {
    setRaiseAmount(raiseAmount + BIG_BLIND);
  };

  const handleAllIn = () => {
    updater("all-in");
  };

  return (
    <div className="flex justify-around items-center bg-gray-900 rounded-lg shadow-lg">
      {/* Fold Button */}
      <Button
        disabled={!isAllowed("fold")}
        onClick={handleFold}
        className="bg-gray-700 text-white rounded-lg px-6 py-2 shadow-lg"
      >
        Fold
      </Button>

      {/* Check Button */}
      <Button
        disabled={!isAllowed("check")}
        onClick={handleCheck}
        className="bg-green-600 text-white rounded-lg px-6 py-2 shadow-lg"
      >
        Check
      </Button>

      {/* Call Button */}
      <Button
        disabled={!isAllowed("call")}
        onClick={handleCall}
        className="bg-blue-600 text-white rounded-lg px-6 py-2 shadow-lg"
      >
        Call
      </Button>

      {/* Bet Controls */}
      <div className="flex items-center gap-1 bg-gray-800 p-2 rounded-lg shadow-inner">
        <Button
          disabled={!isAllowed("bet") || betAmount <= BIG_BLIND}
          onClick={handleDecreaseBet}
          className="bg-red-600 text-white rounded-full px-3 py-2 shadow-md"
        >
          -
        </Button>
        <Button
          disabled={!isAllowed("bet")}
          onClick={handleBet}
          className="bg-red-600 text-white rounded-lg px-6 py-2 shadow-lg"
        >
          Bet {betAmount}
        </Button>
        <Button
          disabled={!isAllowed("bet")}
          onClick={handleIncreaseBet}
          className="bg-red-600 text-white rounded-full px-3 py-2 shadow-md"
        >
          +
        </Button>
      </div>

      {/* Raise Controls */}
      <div className="flex items-center gap-1 bg-gray-800 p-2 rounded-lg shadow-inner">
        <Button
          disabled={!isAllowed("raise") || raiseAmount <= BIG_BLIND}
          onClick={handleDecreaseRaise}
          className="bg-yellow-600 text-white rounded-full px-3 py-2 shadow-md"
        >
          -
        </Button>
        <Button
          disabled={!isAllowed("raise")}
          onClick={handleRaise}
          className="bg-yellow-600 text-white rounded-lg px-6 py-2 shadow-lg"
        >
          Raise {raiseAmount}
        </Button>
        <Button
          disabled={!isAllowed("raise")}
          onClick={handleIncreaseRaise}
          className="bg-yellow-600 text-white rounded-full px-3 py-2 shadow-md"
        >
          +
        </Button>
      </div>

      {/* All-in Button */}
      <Button
        disabled={!isAllowed("all-in")}
        onClick={handleAllIn}
        className="bg-red-700 text-white font-bold px-8 py-2 rounded-lg shadow-xl"
      >
        ALL IN
      </Button>
    </div>
  );
};

export default ActionsTab;
