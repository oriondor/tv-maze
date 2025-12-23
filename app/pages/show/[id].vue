<script setup lang="ts">
const route = useRoute();
const showId = computed(() => Number(route.params.id));

// Fetch show data from your cache or API
const { shows } = useShows();
const show = computed(() => shows.value[showId.value]);

// Strip HTML tags from summary
const cleanSummary = computed(() => {
  if (!show.value?.summary) return "";
  const temp = document.createElement("div");
  temp.innerHTML = show.value.summary;
  return temp.textContent || temp.innerText || "";
});

// Format date helper
function formatDate(dateString?: string) {
  if (!dateString) return "Unknown";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Format schedule
const scheduleText = computed(() => {
  if (!show.value?.schedule) return null;
  const { days, time } = show.value.schedule;
  if (!days?.length) return null;
  return `${days.join(", ")} at ${time}`;
});

// Get badge variant based on status
function getStatusVariant(status?: string) {
  if (!status) return "primary";
  if (status === "Running") return "brand";
  if (status === "Ended") return "alert";
  return "primary";
}
</script>

<template>
  <div v-if="show" class="show-page">
    <div class="navigation">
      <base-button @click="navigateTo('/')" variant="secondary">
        👈🏽 To all shows
      </base-button>
    </div>

    <section class="hero">
      <div class="hero__image">
        <img
          v-if="show.image"
          :src="show.image.original || show.image.medium"
          :alt="show.name"
          class="hero__img"
        />
      </div>

      <div class="hero__content">
        <div class="hero__badges">
          <base-badge
            v-if="show.status"
            :variant="getStatusVariant(show.status)"
          >
            {{ show.status }}
          </base-badge>
          <base-badge v-if="show.type">{{ show.type }}</base-badge>
        </div>

        <h1 class="hero__title">{{ show.name }}</h1>

        <div class="hero__meta">
          <Rating :value="show.rating?.average" />

          <div class="meta-divider"></div>

          <div v-if="show.genres?.length" class="genres">
            <base-badge
              v-for="genre in show.genres"
              :key="genre"
              variant="brand"
            >
              {{ genre }}
            </base-badge>
          </div>
        </div>

        <p class="hero__summary">{{ cleanSummary }}</p>

        <div class="hero__actions">
          <base-button
            v-if="show.officialSite"
            as="a"
            :href="show.officialSite"
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
          >
            Official Site
          </base-button>
          <base-button
            v-if="show.externals?.imdb"
            as="a"
            :href="`https://www.imdb.com/title/${show.externals.imdb}`"
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
          >
            IMDb
          </base-button>
        </div>
      </div>
    </section>

    <section class="details">
      <h2 class="section-title">Show Details</h2>

      <div class="details-grid">
        <MetaCard v-if="show.premiered" label="Premiered" variant="card">
          {{ formatDate(show.premiered) }}
        </MetaCard>

        <MetaCard v-if="show.ended" label="Ended" variant="card">
          {{ formatDate(show.ended) }}
        </MetaCard>

        <MetaCard v-if="show.language" label="Language" variant="card">
          {{ show.language }}
        </MetaCard>

        <MetaCard v-if="show.runtime" label="Runtime" variant="card">
          {{ show.runtime }} minutes
        </MetaCard>

        <MetaCard v-if="scheduleText" label="Schedule" variant="card">
          {{ scheduleText }}
        </MetaCard>

        <MetaCard v-if="show.network" label="Network" variant="card">
          {{ show.network.name }}
          <span v-if="show.network.country" class="detail-country">
            ({{ show.network.country.name }})
          </span>
        </MetaCard>

        <MetaCard v-if="show.webChannel" label="Streaming" variant="card">
          {{ show.webChannel.name }}
        </MetaCard>
      </div>
    </section>
  </div>

  <div v-else class="not-found">
    <h1>Show not found</h1>
    <p>The show you're looking for doesn't exist.</p>
    <base-button @click="navigateTo('/')" variant="primary">
      Back to Home
    </base-button>
  </div>
</template>

<style scoped lang="scss">
.show-page {
  min-height: 100vh;
  background: var(--bg-app);
  color: var(--text-primary);
}

.navigation {
  padding: var(--space-4);
  padding-bottom: 0;
}

.hero {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-8);
  padding: var(--space-8);
  background: var(--bg-surface);
  border-radius: var(--radius-xl);
  margin: var(--space-4);
}

@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
  }
}

.hero__image {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--bg-surface-elevated);
  aspect-ratio: 2/3;
  max-height: 800px;
}

.hero__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.hero__badges {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.hero__title {
  font-size: var(--text-2xl);
  font-weight: 700;
  margin: 0;
  font-family: var(--font-display);
}

.hero__meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.meta-divider {
  width: 1px;
  height: 24px;
  background: var(--border-color);
}

.genres {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.hero__summary {
  line-height: 1.7;
  color: var(--text-secondary);
  font-size: var(--text-md);
  margin: 0;
}

.hero__actions {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.details {
  padding: var(--space-8);
  margin: var(--space-4);
}

.section-title {
  font-size: var(--text-xl);
  font-weight: 700;
  margin: 0 0 var(--space-6) 0;
  font-family: var(--font-display);
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-4);
}

.detail-country {
  color: var(--text-muted);
  font-weight: 400;
}

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
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
