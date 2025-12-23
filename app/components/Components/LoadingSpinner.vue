<script setup lang="ts">
type LoadingSize = "sm" | "md" | "lg";

interface Props {
  size?: LoadingSize;
}

withDefaults(defineProps<Props>(), {
  size: "md",
});
</script>

<template>
  <div class="loading">
    <svg class="spinner" :data-size="size" viewBox="0 0 50 50">
      <circle
        class="spinner-path"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke-width="4"
      />
    </svg>
  </div>
</template>

<style scoped>
.loading {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  animation: rotate 2s linear infinite;
}

.spinner[data-size="sm"] {
  width: 32px;
  height: 32px;
}

.spinner[data-size="md"] {
  width: 48px;
  height: 48px;
}

.spinner[data-size="lg"] {
  width: 64px;
  height: 64px;
}

.spinner-path {
  stroke: var(--color-accent);
  stroke-linecap: round;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
</style>
