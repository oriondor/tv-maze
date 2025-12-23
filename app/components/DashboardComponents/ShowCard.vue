<script setup lang="ts">
interface Props {
  size?: "sm" | "lg";
  show: Show;
}
const props = withDefaults(defineProps<Props>(), {
  size: "lg",
});

// Strip HTML tags from summary for safe display
const cleanSummary = computed(() => {
  if (!props.show.summary) return "";

  // Create a temporary element to parse HTML and extract text only
  const temp = document.createElement("div");
  temp.innerHTML = props.show.summary;
  return temp.textContent || temp.innerText || "";
});
</script>

<template>
  <div class="show-card" :data-size="size">
    <div class="show-card__media">
      <img v-if="show.image" :src="show.image.medium" />
    </div>

    <div class="show-card__overlay">
      <p class="overlay-text">{{ cleanSummary }}</p>
    </div>

    <div class="show-card__content">
      <h3 class="show-card__title">{{ show.name }}</h3>

      <div class="show-card__meta">
        <div v-if="show.rating?.average" class="meta-item">
          <span class="meta-label">Rating:</span>
          <span class="meta-value">⭐ {{ show.rating.average }}</span>
        </div>

        <div v-if="show.status" class="meta-item">
          <span class="meta-label">Status:</span>
          <span class="meta-value">{{ show.status }}</span>
        </div>

        <div v-if="show.runtime" class="meta-item">
          <span class="meta-label">Runtime:</span>
          <span class="meta-value">{{ show.runtime }} min</span>
        </div>

        <div v-if="show.language" class="meta-item">
          <span class="meta-label">Language:</span>
          <span class="meta-value">{{ show.language }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.show-card {
  position: relative;
  display: flex;
  flex-direction: row;
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
  width: clamp(400px, 80vw, 600px);
  height: 250px;
}

.show-card[data-size="sm"] {
  width: clamp(300px, 60vw, 450px);
  height: 180px;
}

.show-card__media {
  position: relative;
  flex: 0 0 50%;
  background: var(--bg-surface-elevated);
  overflow: hidden;
}

.show-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.show-card__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: var(--space-3);
  gap: var(--space-2);
  overflow: hidden;
}

.show-card__title {
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: bold;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.show-card__meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-sm);
}

.meta-label {
  color: var(--text-secondary);
  font-weight: 500;
}

.meta-value {
  color: var(--text-primary);
  font-weight: 600;
}

.show-card__overlay {
  position: absolute;
  inset: 0;
  z-index: 2;

  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);

  background: rgba(11, 13, 18, 0.6);
  backdrop-filter: blur(8px);

  opacity: 0;
  transform: translateY(8px);
  pointer-events: none;

  transition: opacity var(--transition-base), transform var(--transition-base);
}

.overlay-text {
  color: var(--text-primary);
  font-size: var(--text-sm);
  line-height: 1.6;
  text-align: center;
  margin: 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
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
