import BlackjackGame from "./blackjack_game.ts";

export function add(a: number, b: number): number {
	return a + b;
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
	// console.log("Add 2 + 3 =", add(2, 3));
	const decks = 1;
	const game = new BlackjackGame(decks);
	game.printDecks();

	const true_count = game.getTrueCount();
	console.log("True count is: ", true_count);
}
