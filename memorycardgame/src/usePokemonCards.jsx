import { useState, useEffect } from "react";
import axios from "axios";

export default function usePokemonCards(initialLimit = 6) {
  const [cards, setCards] = useState([]);
  const [limit, setLimit] = useState(initialLimit); 

  useEffect(() => {
    fetchPokemonCards();    // if I remove the 6 it sometimes adds more and more as I refresh. Maybe keep it to increase difficulty?
  }, [limit]);

  const fetchPokemonCards = async () => {
    try {
      setCards([]);
      let randomIds = Array.from({ length: limit }, () => Math.floor(Math.random() * 151) + 1);

      // Make sure random IDs are unique
      randomIds = generateUniqueRandomIds(limit);

      const cardData = await Promise.all(
        randomIds.map(async (id) => {
          const details = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
          return {
            id: details.data.id, // Unique Pokémon ID
            image: details.data.sprites.front_default, // Pokémon image
            name: details.data.name, // Pokémon name
          };
        })
      );

      setCards(shuffleArray(cardData)); // Shuffle cards before displaying
    } catch (error) {
      console.error("Error fetching Pokémon data:", error);
    }
  };

  const generateUniqueRandomIds = (limit) => {
    let randomIds = [];
    while (randomIds.length < limit) {
      let newId = Math.floor(Math.random() * 151) + 1;
      if (!randomIds.includes(newId)) {
        randomIds.push(newId);
      }
    }
    return randomIds;
  };

  const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

  const increaseDifficulty = () => {
    if (limit != 12){
        setLimit(prev => prev + 2); // Increase the number of cards for difficulty
    }
  };  

  return { cards, fetchPokemonCards, increaseDifficulty };
}
