<script setup lang="ts">
import type { ControlProps } from "./ControlElement.vue";

interface Props extends ControlProps {
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  appearance: "control",
});

const attrs = useAttrs();

const modelValue = defineModel<boolean>({ default: false });

function toggle() {
  if (props.disabled) return;
  modelValue.value = !modelValue.value;
}
</script>

<template>
  <base-control-element v-bind="props">
    <button
      class="switch-button"
      :class="{ 'is-active': modelValue, 'is-disabled': disabled }"
      v-bind="attrs"
      @click="toggle"
      @keydown.enter.prevent="toggle"
      @keydown.space.prevent="toggle"
    >
      <slot />
    </button>
  </base-control-element>
</template>

<style scoped lang="scss">
.switch-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  border-radius: var(--radius-sm);

  background: var(--bg-surface);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);

  cursor: pointer;
  user-select: none;

  transition: background var(--transition-fast), color var(--transition-fast),
    border-color var(--transition-fast);

  &:hover {
    background: var(--bg-surface-elevated);
  }

  &:focus-visible {
    outline: var(--focus-ring-width) solid var(--color-accent);
    outline-offset: 2px;
  }

  &.is-active {
    background: var(--color-accent-soft);
    color: var(--text-primary);
    border-color: var(--color-accent);
  }

  &.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
