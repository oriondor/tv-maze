<script setup lang="ts">
interface Props {
  variant?: "primary" | "alert" | "brand";
}

withDefaults(defineProps<Props>(), {
  variant: "primary",
});
</script>

<template>
  <span class="badge" :data-variant="variant">
    <slot />
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  font-weight: 600;
  white-space: nowrap;
}

.badge[data-variant="primary"] {
  background: var(--bg-surface-elevated);
  color: var(--text-secondary);
}

.badge[data-variant="brand"] {
  background: var(--color-accent-soft);
  color: var(--color-accent);
}

.badge[data-variant="alert"] {
  background: rgba(239, 68, 68, 0.2);
  color: rgb(239, 68, 68);
}
</style>
