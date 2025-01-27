import { assertEquals } from "@std/assert";
import BlackjackGame from "./blackjack_game.ts";

Deno.test(function testNewDeckTrueCount() {
	// Generate a new deck, and verify the true count is always zero.
	const deck_counts_to_test = [1, 2, 4, 8, 20, 100];
	for (const deck_count of deck_counts_to_test) {
		const game = new BlackjackGame(deck_count);
		const true_count = game.getTrueCount();
		assertEquals(true_count, 0);
	}
});
