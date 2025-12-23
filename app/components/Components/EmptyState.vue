<script setup lang="ts">
interface Props {
  title?: string;
  description?: string;
}
defineProps<Props>();
</script>
<template>
  <div class="empty-state">
    <slot name="title">
      <h1>{{ title }}</h1>
    </slot>
    <slot name="description">
      <p>
        <slot name="description-text">
          {{ description }}
        </slot>
      </p>
      <slot name="description-addon" />
    </slot>
  </div>
</template>
<style scoped lang="scss">
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  text-align: center;
  padding: var(--space-4);

  h1 {
    font-size: var(--text-2xl);
    margin: 0;
  }

  p {
    color: var(--text-secondary);
    margin: 0;
  }
}
</style>
