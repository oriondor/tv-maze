<script setup lang="ts">
interface Props {
  variant?: "primary" | "secondary";
  as?: "button" | "a";
}

withDefaults(defineProps<Props>(), {
  variant: "primary",
  as: "button",
});

const attrs = useAttrs();
</script>

<template>
  <component :is="as" class="button" :data-variant="variant" v-bind="attrs">
    <slot />
  </component>
</template>

<style scoped>
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: var(--text-md);
  text-decoration: none;
  transition: all var(--transition-base);
  cursor: pointer;
  border: none;
  font-family: inherit;
}

.button[data-variant="primary"] {
  background: var(--color-accent);
  color: white;
}

.button[data-variant="primary"]:hover {
  background: var(--color-accent-hover);
}

.button[data-variant="secondary"] {
  background: var(--bg-surface-elevated);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.button[data-variant="secondary"]:hover {
  background: var(--hover-overlay);
  border-color: var(--border-color);
}
</style>
