import { useColorMode, useTimeoutFn } from "@vueuse/core";
/**
 * Simply sets dashboard mode to dark or light depending on time of the day
 * @returns current mode
 */

export function useTheme() {
  const mode = useColorMode({
    attribute: "data-mode",
    initialValue: "auto",
  });

  function autoMode(date = new Date()): "light" | "dark" {
    const h = date.getHours();
    return h >= 7 && h < 19 ? "light" : "dark";
  }

  function msToNextSwitch() {
    const now = new Date();
    const next = new Date(now);

    if (autoMode(now) === "light") {
      next.setHours(19, 0, 0, 0);
    } else {
      next.setHours(7, 0, 0, 0);
      if (now.getHours() >= 19) next.setDate(next.getDate() + 1);
    }

    return next.getTime() - now.getTime();
  }

  function schedule() {
    mode.value = autoMode();

    useTimeoutFn(schedule, msToNextSwitch());
  }

  schedule();

  return { mode };
}
