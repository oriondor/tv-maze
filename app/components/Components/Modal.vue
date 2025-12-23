<script setup lang="ts">
const isOpen = defineModel<boolean>({ required: true });
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-container">
        <div class="backdrop" @click="isOpen = false" />
        <div class="modal-wrapper" @wheel.stop @touchstart.stop @touchmove.stop>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-container {
  position: fixed;
  inset: 0;
  z-index: 40;
}

.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 40;
}

.modal-wrapper {
  position: fixed;
  top: var(--space-8);
  left: 50%;
  z-index: 50;
  transform: translate(-50%, 0);

  width: 90%;
  max-width: 40rem;
  max-height: 90vh;
  overflow: auto;
  overscroll-behavior: contain;

  background: var(--bg-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);

  transition: transform var(--transition-base);
  will-change: transform;
}

/* Modal transition */
.modal-enter-active .backdrop,
.modal-leave-active .backdrop {
  transition: opacity var(--transition-base);
}

.modal-enter-from .backdrop,
.modal-leave-to .backdrop {
  opacity: 0;
}

.modal-enter-from .modal-wrapper {
  transform: translate(-50%, -150%);
}

.modal-enter-to .modal-wrapper,
.modal-leave-from .modal-wrapper {
  transform: translate(0-50% 0);
}

.modal-leave-to .modal-wrapper {
  transform: translate(-50%, -150%);
}
</style>
