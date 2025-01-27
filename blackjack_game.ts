import { Card, Suit, CardType } from "./card.ts";

export default class BlackjackGame {
	deck_count: number;
	draw_pile: Array<Card>;

	constructor(deck_count: number) {
		if (deck_count <= 0) {
			throw Error("`deck_count` must be a positive integer.");
		}

		this.deck_count = deck_count;

		// Populate the cards based on how many decks are here.
		this.draw_pile = [];
		for (let i = 0; i < deck_count; i++) {
			const generated_cards = this.makeBlackjackDeck();
			this.draw_pile = this.draw_pile.concat(generated_cards);
		}
	}

	makeBlackjackDeck(): Array<Card> {
		const deck: Array<Card> = [];

		/*
            The Hi-Lo Card Counting System:
            Ace, King, Queen, Jack, Ten     => -1
            Nine, Eight, Seven              =>  0
            Six, Five, Four, Three, Two     => +1
        */

		// For each suit.
		for (let suit: Suit = 0; suit < 4; suit++) {
			// Add each standard card, 2-10
			for (let count = 2; count <= 10; count++) {
				// We don't have to worry about aces here.
				let counting_value;
				if (count >= 10) {
					counting_value = -1;
				} else if (count <= 6) {
					counting_value = 1;
				} else {
					counting_value = 0;
				}
				deck.push(new Card(suit, count, counting_value, CardType.Standard));
			}

			// Add Kings, Queens, Jacks
			deck.push(new Card(suit, 10, -1, CardType.King));
			deck.push(new Card(suit, 10, -1, CardType.Queen));
			deck.push(new Card(suit, 10, -1, CardType.Jack));

			// Aces
			deck.push(new Card(suit, 1, -1, CardType.Ace));
		}

		return deck;
	}

	printDecks() {
		// Get an array of strings for each card.
		const card_strings = this.draw_pile.map((card) => card.to_string());

		// Print them!
		console.log(card_strings.join(", "));
	}

	// TODO: Verify this is calculating the true count correctly.
	getTrueCount() {
		const count = this.draw_pile.reduce((acc, card) => acc + card.counting_value, 0);
		return count / this.deck_count;
	}
}
