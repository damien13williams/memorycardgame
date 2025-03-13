import { useState, useEffect } from "react";
import axios from "axios";

export default function usePokemonCards(initialLimit = 6) {
  const [cards, setCards] = useState([]);
  const [limit, setLimit] = useState(initialLimit); 

  useEffect(() => {
    fetchPokemonCards();  
  }, [limit]);

  const fetchPokemonCards = async () => {
    try {
      setCards([]);
      let randomIds = Array.from({ length: limit }, () => Math.floor(Math.random() * 151) + 1);

      // Make sure random IDs are unique
      randomIds = generateUniqueRandomIds(limit);

      // CHATGPT Written Code to fetch the data from the API
      /* PROMPT:
        I am creating a memory card game as a react project and want to use pokemon card data for my game. 
        I am using jsx as the file extension and want the code to fetch the individual data (id, picture, and name) from the Pokemone API and put it in to a const cardData.
        I already have the useEffect setup and just need the code to retrieve the data and map them based on the random ids I am generating with this code below: 
        const fetchPokemonCards = async () => {
          try {
            setCards([]);
            let randomIds = Array.from({ length: limit }, () => Math.floor(Math.random() * 151) + 1);

            // Make sure random IDs are unique
            randomIds = generateUniqueRandomIds(limit);
        RESPONSE: 
        Sure! Here's an example of the code that retrieves individual Pokémon data (ID, name, and image) from the Pokémon API:

      */
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
      
      // Shuffle cards before displaying
      setCards(shuffleArray(cardData)); 
    } catch (error) {
      console.error("Error fetching Pokémon data:", error);
    }
  };

  // This is duplicates do not pop up when refreshing enough times for new pokemon 
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

  // Shuffle the cards 
  const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

  const increaseDifficulty = () => {
    if (limit != 12){
        setLimit(prev => prev + 2); // Increase the number of cards for difficulty
    }
  };  

  return { cards, fetchPokemonCards, increaseDifficulty };
}
