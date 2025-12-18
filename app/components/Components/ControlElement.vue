<script setup lang="ts">
type ControlSize = "sm" | "md" | "lg";
type AppearanceMode = "control" | "minimal";

export interface ControlProps {
  size?: ControlSize;
  appearance?: AppearanceMode;
}

withDefaults(defineProps<ControlProps>(), {
  size: "md",
  appearance: "control",
});
</script>

<template>
  <div class="control" :data-size="size" :data-appearance="appearance">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.control {
  --control-font-size: var(--text-md);
  --control-padding-y: 0.5em;
  --control-padding-x: 0.75em;

  font-size: var(--control-font-size);
  line-height: 1.2;
}

.control[data-size="sm"] {
  --control-font-size: var(--text-sm);
  --control-padding-y: 0.4em;
  --control-padding-x: 0.6em;
}

.control[data-size="lg"] {
  --control-font-size: var(--text-lg);
  --control-padding-y: 0.6em;
  --control-padding-x: 0.9em;
}

.control {
  display: inline-flex;
  align-items: center;
}

.control[data-appearance="minimal"] {
  --control-padding-y: 0;
  --control-padding-x: 0;
}

.control :deep(> *) {
  width: inherit;
  font-size: inherit;
  padding: var(--control-padding-y) var(--control-padding-x);
}

.control:focus-within {
  border-radius: var(--radius-sm);
  outline: none;
  box-shadow: 0 0 0 var(--focus-ring-width) var(--color-accent-soft);
}
</style>
