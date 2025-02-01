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

	constructor(suit: Suit, value: number, counting_value: number, card_type: CardType) {
		this.suit = suit;
		this.card_type = card_type;

		this.value = value;
		this.counting_value = counting_value;
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
		deck.push(new Card(suit, 11, -1, CardType.Ace));
	}

	return deck;
}
