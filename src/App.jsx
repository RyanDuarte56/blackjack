import { useEffect, useState } from "react";
import Hand from "./components/Hand";
import Button from "./components/Button";
import Score from "./components/Score";
import GameOverScreen from "./components/GameOverScreen";

const NUMBER_OF_DECKS = 8;

const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, "jack", "queen", "king", "ace"];
const suits = ["clubs", "diamonds", "hearts", "spades"];

let deck = [];
let unshuffledShoe = [];
let shuffledShoe;

values.forEach((value) => {
  suits.forEach((suit) => {
    deck.push(`${value}_of_${suit}.svg`);
  });
});

for (let i = 0; i < NUMBER_OF_DECKS; i++) {
  unshuffledShoe = unshuffledShoe.concat(deck);
}

export default function App() {
  const [dealerHand, setDealerHand] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerScore, setDealerScore] = useState();
  const [playerScore, setPlayerScore] = useState();
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isHandOver, setIsHandOver] = useState(false);

  function shuffleShoe() {
    shuffledShoe = unshuffledShoe.concat();

    for (let i = shuffledShoe.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledShoe[i], shuffledShoe[j]] = [shuffledShoe[j], shuffledShoe[i]];
    }
  }

  function dealHand() {
    let playerCards = [];
    let dealerCards = [];

    shuffleShoe();

    playerCards.push(shuffledShoe.pop());
    dealerCards.push(shuffledShoe.pop());
    playerCards.push(shuffledShoe.pop());
    dealerCards.push("card-back.png");

    setDealerHand(dealerCards);
    setPlayerHand(playerCards);

    setDealerScore(getHandValue([dealerCards[0]]));
    setPlayerScore(getHandValue(playerCards));

    setIsPlayerTurn(true);
    setIsHandOver(false);
  }

  function getHandValue(hand) {
    let total = 0;
    let handHasAce = false;

    hand.forEach((card) => {
      let value = card.split("_")[0];

      if (value === "ace") {
        value = 1;
        handHasAce = true;
      } else if (["jack", "queen", "king"].includes(value)) value = 10;
      else value = values.indexOf(Number(value)) + 2;

      total += value;
    });

    if (handHasAce && total + 10 <= 21) return total + 10;
    return total;
  }

  function hit() {
    const newPlayerHand = [...playerHand, shuffledShoe.pop()];
    const newPlayerScore = getHandValue(newPlayerHand);

    setPlayerHand(newPlayerHand);
    setPlayerScore(newPlayerScore);
    if (newPlayerScore >= 21) setIsPlayerTurn(false);
  }

  function stand() {
    setIsPlayerTurn(false);
  }

  function double() {
    const newPlayerHand = [...playerHand, shuffledShoe.pop()];
    const newPlayerScore = getHandValue(newPlayerHand);

    setPlayerHand(newPlayerHand);
    setPlayerScore(newPlayerScore);
    setIsPlayerTurn(false);
  }

  function showDealerHiddenCard() {
    const newDealerHand = [...dealerHand.slice(0, -1), shuffledShoe.pop()];
    const newDealerScore = getHandValue(newDealerHand);

    setDealerHand(newDealerHand);
    setDealerScore(newDealerScore);

    return { newDealerHand, newDealerScore };
  }

  async function handleDealerTurn() {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    let { newDealerHand, newDealerScore } = showDealerHiddenCard();

    while (newDealerScore < 17) {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      newDealerHand = [...newDealerHand, shuffledShoe.pop()];
      newDealerScore = getHandValue(newDealerHand);

      setDealerHand(newDealerHand);
      setDealerScore(newDealerScore);
    }

    await new Promise((resolve) => setTimeout(resolve, 750));
    setIsHandOver(true);
  }

  function determineResultMessage() {
    const dealerHasBJ = dealerHand.length === 2 && dealerScore === 21;
    const playerHasBJ = playerHand.length === 2 && playerScore === 21;

    if (dealerHasBJ && playerHasBJ) return "Empate! Ambos têm blackjack.";
    if (dealerHasBJ) return "Derrota! O dealer tem blackjack.";
    if (playerHasBJ) return "Vitória! Você tem blackjack.";

    if (playerScore > 21) return "Derrota! Você estourou.";
    if (dealerScore > 21) return "Vitória! O dealer estourou.";
    if (dealerScore > playerScore)
      return "Derrota! O dealer obteve uma pontuação maior.";
    if (playerScore > dealerScore)
      return "Vitória! Você obteve uma pontuação maior.";
    return "Empate! Ambos obtiveram a mesma pontuação.";
  }

  useEffect(dealHand, []);

  useEffect(() => {
    if (!isPlayerTurn) handleDealerTurn();
  }, [isPlayerTurn]);

  return (
    <div className="m-0 p-0 box-border w-screen min-h-screen bg-gray-400 font-[Inter]">
      <h1 className="text-3xl text-center font-bold mb-5">BLACKJACK</h1>
      <Hand hand={dealerHand} />
      <Score name="Dealer" score={dealerScore} />
      <Hand hand={playerHand} />
      <Score name="Player" score={playerScore} />
      <div className="flex items-center justify-center gap-4 mb-10">
        <Button action={hit} name="HIT" isPlayerTurnFinished={!isPlayerTurn} />
        <Button
          action={stand}
          name="STAND"
          isPlayerTurnFinished={!isPlayerTurn}
        />
        <Button
          action={double}
          name="DOUBLE"
          isPlayerTurnFinished={!isPlayerTurn}
        />
      </div>
      <GameOverScreen
        isHandOver={isHandOver}
        determineResultMessage={determineResultMessage}
      />
      {isHandOver && (
        <div className="flex items-center justify-center mt-10">
          <Button
            action={dealHand}
            name="Nova Mão"
            isPlayerTurnFinished={false}
          />
        </div>
      )}
    </div>
  );
}
