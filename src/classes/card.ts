export enum CardType {
	Ace = 0,
	King = 1,
	Queen = 2,
	Jack = 3,
	Standard = 4, // 2-10
}

// Should this be in another file?
export enum Suit {
	Club = 0,
	Spade = 1,
	Diamond = 2,
	Heart = 3,
}

export class Card {
	suit: Suit;
	value: number;
	counting_value: number;
	card_type: CardType;

	constructor(suit: Suit, card_type: CardType, value: number) {
		this.suit = suit;
		this.card_type = card_type;
		this.value = value;

		// Standard cards couting value varies.
		if (card_type === CardType.Standard) {
			if (value >= 10) {
				this.counting_value = -1;
			} else if (value <= 6) {
				this.counting_value = 1;
			} else {
				this.counting_value = 0;
			}
		}

		// However, aces and face cards all have the same counting value.
		else {
			this.counting_value = -1;
		}
	}

	to_string(): string {
		let result = "";

		// First character.
		switch (this.card_type) {
			case CardType.Ace:
				result = "A";
				break;
			case CardType.King:
				result = "K";
				break;
			case CardType.Queen:
				result = "Q";
				break;
			case CardType.Jack:
				result = "J";
				break;
			case CardType.Standard:
				if (this.value === 10) {
					result = "T";
				} else {
					result = this.value.toString();
				}
				break;
		}

		// Second character.
		switch (this.suit) {
			case Suit.Club:
				result += "C";
				break;
			case Suit.Spade:
				result += "S";
				break;
			case Suit.Diamond:
				result += "D";
				break;
			case Suit.Heart:
				result += "H";
				break;
		}

		return result;
	}
}

/**
 * Returns a standard blackjack deck. Call multiple times to get multiple decks.
 * @returns A single black jack deck.
 */
export function getBlackjackDeck(): Array<Card> {
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
		for (let value = 2; value <= 10; value++) {
			deck.push(new Card(suit, CardType.Standard, value));
		}

		// Add Kings, Queens, Jacks, Aces
		deck.push(new Card(suit, CardType.King, 10));
		deck.push(new Card(suit, CardType.Queen, 10));
		deck.push(new Card(suit, CardType.Jack, 10));
		deck.push(new Card(suit, CardType.Ace, 11));
	}

	return deck;
}

/**
 * Takes a comma delimited list of string representations of cards, returns a new instance of a card object.
 * This is mainly used for testing.
 * @param str String representation of card(s).
 * @returns Array of cards.
 */
export function getCardsFromString(str: string): Array<Card> {
	const cards = [];
	const inputs = str.split(",");

	for (let input of inputs) {
		// Process input
		input = input.toUpperCase().trim();

		// Parse the string.
		if (input.length !== 2) {
			throw Error(
				`To convert a string to a card, string length should be '2'. Instead, we got '${input.length}'`
			);
		}

		// Define the variables we need.
		let suit: Suit;
		let card_type: CardType;
		let value: number;

		// Determine the card type.
		const first_char = input[0];
		if (first_char === "A") {
			card_type = CardType.Ace;
			value = 11;
		} else if (first_char === "K") {
			card_type = CardType.King;
			value = 10;
		} else if (first_char === "Q") {
			card_type = CardType.Queen;
			value = 10;
		} else if (first_char === "J") {
			card_type = CardType.Jack;
			value = 10;
		} else if (first_char === "T") {
			card_type = CardType.Standard;
			value = 10;
		} else {
			// Card must be standard 2-9.
			const parsed_first_char = parseInt(first_char);
			if (isNaN(parsed_first_char) || parsed_first_char < 2 || parsed_first_char > 9) {
				throw Error(
					`Unknown card type ${first_char}. We expect any of the following: 'A', 'K', 'Q', 'J', 'T', or a number 2-9.`
				);
			}
			card_type = CardType.Standard;
			value = parsed_first_char;
		}

		// Determine the card's suit.
		const second_char = input[1];
		if (second_char === "H") {
			suit = Suit.Heart;
		} else if (second_char === "D") {
			suit = Suit.Diamond;
		} else if (second_char === "C") {
			suit = Suit.Club;
		} else if (second_char === "S") {
			suit = Suit.Spade;
		} else {
			throw Error(`Unexpected suit provided ${second_char}. We expect 'H', 'D', 'C', 'S'.`);
		}

		cards.push(new Card(suit, card_type, value));
	}

	return cards;
}
