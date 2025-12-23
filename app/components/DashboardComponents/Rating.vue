<script setup lang="ts">
interface Props {
  value: number | null;
}

defineProps<Props>();
</script>

<template>
  <div v-if="value" class="rating">
    <span class="rating__star">⭐</span>
    <span class="rating__value">{{ value }}</span>
    <span class="rating__label">/10</span>
  </div>
</template>

<style scoped>
.rating {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.rating__star {
  font-size: var(--text-xl);
}

.rating__value {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--text-primary);
}

.rating__label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}
</style>
