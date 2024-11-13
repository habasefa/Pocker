"use client";

import ActionsTab from "@/components/ActionsTab";
import CommunityCards from "@/components/CommunityCards";
import Players from "@/components/Players";
import ResultModal from "@/components/ResultModal";
import SideBar from "@/components/SideBar";
import Stack from "@/components/Stack";
import {
  community_cards,
  gameStarter,
  getNextPlayerIndex,
  next_actions,
  should_continue_round,
  updateCards,
} from "@/utils/gameUtils";
import { useEffect, useState } from "react";

const rounds = ["preFlop", "flop", "turn", "river"];

export type Action = "call" | "raise" | "check" | "fold" | "bet" | "all-in";
export type Round = "preFlop" | "flop" | "turn" | "river";
export type DSB = {
  dealer: {
    player: string;
  };
  "small blind": {
    player: string;
    amount: string;
  };
  "big blind": {
    player: string;
    amount: string;
  };
};

export default function MainLayout() {
  const [data, setData] = useState<any>({});
  const [round, setRound] = useState<Round>("preFlop");
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [allowedActions, setAllowedActions] = useState<Action[]>(["fold"]);

  // Separate state for community cards
  const [communityCards, setCommunityCards] = useState({
    flop: [] as string[],
    turn: [] as string[],
    river: [] as string[],
  });

  const dealtCards = data.data || [];
  const actions = data.actions || {};
  const dsb = data.dsb || {};
  const remainingCards = data.remainingDeck || [];

  // Handle game start and reset states
  // Some state update look redundant but they are added to handle different cases where this function is called
  const handleGameStatus = () => {
    setIsGameStarted(false);
    setRound("preFlop");
    setData({});
    const initialData = gameStarter();
    setData(initialData);
    const actions = next_actions(
      initialData.actions,
      round,
      currentPlayerIndex
    );
    setAllowedActions(actions);
    setIsGameStarted(true);
  };

  // Update player action for the current round
  const handleUpdate = (action: Action, amount?: number) => {
    const playerIndex = currentPlayerIndex;
    const updatedData = updateCards(data, round, playerIndex, action, amount);
    setData(updatedData);
    const isNextRound = should_continue_round(data.actions, data.data, round); // Determine if the round should continue based on the updated data state
    if (isNextRound) {
      // Move to the next round
      const nextRoundIndex = rounds.indexOf(round) + 1;
      if (nextRoundIndex < rounds.length) {
        const nextRound = rounds[nextRoundIndex] as Round;
        // Draw community cards for the new round
        const { cards, remainingDeck } = community_cards(
          nextRound,
          remainingCards
        );
        setData((prev: any) => ({ ...prev, remainingDeck }));
        setCommunityCards((prevCards) => ({
          ...prevCards,
          [nextRound]: [...prevCards[nextRound], ...cards],
        }));
        // Advance to the next round and reset player index to the first player
        setRound(nextRound);
        setCurrentPlayerIndex(0);
      } else {
        setIsModalOpen(true); // End game and show results if no more rounds.
      }
    } else {
      // Move to the next player within the current round
      const nextPlayerIndex = getNextPlayerIndex(playerIndex, data, round);
      setCurrentPlayerIndex(nextPlayerIndex);
    }
  };

  // Update allowed actions whenever currentPlayerIndex changes
  useEffect(() => {
    if (isGameStarted) {
      const actions = next_actions(actions, round, currentPlayerIndex);
      setAllowedActions(actions);
    }
  }, [currentPlayerIndex, data, round, isGameStarted]);

  return (
    <div className="flex min-h-screen">
      {/* Main Content Area */}
      <div className="flex flex-col flex-grow">
        {/* Top Component - Always Visible */}
        <div className="flex-none bg-[#AF1740] p-4 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">PLAYING FIELD LOG</h2>
          </div>
          <Stack
            stack={1000}
            isGameStarted={isGameStarted}
            onChange={handleGameStatus}
          />
          <CommunityCards communityCards={communityCards} />
        </div>

        {/* Center Scrollable Area */}
        <div
          className="flex-grow overflow-y-auto bg-gray-100 p-4"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          <Players
            data={dealtCards}
            actions={actions}
            dsb={dsb}
            currentRound={round}
            currentPlayerIndex={currentPlayerIndex}
            isGameStarted={isGameStarted}
          />
        </div>

        {/* Bottom Component */}
        <div className="flex-none p-4 text-white">
          <ActionsTab allowedActions={allowedActions} updater={handleUpdate} />
        </div>
      </div>

      {/* Divider */}
      <div className="w-px bg-gray-400 mx-4"></div>

      {/* Right Sidebar */}
      <div className="flex-none w-1/4 bg-gray-200">
        <SideBar />
      </div>

      {/* Result Modal */}
      <ResultModal
        winner={{ player: "Player 1", chips: 2000 }}
        onClose={() => setIsModalOpen(false)}
        isOpen={isModalOpen}
        onReset={handleGameStatus}
      />
    </div>
  );
}
