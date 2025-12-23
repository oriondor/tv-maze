<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";

const isOpen = defineModel<boolean>({ default: false });
const loading = ref(false);
const items = ref<Show[]>([]);

const search = ref("");

const searchShows = useDeduped(async (signal, query: string) => {
  return await useApi<Show[]>(`/api/search?query=${query}`, {
    signal,
  });
});

const debouncedSearch = useDebounceFn(
  async (query: string) => await searchShows(query),
  500
);

watch(search, async () => {
  loading.value = true;
  items.value = await debouncedSearch(search.value);
  loading.value = false;
});
</script>

<template>
  <span class="start-search" @click="isOpen = true">🔍</span>
  <base-modal v-model="isOpen">
    <div class="input-wrapper">
      <base-input v-model="search" placeholder="Search for any show" />
    </div>
    <div class="search-results">
      <base-loading-spinner v-if="loading" />
      <base-vertical-list v-else-if="items?.length" class="search-list" :items>
        <template #item="{ item: show }">
          <ShowCard :show size="auto" />
        </template>
      </base-vertical-list>
      <base-empty-state
        v-else-if="search"
        title="Nothing found"
        description="Try different search"
      />
    </div>
  </base-modal>
</template>

<style scoped>
.start-search {
  cursor: pointer;
  font-size: var(--text-2xl);
}

.input-wrapper {
  position: sticky;
  top: 0;
  background: var(--bg-surface);
  display: flex;
  flex-direction: column;
  padding: var(--space-6);
  z-index: 50;
}

.search-results {
  padding: var(--space-6);
  padding-block-start: 0;
}
</style>
