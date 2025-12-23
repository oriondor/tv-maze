<script setup lang="ts">
interface Props {
  size?: "sm" | "lg" | "auto";
  show: Show;
}
const props = withDefaults(defineProps<Props>(), {
  size: "lg",
});

const isOverlayVisible = ref(false);

// Strip HTML tags from summary for safe display
const cleanSummary = computed(() => {
  if (!props.show.summary) return "";

  // Create a temporary element to parse HTML and extract text only
  const temp = document.createElement("div");
  temp.innerHTML = props.show.summary;
  return temp.textContent || temp.innerText || "";
});

function toggleOverlay(e: Event) {
  // On mobile, toggle overlay visibility
  if (window.innerWidth <= 768) {
    if (!isOverlayVisible.value) {
      e.preventDefault();
      isOverlayVisible.value = true;
    }
    // If overlay is visible, let the click through to the NuxtLink
  }
}
</script>

<template>
  <div
    class="show-card"
    :class="{ 'overlay-visible': isOverlayVisible }"
    :data-size="size"
    @click="toggleOverlay"
  >
    <div class="show-card__media">
      <img v-if="show.image" :src="show.image.medium" :alt="show.name" />
    </div>

    <NuxtLink :to="`/show/${show.id}`" class="show-card__overlay">
      <p class="overlay-text">{{ cleanSummary }}</p>
    </NuxtLink>

    <div class="show-card__content">
      <h3 class="show-card__title">{{ show.name }}</h3>

      <div class="show-card__meta">
        <MetaCard v-if="show.rating?.average" label="Rating">
          <Rating :value="show.rating.average" />
        </MetaCard>

        <MetaCard v-if="show.status" label="Status">
          {{ show.status }}
        </MetaCard>

        <MetaCard v-if="show.runtime" label="Runtime">
          {{ show.runtime }} min
        </MetaCard>

        <MetaCard v-if="show.language" label="Language">
          {{ show.language }}
        </MetaCard>
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
  text-decoration: none;
  color: inherit;
  transition: transform var(--transition-base),
    box-shadow var(--transition-base), background-color var(--transition-base);
}

.show-card[data-size="lg"] {
  width: clamp(400px, 80vw, 600px);
  height: 250px;
}

.show-card[data-size="sm"] {
  width: clamp(300px, 60vw, 450px);
  height: 200px;
}

.show-card[data-size="auto"] {
  width: 100%;
  height: 200px;
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

.show-card__overlay {
  position: absolute;
  inset: 0;
  z-index: 2;

  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);

  background: color-mix(
    in srgb,
    var(--bg-surface-elevated) 60%,
    transparent 40%
  );
  backdrop-filter: blur(8px);
  text-decoration: none;

  opacity: 0;
  transform: translateY(8px);

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
