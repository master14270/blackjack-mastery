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
		this.value = value;
		this.counting_value = counting_value;
		this.card_type = card_type;
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
