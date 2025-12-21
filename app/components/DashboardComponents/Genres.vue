<script setup lang="ts">
const isOpen = ref(false);

function toggle() {
  isOpen.value = !isOpen.value;
}

const genres = ref(Array.from({ length: 100 }, (_, index) => index));
const selectedGenre = ref<string | null>(null);

function selectGenre(item: string) {
  selectedGenre.value = item;
}

const { shows } = useShows();
</script>

<template>
  <button class="genres-toggle" @click="toggle" aria-label="Toggle genres">
    ☰
  </button>

  <aside class="genres-wrapper" :class="{ open: isOpen }">
    Pick a genre
    <base-vertical-list :items="genres">
      <template #item="{ item }">
        <base-switch-button
          size="lg"
          :model-value="selectedGenre === item"
          @update:model-value="selectGenre(item)"
        >
          {{ item }}
        </base-switch-button>
      </template>
    </base-vertical-list>
  </aside>

  <div class="genres-backdrop" v-if="isOpen" @click="isOpen = false" />
</template>

<style scoped lang="scss">
.genres-wrapper {
  width: 25rem;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: var(--space-5);
  background: color-mix(
    in srgb,
    var(--bg-surface-elevated) 60%,
    transparent 40%
  );
  overflow: auto;
}

@media (max-width: 768px) {
  .genres-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 50;

    transform: translateX(-100%);
    transition: transform var(--transition-base);
    will-change: transform;
  }

  .genres-wrapper.open {
    transform: translateX(0);
  }
}

.genres-toggle {
  display: none;
}

@media (max-width: 768px) {
  .genres-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: var(--text-2xl);

    position: fixed;
    bottom: var(--space-4);
    right: var(--space-4);
    z-index: 60;

    width: 5rem;
    height: 5rem;

    border-radius: 50%;
    background: var(--bg-surface);
    color: var(--text-primary);
    box-shadow: var(--shadow-lg);
  }
  .genres-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 40;
  }
}
</style>
