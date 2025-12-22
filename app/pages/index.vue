<script setup lang="ts">
const { shows, genres } = useShows();

const selectedGenre = ref<string | null>(null);

const groupedShows = computed(() => {
  if (!selectedGenre.value) return null;
  return getPerGenre(Object.values(shows.value), selectedGenre.value);
});
</script>

<template>
  <div class="page">
    <Genres v-model="selectedGenre" :genres />
    <Shows :shows="groupedShows" />
  </div>
</template>

<style scoped lang="scss">
.page {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
}
</style>
