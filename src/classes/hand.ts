import { Card, CardType } from "./card.ts";

export class Hand {
	cards: Array<Card>;

	constructor() {
		this.cards = [];
	}

	addCards(cards: Array<Card>) {
		this.cards = this.cards.concat(cards);
	}

	/**
	 * Empties the hand, returning cards that were in it.
	 * @returns An array of the cards that were in the hand before clearing.
	 */
	clear(): Array<Card> {
		return this.cards.splice(0, this.cards.length);
	}

	getScore(): number {
		let score = 0;
		let ace_count = 0;

		for (const card of this.cards) {
			score += card.value;
			if (card.card_type === CardType.Ace) {
				ace_count += 1;
			}
		}

		// If we have busted with aces, decrease the score if we can.
		while (ace_count > 0 && score > 21) {
			ace_count -= 1;
			score -= 10;
		}

		return score;
	}

	printHand() {
		const str_cards = this.cards.map((card) => card.to_string());
		console.log(str_cards.join(", "));
	}

	printDealerHandInitial() {
		if (this.cards.length < 2) {
			throw Error(
				"Attempted to print initial dealer's hand; when dealer had less than two cards."
			);
		}

		// Print the first card, obscure the second.
		console.log(`${this.cards[0].to_string()}, ??`);
	}
}
