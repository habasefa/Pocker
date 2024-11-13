import { Action, Round } from "@/app/page";

export const BIG_BLIND = 40;

export const gameStarter = () => {
  // 1. Position the players
  const positions = [1, 2, 3, 4, 5, 6];

  // 2. Determine the dealer
  const dealer = Math.floor(Math.random() * positions.length);

  // 3. Initialize the small blind and big blind
  const dsb = {
    dealer: { player: positions[dealer] },
    "small blind": {
      player: positions[(dealer + 1) % positions.length],
      amount: BIG_BLIND / 2,
    },
    "big blind": {
      player: positions[(dealer + 2) % positions.length],
      amount: BIG_BLIND,
    },
  };

  // 5. Deal cards
  const { dealtCards, remainingDeck } = dealCards(6, dealer);

  return {
    data: dealtCards,
    dsb: dsb,
    remainingDeck,
    actions: {
      preFlop: [],
      flop: [],
      turn: [],
      river: [],
    },
  };
};

export const community_cards = (round: Round, deck: string[]) => {
  let cardsToDraw;

  switch (round) {
    case "flop":
      cardsToDraw = 3; // Draw 3 cards for the flop
      break;
    case "turn":
    case "river":
      cardsToDraw = 1; // Draw 1 card for turn and river
      break;
    default:
      return { cards: [], remainingDeck: deck }; // For preFlop or invalid rounds, return an empty set of cards
  }

  // Draw the specified number of cards from the deck
  const drawnCards = deck.slice(0, cardsToDraw);
  const remainingDeck = deck.slice(cardsToDraw);

  return {
    cards: drawnCards,
    remainingDeck,
  };
};

export const updateCards = (
  state: any,
  round: string,
  playerIndex: number,
  action: string,
  amount?: number
) => {
  // Create a copy of the state to ensure immutability
  const newState = {
    ...state,
    actions: { ...state.actions },
  };

  // Ensure the actions array for the specified round exists
  if (!newState.actions[round]) {
    newState.actions[round] = [];
  }

  // Add a new action entry to the round's actions array
  newState.actions[round].push({
    player: newState.data[playerIndex].player,
    action,
    ...(amount !== undefined && { amount }), // Conditionally add amount if provided
  });

  return newState;
};
export const next_actions = (
  actions: {
    [key in Round]: Array<{
      playerIndex: number;
      action: string;
      amount?: number;
    }>;
  },
  round: Round,
  currentPlayerIndex: number
): Action[] => {
  console.log("actions in next_actions", actions);
  // Extract actions taken in the specified round
  const roundActions = actions[round] || [];

  // Determine the highest bet made in the current round
  const currentBet = Math.max(
    0,
    ...roundActions
      .filter((action) => ["bet", "raise", "call"].includes(action.action))
      .map((action) => action.amount || 0)
  );

  // Calculate the total amount the current player has contributed in this round
  const playerBet = roundActions
    .filter((action) => action.playerIndex === currentPlayerIndex)
    .reduce((sum, action) => sum + (action.amount || 0), 0);

  // Initialize possible actions for the player
  const availableActions: Action[] = ["fold"];

  // Determine available actions based on the current betting state
  if (currentBet === 0) {
    // No existing bet in the round: player can "check" or "bet"
    availableActions.push("check", "bet");
  } else {
    // There's an existing bet in the round
    if (playerBet < currentBet) {
      availableActions.push("call"); // Player can call to match the current bet
    }
    if (playerBet === currentBet) {
      availableActions.push("check"); // Player can check if they’ve matched the bet
    }
    if (playerBet < currentBet) {
      availableActions.push("raise"); // Player can raise if they have chips to increase the current bet
    }
  }

  // Add "all-in" as an option
  availableActions.push("all-in");

  return availableActions;
};

export const should_continue_round = (
  actions: {
    [key in Round]: Array<{ player: string; action: string; amount?: number }>;
  },
  data: any[],
  currentRound: Round
) => {
  // Get the list of actions for the current round
  const roundActions = actions[currentRound];

  // Check if every player in `data` has made an action in the current round
  const allPlayersActed = data.every((player) =>
    roundActions.some((action) => action.player === player.player)
  );

  // Calculate the total bet amount for each player in the current round
  const playerBetTotals: { [player: string]: number } = {};

  roundActions.forEach((action) => {
    if (
      ["bet", "raise", "call"].includes(action.action) &&
      action.amount !== undefined
    ) {
      playerBetTotals[action.player] =
        (playerBetTotals[action.player] || 0) + action.amount;
    }
  });

  // Get all unique bet totals from players who acted in the round
  const uniqueBetTotals = new Set(Object.values(playerBetTotals));

  // All players must act, and their total bet amounts must be equal
  return allPlayersActed && uniqueBetTotals.size === 1;
};

export const getNextPlayerIndex = (
  playerIndex: number,
  data: any,
  currentRound: Round
) => {
  const rounds = ["preFlop", "flop", "turn", "river"];
  const currentRoundIndex = rounds.indexOf(currentRound);

  console.log("playerIndex", playerIndex);
  console.log("data", data);
  console.log("currentRound", currentRound);

  // Step 1: Identify all players who have folded in any round up to the current round
  const foldedPlayers = new Set<string>();

  for (let i = 0; i <= currentRoundIndex; i++) {
    const round = rounds[i];
    if (data.actions[round]) {
      data.actions[round].forEach(
        (action: { player: string; action: string }) => {
          if (action.action === "fold") {
            foldedPlayers.add(action.player);
          }
        }
      );
    }
  }

  // Step 2: Find the next active player index
  const players = data.players; // Assuming `data.players` is an array of player objects or IDs
  let nextPlayerIndex = playerIndex;

  do {
    nextPlayerIndex = (nextPlayerIndex + 1) % players.length; // Move to the next player in a circular manner
  } while (
    foldedPlayers.has(players[nextPlayerIndex]) &&
    nextPlayerIndex !== playerIndex
  );

  // If we looped back to the original playerIndex without finding an active player, return -1 (or handle as needed)
  if (
    nextPlayerIndex === playerIndex &&
    foldedPlayers.has(players[nextPlayerIndex])
  ) {
    return -1; // No eligible player found
  }

  return nextPlayerIndex;
};
// Helper function to generate dealt cards for each player
export const dealCards = (players = 6, dealer: number) => {
  const suits = ["♠", "♥", "♦", "♣"];
  const values = [
    "A",
    "K",
    "Q",
    "J",
    "10",
    "9",
    "8",
    "7",
    "6",
    "5",
    "4",
    "3",
    "2",
  ];

  // Generate a full deck of 52 cards
  const deck = [];
  for (const suit of suits) {
    for (const value of values) {
      deck.push(`${value}${suit}`);
    }
  }

  // Shuffle the deck
  const shuffledDeck = deck.sort(() => Math.random() - 0.5);

  // Deal two cards to each player, starting from the player after the dealer
  const dealtCards = [];
  const startingPosition = (dealer + 1) % players;

  for (let i = 0; i < players; i++) {
    const position = (startingPosition + i) % players;
    const playerCards = [shuffledDeck.pop(), shuffledDeck.pop()]; // Deal two cards per player
    dealtCards.push({
      player: position + 1, // Positions are 1-indexed (1, 2, ..., 6)
      dealt: playerCards.join(" "), // Format cards as "Ac Kh"
    });
  }

  // Remaining deck after dealing
  const remainingDeck = [...shuffledDeck];

  return {
    dealtCards,
    remainingDeck,
  };
};

// Helper function to tell the next player to act
export const next_player = (state: any, currentPlayerIndex: number) => {
  const { dealtCards } = state; // Access the list of players from the state
  const numPlayers = dealtCards.length;

  // Find the highest bet made in the current stage
  const highestBet = Math.max(
    ...dealtCards.map((player) => player.bet || 0) // Assuming `bet` property stores each player’s current bet amount
  );

  // Start from the next player and loop until finding an eligible player
  let nextIndex = (currentPlayerIndex + 1) % numPlayers;

  while (nextIndex !== currentPlayerIndex) {
    const player = dealtCards[nextIndex];

    // Check if player has not folded and their bet is not equal to the highest bet
    if (!player.folded && (player.bet || 0) < highestBet) {
      return nextIndex; // Return the index of the next player to act
    }

    // Move to the next player
    nextIndex = (nextIndex + 1) % numPlayers;
  }

  // If no eligible player found, return -1 to indicate the round is complete
  return -1;
};
