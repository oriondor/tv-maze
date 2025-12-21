<script setup lang="ts">
import { useWindowSize } from "@vueuse/core";

const { height } = useWindowSize();
const isCompactMode = computed(() => height.value < 900);

const { containerRef, registerSection, onTouchStart, onTouchEnd } =
  useVerticalSnapScroll({
    enabled: isCompactMode,
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
      <h1>Top rated shows</h1>
      <div class="shows-top">
        <show-card v-for="n in 10" :key="n">
          Show {{ n }}
          <template #overlay>Top show</template>
        </show-card>
      </div>
    </section>
    <section :ref="registerSection">
      <h3>Other shows</h3>
      <div class="shows-bottom">
        <show-card v-for="n in 20" :key="n" size="sm">
          Show {{ n }}
          <template #overlay>Details</template>
        </show-card>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.shows-shell {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-2);
  padding-inline: var(--space-2);
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
