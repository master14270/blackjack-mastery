import { Card, getBlackjackDeck } from "./card.ts";
import { Hand } from "./hand.ts";

enum GameState {
	Loading, // Initial
	// Consider adding betting?
	Setup,
	PlayerTurn,
	DealerTurn,
	Showdown,
	Reset,
	Quit, // Done
}

export default class BlackjackGame {
	state: GameState;
	deck_count: number;
	draw_pile: Array<Card>;
	discard_pile: Array<Card>;

	dealer_hand: Hand;

	// For now, assume player can only play one hand.
	player_hand: Hand;

	constructor(deck_count: number) {
		if (deck_count <= 0) {
			throw Error("`deck_count` must be a positive integer.");
		}

		this.deck_count = deck_count;

		// Populate the cards based on how many decks are here.
		this.draw_pile = [];
		for (let i = 0; i < deck_count; i++) {
			const generated_cards = getBlackjackDeck();
			this.draw_pile = this.draw_pile.concat(generated_cards);
		}

		this.discard_pile = [];
		this.dealer_hand = new Hand();
		this.player_hand = new Hand();
		this.state = GameState.Loading;
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

	shuffle() {
		// Take all cards out of the discard pile, and put them back in the draw pile.
		this.draw_pile = this.draw_pile.concat(this.discard_pile);

		// Empty the discard pile.
		this.discard_pile = [];

		// Shuffle the draw pile (Fisher-Yates: https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
		let current_index = this.draw_pile.length;
		while (current_index !== 0) {
			const random_index = Math.floor(Math.random() * current_index);
			current_index--;

			// Swap the current index with the random one.
			const temp = this.draw_pile[current_index];
			this.draw_pile[current_index] = this.draw_pile[random_index];
			this.draw_pile[random_index] = temp;
		}
	}

	drawCards(draw_count: number): Array<Card> {
		// This shouldn't normally happen? We should re-shuffle before we get close to the end.
		if (draw_count > this.draw_pile.length) {
			this.shuffle();
		}

		return this.draw_pile.splice(0, draw_count);
	}

	dealHands() {
		// Give the dealer two cards.
		this.dealer_hand.addCards(this.drawCards(2));

		// Give the player two cards.
		this.player_hand.addCards(this.drawCards(2));
	}

	discardHands() {
		// Move all dealer cards to the discard pile.
		this.discard_pile = this.discard_pile.concat(this.dealer_hand.clear());

		// Move each player hand to the discard pile.
		this.discard_pile = this.discard_pile.concat(this.player_hand.clear());
	}

	// Main game loop (for console).
	playConsole() {
		this.shuffle();

		while (this.state !== GameState.Quit) {
			// Main program.
			switch (this.state) {
				// Start the game.
				case GameState.Loading: {
					this.state = GameState.Setup;
					break;
				}

				// Deal hands then update state.
				case GameState.Setup: {
					this.dealHands();
					this.state = GameState.PlayerTurn;
					break;
				}

				// It's the players turn...
				case GameState.PlayerTurn: {
					// TODO: Check if player has busted. This will execute multiple times.

					// Show dealer hand.
					console.log("The dealer is showing:");
					this.dealer_hand.printDealerHandInitial();

					// Show player hand.
					const player_hand_score = this.player_hand.getScore();
					console.log(`Your current hand: (${player_hand_score})`);
					this.player_hand.printHand();

					// See if player busted (after printing their hand)
					if (player_hand_score > 21) {
						console.log("Oops! Looks like you busted.");
						console.log("=======================================");
						this.state = GameState.Reset;
						break;
					}

					// Get the user's input.
					const input = prompt("What would you like to do? (h)Hit (s)Stand");
					if (input === null) {
						console.log("Cannot read user input. Exiting program.");
						return;
					}

					const cleaned_input = input.trim().toLowerCase();
					if (cleaned_input === "h") {
						this.player_hand.addCards(this.drawCards(1));
					} else if (cleaned_input === "s") {
						console.log("You have stood. It is now the dealer's turn.");
						this.state = GameState.DealerTurn;
					} else {
						console.log("Unexpected input. Please try again.");
					}

					break;
				}
				case GameState.DealerTurn: {
					console.log("Dealer hand:");
					this.dealer_hand.printHand();
					const dealer_score = this.dealer_hand.getScore();
					if (dealer_score < 17) {
						this.dealer_hand.addCards(this.drawCards(1));
					} else if (dealer_score > 21) {
						console.log("Dealer has busted, you win!");
						this.state = GameState.Reset;
					} else {
						this.state = GameState.Showdown;
					}
					break;
				}

				// See who's bigger. You or the dealer.
				case GameState.Showdown: {
					const player_score = this.player_hand.getScore();
					const dealer_score = this.dealer_hand.getScore();
					if (player_score > dealer_score) {
						console.log("Player wins!");
					} else if (player_score < dealer_score) {
						console.log("Dealer wins!");
					} else {
						console.log("It's a draw.");
					}

					this.state = GameState.Reset;
					break;
				}
				case GameState.Reset: {
					console.log("Resetting...");
					console.log("==================================");
					this.discardHands();
					this.state = GameState.Setup;
					break;
				}
			}
		}
	}
}
