import { ref, onMounted, onUnmounted, watch, type Ref } from "vue";

interface UseVerticalSnapScrollOptions {
  enabled: Ref<boolean>;
  swipeThreshold?: number;
  lockDuration?: number;
}

export function useVerticalSnapScroll(options: UseVerticalSnapScrollOptions) {
  const { enabled, swipeThreshold = 40, lockDuration = 500 } = options;

  const containerRef = ref<HTMLElement | null>(null);
  const sections: HTMLElement[] = [];

  const activeIndex = ref(0);
  let isAnimating = false;
  let touchStartY = 0;

  // Update overflow based on enabled state
  function updateOverflow() {
    if (!containerRef.value) return;

    if (enabled.value) {
      // Snap scroll enabled - disable natural scroll
      containerRef.value.style.overflowY = "hidden";
    } else {
      // Snap scroll disabled - enable natural scroll
      containerRef.value.style.overflowY = "auto";
    }
  }

  // Watch enabled state and toggle overflow
  watch(enabled, updateOverflow);

  // Watch containerRef and apply overflow when it becomes available
  watch(containerRef, updateOverflow);

  function registerSection(el: Element | ComponentPublicInstance | null) {
    if (el instanceof HTMLElement) {
      // Avoid duplicates - check if element already registered
      if (!sections.includes(el)) {
        sections.push(el);
      }
    }
  }

  function scrollTo(index: number) {
    if (isAnimating) return;

    // Filter out disconnected elements (from previous renders)
    const connectedSections = sections.filter((s) => s.isConnected);
    const el = connectedSections[index];
    if (!el) return;

    isAnimating = true;
    activeIndex.value = index;

    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setTimeout(() => {
      isAnimating = false;
    }, lockDuration);
  }

  function onWheel(e: WheelEvent) {
    if (!enabled.value || isAnimating) return;

    const absX = Math.abs(e.deltaX);
    const absY = Math.abs(e.deltaY);

    // ignore horizontal or weak gestures
    if (absX > absY || absY < 10) return;

    e.preventDefault();

    // Use connected sections for bounds checking
    const connectedSections = sections.filter((s) => s.isConnected);

    if (e.deltaY > 0 && activeIndex.value < connectedSections.length - 1) {
      scrollTo(activeIndex.value + 1);
    }

    if (e.deltaY < 0 && activeIndex.value > 0) {
      scrollTo(activeIndex.value - 1);
    }
  }

  function onTouchStart(e: TouchEvent) {
    if (!enabled.value || !e.touches[0]) return;
    touchStartY = e.touches[0].clientY;
  }

  function onTouchEnd(e: TouchEvent) {
    if (!enabled.value || isAnimating || !e.changedTouches[0]) return;

    const delta = e.changedTouches[0].clientY - touchStartY;

    // Use connected sections for bounds checking
    const connectedSections = sections.filter((s) => s.isConnected);

    if (
      delta < -swipeThreshold &&
      activeIndex.value < connectedSections.length - 1
    ) {
      scrollTo(activeIndex.value + 1);
    }

    if (delta > swipeThreshold && activeIndex.value > 0) {
      scrollTo(activeIndex.value - 1);
    }
  }

  onMounted(() => {
    containerRef.value?.addEventListener("wheel", onWheel, {
      passive: false,
    });
  });

  onUnmounted(() => {
    containerRef.value?.removeEventListener("wheel", onWheel);
    // Clear sections to prevent memory leaks
    sections.length = 0;
  });

  return {
    containerRef,
    registerSection,
    activeIndex,
    onTouchStart,
    onTouchEnd,
  };
}
