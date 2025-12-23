<script setup lang="ts">
import type { ControlProps } from "./ControlElement.vue";

interface Props extends ControlProps {
  as?: "div" | "button";
}
const props = withDefaults(defineProps<Props>(), {
  as: "button",
  appearance: "control",
});

const attrs = useAttrs();

const componentProps = computed(() => {
  if (props.as === "button") {
    return {
      type: "button",
    };
  }
  return {
    tabindex: 0,
    role: "button",
  };
});
</script>

<template>
  <base-control-element v-bind="props">
    <component
      :is="as"
      class="list-item"
      v-bind="{ ...componentProps, ...attrs }"
    >
      <slot />
    </component>
  </base-control-element>
</template>

<style scoped lang="scss">
.list-item {
  border-radius: var(--radius-sm);
  background: transparent;

  &:hover {
    background: var(--bg-surface-elevated);
  }
}
</style>
