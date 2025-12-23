<script setup lang="ts">
interface Props {
  label: string;
  variant?: "minimal" | "card";
}

withDefaults(defineProps<Props>(), {
  variant: "minimal",
});
</script>

<template>
  <div class="meta-card" :data-variant="variant">
    <span class="meta-card__label">{{ label }}</span>
    <span class="meta-card__value">
      <slot />
    </span>
  </div>
</template>

<style scoped>
.meta-card {
  display: flex;
  gap: var(--space-1);
  align-items: center;
}

.meta-card[data-variant="card"] {
  padding: var(--space-4);
  background: var(--bg-surface);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  flex-direction: column;
}

.meta-card__label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-weight: 500;
}

.meta-card__value {
  font-size: var(--text-md);
  color: var(--text-primary);
  font-weight: 600;
}
</style>
