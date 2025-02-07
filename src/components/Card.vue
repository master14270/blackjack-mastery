<script setup lang="ts">
import { computed } from "vue";
import { Card, CardType, Suit } from "../classes/card.ts";

const props = defineProps<{ card: Card; faceDown: boolean }>();

const cardSuit = computed(() => {
	if (props.card.suit === Suit.Heart) {
		return "hearts";
	} else if (props.card.suit === Suit.Diamond) {
		return "diams";
	} else if (props.card.suit === Suit.Club) {
		return "clubs";
	} else if (props.card.suit === Suit.Spade) {
		return "spades";
	} else {
		throw Error("Unexpected card suit. Cannot proceed.");
	}
});
const cardRank = computed(() => {
	if (props.card.card_type === CardType.Standard) {
		return props.card.value.toString();
	} else if (props.card.card_type === CardType.Ace) {
		return "a";
	} else if (props.card.card_type === CardType.King) {
		return "k";
	} else if (props.card.card_type === CardType.Queen) {
		return "q";
	} else if (props.card.card_type === CardType.Jack) {
		return "j";
	} else {
		throw Error("Unexpected card rank.");
	}
});
</script>

<template>
	<li>
		<div class="card" :class="[faceDown ? 'back' : `rank-${cardRank} ${cardSuit}`]">
			<template v-if="!faceDown">
				<span class="rank">{{ cardRank.toUpperCase() }}</span>
				<span class="suit" v-html="'&' + cardSuit + ';'"></span>
			</template>
			<template v-else> * </template>
		</div>
	</li>
</template>

<style scoped></style>
