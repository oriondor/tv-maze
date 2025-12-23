<script setup lang="ts">
import type { ControlProps } from "./ControlElement.vue";

interface Props extends ControlProps {
  type?: "text" | "email" | "password" | "number" | "search";
  placeholder?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  appearance: "control",
});

const modelValue = defineModel<string | number>();
const attrs = useAttrs();

const inputProps = computed(() => {
  const { size, appearance, ...rest } = props;
  return rest;
});
</script>

<template>
  <base-control-element v-bind="props">
    <input
      class="input"
      v-model="modelValue"
      v-bind="{ ...attrs, ...inputProps }"
    />
  </base-control-element>
</template>

<style scoped>
.input {
  width: 100%;

  font-family: inherit;
  font-weight: 400;

  color: var(--text-primary);
  background: var(--input-bg);

  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);

  outline: none;
  transition: all var(--transition-base);
}

.input::placeholder {
  color: var(--input-placeholder);
}

.input:focus {
  background: var(--input-bg-focus);
  border-color: var(--color-accent);
}

.input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input:hover:not(:disabled):not(:focus) {
  border-color: var(--text-muted);
}
</style>
