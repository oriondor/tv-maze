<script setup lang="ts">
import { useWindowSize } from "@vueuse/core";

interface Props {
  shows: Show[] | null;
}

const props = defineProps<Props>();

const { shows } = toRefs(props);

const { height } = useWindowSize();
const isCompactMode = computed(() => height.value > 470 && height.value < 1030);

const isSearchOpen = ref(false);

const { containerRef, registerSection, onTouchStart, onTouchEnd } =
  useVerticalSnapScroll({
    enabled: computed(() => isCompactMode.value && !isSearchOpen.value),
  });

const ratingThreshold = 8;

const sortedByRating = computed(() => {
  const top: Show[] = [];
  const other: Show[] = [];

  if (!shows.value) return { top, other };

  for (const show of shows.value) {
    const rating = show.rating?.average ?? 0;
    (rating >= ratingThreshold ? top : other).push(show);
  }

  const byRatingDesc = (a: Show, b: Show) =>
    (b.rating?.average ?? 0) - (a.rating?.average ?? 0);

  top.sort(byRatingDesc);
  other.sort(byRatingDesc);

  return { top, other };
});
</script>

<template>
  <div
    ref="containerRef"
    class="shows-shell"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <section :ref="registerSection">
      <div class="top-navigation">
        <h1>Top rated shows</h1>
        <Search v-model="isSearchOpen" />
      </div>
      <div class="shows-top">
        <show-card v-for="show in sortedByRating.top" :key="show.id" :show />
      </div>
    </section>
    <section :ref="registerSection">
      <h3>Other shows</h3>
      <div class="shows-bottom">
        <show-card
          v-for="show in sortedByRating.other"
          :key="show.id"
          :show
          size="sm"
        />
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.shows-shell {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-2);
  padding-inline: var(--space-2);

  .top-navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.shows-top,
.shows-bottom {
  flex: 0 0 auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.shows-top::-webkit-scrollbar,
.shows-bottom::-webkit-scrollbar {
  display: none;
}

.shows-top {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;

  gap: var(--space-1);
  overflow-x: auto;
  overflow-y: hidden;

  scroll-snap-type: x proximity;
  -webkit-overflow-scrolling: touch;
  padding-bottom: var(--space-2);
}

.shows-bottom {
  display: grid;

  grid-template-rows: repeat(2, auto);

  grid-auto-flow: column;
  grid-auto-columns: max-content;

  gap: var(--space-2);
  overflow-x: auto;
  overflow-y: hidden;

  padding-bottom: var(--space-2);
  -webkit-overflow-scrolling: touch;
}

.shows-top > *,
.shows-bottom > * {
  scroll-snap-align: start;
}
</style>
