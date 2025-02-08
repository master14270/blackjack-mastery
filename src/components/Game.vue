<script setup lang="ts">
import { ref, watch, computed } from "vue";
import BlackjackGame, { GameState } from "../classes/blackjack_game.ts";
import Card from "./Card.vue";
import Swal from "sweetalert2";

// Settings and data
const deck_count = 1;
const game = ref(new BlackjackGame(deck_count));
const show_hands_duration_ms = 3 * 1000;

// Display data that can change.
let user_score_display: string;
let dealer_score_display: string;
let running_count_discarded_display: string;

// State handler
watch(
	() => game.value.state,
	async (state, _) => {
		const local_game = game.value;

		if (state === GameState.Setup) {
			local_game.dealHands();
			updateHandScoreDisplay();
			local_game.state = GameState.PlayerTurn;
		} else if (state === GameState.DealerTurn) {
			updateHandScoreDisplay();

			while (local_game.dealer_hand.getScore() < 17) {
				// TODO: Delay for UI???

				// Draw a card.
				local_game.dealer_hand.addCards(local_game.drawCards(1));
				updateHandScoreDisplay();
			}

			// The dealer busted, you win.
			if (local_game.dealer_hand.getScore() > 21) {
				local_game.state = GameState.ShowingHands;
			} else {
				local_game.state = GameState.Showdown;
			}
		}

		// TODO: Remove this state, it's obsolete.
		else if (state === GameState.Showdown) {
			local_game.state = GameState.ShowingHands;
		} else if (state === GameState.Reset) {
			local_game.discardHands();
			updateRunningCountDisplay();
			local_game.state = GameState.Setup;
		} else if (state === GameState.ShowingHands) {
			const player_score = local_game.player_hand.getScore();
			const dealer_score = local_game.dealer_hand.getScore();
			let title;
			let icon;

			// Check for busts.
			if (player_score > 21) {
				title = "Dealer wins :(";
				icon = "error";
			} else if (dealer_score > 21) {
				title = "You win :)";
				icon = "success";
			}

			// Check for regular scoring.
			else if (player_score < dealer_score) {
				title = "Dealer wins :(";
				icon = "error";
			} else if (player_score > dealer_score) {
				title = "You win :)";
				icon = "success";
			}

			// Last case: must be a draw.
			else {
				title = "It's a draw :/";
				icon = "info";
			}

			// @ts-ignore
			Swal.fire({
				toast: true,
				title: title,
				icon: icon,
				width: "250px",
				showConfirmButton: false,
				timer: show_hands_duration_ms,
				timerProgressBar: true,
			});
			setTimeout(() => {
				local_game.state = GameState.Reset;
			}, show_hands_duration_ms);
		}
	}
);

// Computed
const hideDealerCards = computed(() => {
	return ![GameState.DealerTurn, GameState.Showdown, GameState.ShowingHands].includes(
		game.value.state
	);
});
const canPlayerAct = computed(() => {
	return game.value.state === GameState.PlayerTurn;
});

function clickedHit() {
	const local_game = game.value;

	// TODO: Verify player actually can hit.
	local_game.player_hand.addCards(local_game.drawCards(1));
	const handScore = local_game.player_hand.getScore();

	// See if we busted.
	if (handScore > 21) {
		local_game.state = GameState.ShowingHands;
	}

	updateHandScoreDisplay();
}

function clickedStand() {
	game.value.state = GameState.DealerTurn;
}

// Assumes hands have cards.
function updateHandScoreDisplay() {
	user_score_display = game.value.player_hand.getScore().toString();

	if (hideDealerCards.value) {
		dealer_score_display = game.value.dealer_hand.cards[0].value.toString() + "?";
	} else {
		dealer_score_display = game.value.dealer_hand.getScore().toString();
	}
}

function updateRunningCountDisplay() {
	running_count_discarded_display = game.value.getRunningCountDiscarded().toString();
}

// Shuffle the deck initially, then start the game.
game.value.shuffle();
game.value.state = GameState.Reset;
</script>

<template>
	<!--
        Plan for this template.
        - Top left: Shows discard pile and count.
        - Top right: Shows draw pile and count.
    -->

	<div class="game-container playingCards">
		<div class="running-count">
			Running Count (discarded): {{ running_count_discarded_display }}
		</div>
		<!-- Card piles. TODO: Add backs of playing cards. -->
		<div class="card-pile discard-pile-count">Discarded: {{ game.discard_pile.length }}</div>
		<div class="card-pile draw-pile-count">
			<!-- There is a problem right now with the deck, when it's too big. -->
			<!-- <Card v-for="card in game.draw_pile" :key="card.id" :card="card" :face-down="true" /> -->
			Drawing:
			{{ game.draw_pile.length }}
		</div>

		<div class="score-display score-display-dealer">
			Dealer Score: {{ dealer_score_display }}
		</div>
		<ul class="hand-container hand" v-if="game.dealer_hand.cards.length">
			<Card
				v-for="(card, i) in game.dealer_hand.cards"
				:key="card.id"
				:card="card"
				:face-down="i >= 1 && hideDealerCards"
			/>
		</ul>

		<ul class="hand-container hand" v-if="game.player_hand.cards.length">
			<Card
				v-for="card in game.player_hand.cards"
				:key="card.id"
				:card="card"
				:face-down="false"
			/>
		</ul>
		<div class="score-display score-display-user">Player Score: {{ user_score_display }}</div>

		<div class="user-control-container">
			<button class="primary" @click="clickedHit()" :disabled="!canPlayerAct">Hit</button>
			<button class="default" @click="clickedStand()" :disabled="!canPlayerAct">Stand</button>
		</div>
	</div>
</template>

<style scoped>
.game-container {
	outline: solid black;
	width: 1000px;
	height: 600px;
	position: relative;
}
.card-pile {
	width: 100px;
	height: 150px;
	outline: solid yellow;
	display: inline-block;
	position: absolute;
}
.discard-pile-count {
	left: 0;
}
.draw-pile-count {
	right: 0;
}

.hand-container {
	position: absolute;
	width: 600px;
	height: 150px;
	top: 140px;
	left: 200px;
}

.user-control-container {
	position: relative;
	top: 150px;
}

.score-display {
	position: absolute;
	width: 100px;
	left: 200px;
}
.score-display-user {
	bottom: 80px;
}
.score-display-dealer {
	top: 50px;
}

.running-count {
	position: absolute;
	/* outline: solid gold; */
	width: 200px;
	left: 400px;
}

/* Consider using these styles with a transition group. */
.card-moving {
	transition: transform 0.5s ease-out, opacity 0.5s ease-out;
	opacity: 0;
}

.card-moving-enter-active,
.card-moving-leave-active {
	transition: transform 0.5s ease-out, opacity 0.5s ease-out;
}

.card-moving-enter,
.card-moving-leave-to {
	transform: scale(0.5) translateY(-50px);
	opacity: 0;
}
</style>
