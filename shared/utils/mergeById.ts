import type { Show, ShowById } from "../types/Show";

// Silently merge new shows into a given target
export function mergeById(target: ShowById, incoming: Show[]): ShowById {
  for (const item of incoming) {
    target[item.id] = item;
  }
  return target;
}
