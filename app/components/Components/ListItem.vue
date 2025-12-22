<script setup lang="ts">
import type { ControlProps } from "./ControlElement.vue";

interface Props extends ControlProps {
  component?: "div" | "button";
}
const props = withDefaults(defineProps<Props>(), {
  component: "button",
  appearance: "control",
});

const attrs = useAttrs();

const componentProps = computed(() => {
  if (props.component === "button") {
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
      :is="component"
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
