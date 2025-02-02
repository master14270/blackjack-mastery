import { assertEquals } from "@std/assert";
import BlackjackGame from "./classes/blackjack_game.ts";
import { Hand } from "./classes/hand.ts";
import { getCardsFromString } from "./classes/card.ts";

// Generate a new deck, and verify the true count is always zero.
Deno.test(function testNewDeckTrueCount() {
	const deck_counts_to_test = [1, 2, 4, 8, 20, 100];
	for (const deck_count of deck_counts_to_test) {
		const game = new BlackjackGame(deck_count);
		game.shuffle();
		assertEquals(game.getTrueCount(), 0);
	}
});

// Ensure hand scoring function works correctly.
Deno.test(function testHandScoring() {
	const hand = new Hand();

	// Verify hand of all aces is scored as 21.
	const strs: Array<string> = [];
	for (let i = 0; i < 21; i++) {
		strs.push("AH");
	}
	let cards = getCardsFromString(strs.join(","));
	hand.addCards(cards);
	assertEquals(hand.getScore(), 21);

	// Clear out the hand, and verify score is still zero.
	hand.clear();
	assertEquals(hand.getScore(), 0);

	// Try out a generic hand that busts.
	cards = getCardsFromString("KH,2D,5C,KC");
	hand.addCards(cards);
	assertEquals(hand.getScore(), 27);

	// Clear out the hand, and verify score is still zero.
	hand.clear();
	assertEquals(hand.getScore(), 0);

	// One last try.
	cards = getCardsFromString("6H,9H");
	hand.addCards(cards);
	assertEquals(hand.getScore(), 15);

	// Clear out the hand, and verify score is still zero.
	hand.clear();
	assertEquals(hand.getScore(), 0);
});
