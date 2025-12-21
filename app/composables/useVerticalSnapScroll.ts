import { ref, onMounted, onUnmounted, type Ref } from "vue";

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

  function registerSection(el: Element | ComponentPublicInstance | null) {
    if (el instanceof HTMLElement) {
      sections.push(el);
    }
  }

  function scrollTo(index: number) {
    if (isAnimating) return;
    const el = sections[index];
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

    if (e.deltaY > 0 && activeIndex.value < sections.length - 1) {
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

    if (delta < -swipeThreshold && activeIndex.value < sections.length - 1) {
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
  });

  return {
    containerRef,
    registerSection,
    activeIndex,
    onTouchStart,
    onTouchEnd,
  };
}
