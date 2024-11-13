"use client";

import { useEffect, useState } from "react";

interface CommunityCardsProps {
  communityCards: {
    flop: string[];
    turn: string[];
    river: string[];
  };
}

const CommunityCards = ({ communityCards }: CommunityCardsProps) => {
  const [animatedCards, setAnimatedCards] = useState<string[]>([]);

  // Track new cards as they appear in the communityCards prop
  useEffect(() => {
    const allCards = [
      ...communityCards.flop,
      ...communityCards.turn,
      ...communityCards.river,
    ];
    const newCards = allCards.filter((card) => !animatedCards.includes(card));

    if (newCards.length > 0) {
      setAnimatedCards((prev) => [...prev, ...newCards]);

      // Remove animation effect after a delay
      setTimeout(() => {
        setAnimatedCards((prev) =>
          prev.filter((card) => !newCards.includes(card))
        );
      }, 1500); // 1.5-second animation duration
    }
  }, [communityCards]);

  return (
    <div className="flex items-center space-x-2">
      <span className="font-semibold text-yellow-300">Community Cards:</span>
      <div className="flex space-x-2">
        {[
          ...communityCards.flop,
          ...communityCards.turn,
          ...communityCards.river,
        ].map((card, index) => (
          <span
            key={index}
            className={`text-lg text-yellow-300 transform transition-transform duration-500 ease-out 
              ${
                animatedCards.includes(card)
                  ? "animate-pulse scale-125 opacity-100"
                  : "opacity-80"
              }`}
          >
            {card}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CommunityCards;
