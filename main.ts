import BlackjackGame from "./blackjack_game.ts";

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
	const decks = 1;
	const game = new BlackjackGame(decks);
	game.playConsole();
}
