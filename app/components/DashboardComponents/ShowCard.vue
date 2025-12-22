<script setup lang="ts">
interface Props {
  size?: "sm" | "lg";
  show: Show;
}
withDefaults(defineProps<Props>(), {
  size: "lg",
});
</script>

<template>
  <div class="show-card" :data-size="size">
    <div class="show-card__media">
      <img :src="show.image.medium" />
    </div>

    <div class="show-card__overlay">
      {{ show.summary }}
    </div>

    <div class="show-card__content">
      {{ show.name }}
    </div>
  </div>
</template>

<style scoped>
.show-card {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  background: var(--bg-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-subtle);

  cursor: pointer;
  transition: transform var(--transition-base),
    box-shadow var(--transition-base), background-color var(--transition-base);
}

.show-card[data-size="lg"] {
  width: clamp(280px, 80vw, 500px);
}

.show-card[data-size="sm"] {
  width: clamp(180px, 60vw, 250px);
}

.show-card__media {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  background: var(--bg-surface-elevated);
  overflow: hidden;
}

.show-card__media :slotted(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.show-card__content {
  padding: var(--space-1);
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: bold;
}

.show-card__overlay {
  position: absolute;
  inset: 0;
  z-index: 2;

  display: flex;
  align-items: center;
  justify-content: center;

  background: linear-gradient(
    to top,
    rgba(2, 8, 58, 0.65),
    rgba(14, 24, 52, 0.15),
    transparent
  );

  opacity: 0;
  transform: translateY(8px);
  pointer-events: none;

  transition: opacity var(--transition-base), transform var(--transition-base);
}

.show-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.show-card:hover .show-card__overlay {
  opacity: 1;
  transform: translateY(0);
}

.show-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--hover-overlay);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.show-card:hover::after {
  opacity: 1;
}
</style>
