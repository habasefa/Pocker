"use client";

import { useEffect, useState } from "react";
import { FaCoins } from "react-icons/fa";
import { Button } from "./ui/button";

interface Winner {
  player: string;
  chips: number;
}

interface ResultModalProps {
  winner: Winner;
  onClose: () => void;
  onReset: () => void;
  isOpen: boolean;
}

const ResultModal = ({
  winner,
  onClose,
  isOpen,
  onReset,
}: ResultModalProps) => {
  const [isLoading, setIsLoading] = useState(true);

  // Lock scrolling when the modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  if (!isOpen) return null;

  setTimeout(() => {
    setIsLoading(false);
  }, 2000);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
        <div className="relative w-full max-w-md mx-auto p-8 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-3xl shadow-xl text-center transform transition-all duration-500 ease-out scale-110 opacity-0 animate-fade-in z-20">
          <h2 className="text-3xl font-extrabold text-white mb-2 animate-bounce">
            Loading ...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="relative w-full max-w-md mx-auto p-8 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-3xl shadow-xl text-center transform transition-all duration-500 ease-out scale-110 opacity-0 animate-fade-in z-20">
        <h2 className="text-3xl font-extrabold text-white mb-2 ">
          🎉 Congratulations! 🎉
        </h2>
        <p className="text-xl font-bold text-white mb-6">
          Player {winner.player} Wins!
        </p>

        {/* Coin Display */}
        <div className="flex justify-center items-center space-x-2 mb-8">
          <FaCoins className="text-yellow-300 text-3xl " />

          <span className="text-3xl font-extrabold text-white ml-2">
            + {winner.chips} Chips
          </span>
        </div>

        {/* Button */}
        <div className="flex flex-row gap-3 justify-center align-center">
          {/* <Button
            variant={"secondary"}
            onClick={onClose}
            className=" text-white rounded-sm p-2 min-w-32 bg-green-400"
          >
            New Game
          </Button> */}
          <Button
            variant={"secondary"}
            onClick={onClose}
            className=" text-black rounded-sm p-2 min-w-32"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
