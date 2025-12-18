<script setup lang="ts">
type Primitive = string | number;

type Item<T> = T | Primitive;

interface Props<T = unknown> {
  items: Item<T>[];
  keyAttribute?: string;
}

function isPrimitive(value: unknown): value is Primitive {
  return typeof value === "string" || typeof value === "number";
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

const props = withDefaults(defineProps<Props>(), {
  keyAttribute: "id",
});

function getKey(item: unknown, index: number): string | number {
  if (isPrimitive(item)) {
    return item;
  }

  if (isObject(item) && props.keyAttribute && props.keyAttribute in item) {
    return item[props.keyAttribute] as string | number;
  }

  return index;
}
</script>

<template>
  <div class="list">
    <template v-for="(item, index) in items" :key="getKey(item, index)">
      <slot name="item" :item :index>
        <base-list-item component="div">
          {{ item }}
        </base-list-item>
      </slot>
    </template>
  </div>
</template>

<style scoped lang="scss">
.list {
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  width: 100%;
  gap: 0.25rem;

  & > * {
    width: 100%;
  }
}
</style>
