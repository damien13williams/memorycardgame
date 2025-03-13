import Card from "./Card.jsx";
import Button from "./Button.jsx";
import {useState, useEffect} from "react";
import usePokemonCards from "./usePokemonCards.jsx";
import './index.css';

export default function MemoryGame(){
    const { cards, fetchPokemonCards, increaseDifficulty } = usePokemonCards(6);
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [clickedCards, setClickedCards] = useState(new Set());
    const [shuffledCards, setShuffledCards] = useState([]);
    const [gameKey, setGameKey] = useState(Date.now()); // Key to force re-render

    const shuffleArray = (array) => {
        return [...array].sort(() => Math.random() - 0.5);
    };

    // Update shuffledCards when new cards are fetched
    useEffect(() => {
        if (cards.length > 0) {
            setShuffledCards(shuffleArray(cards));
        }
    }, [cards]);

    // To handle the game if the user earns a point or goes back to zero
    const handleCardClicked = (id) => {
        if(clickedCards.has(id)){
            setScore(0);
            setClickedCards(new Set());
        }else{
            const newScore = score + 1;
            setScore(newScore);
            setClickedCards(new Set(clickedCards.add(id)));
            if(newScore > bestScore){
                setBestScore(newScore);
            }
        }
        // Shuffle and update state
        setShuffledCards(shuffleArray(cards));
    };

    //  Set everything to 0 and and restart game giving the player a new set of cards
    const handleRefresh = () => {
        setClickedCards(new Set()); 
        setScore(0); 
        fetchPokemonCards();
        setGameKey(Date.now()); // Change the key to force re-render
    };

    return (
        <div key={gameKey} className="game">
            <h1 className="header">Pokemon Memory Game</h1>
            <div className="scoreBaord"> Score: {score} | Best Score: {bestScore}</div>
            
            <div className="container">
                {shuffledCards.map((card) => (
                <Card key={card.id} onClick={() => handleCardClicked(card.id)}>
                    <div>
                        <img src={card.image} alt={card.name} className="image" />
                        <p className="name">{card.name}</p>
                    </div>
                </Card>
            ))}
            </div>
            <Button onClick={handleRefresh}>Refresh Cards</Button>
            <Button onClick={increaseDifficulty}>Increase Difficulty</Button>
        </div>
    );
}