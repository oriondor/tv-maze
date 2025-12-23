import { describe, it, expect } from "vitest";
import { sortByRating } from "../sortByRating";
import type { Show } from "../../types/Show";

const createMockShow = (
  id: number,
  name: string,
  rating: number | null
): Show => ({
  id,
  name,
  genres: [],
  rating: { average: rating },
  image: { medium: "", original: "" },
  summary: "",
});

describe("sortByRating", () => {
  it("should sort shows by rating in descending order", () => {
    const shows: Show[] = [
      createMockShow(1, "Low", 5.0),
      createMockShow(2, "High", 9.5),
      createMockShow(3, "Medium", 7.5),
    ];

    const result = sortByRating(shows);

    expect(result[0].id).toBe(2); // 9.5
    expect(result[1].id).toBe(3); // 7.5
    expect(result[2].id).toBe(1); // 5.0
  });

  it("should handle null ratings as 0", () => {
    const shows: Show[] = [
      createMockShow(1, "No Rating", null),
      createMockShow(2, "With Rating", 7.0),
    ];

    const result = sortByRating(shows);

    expect(result[0].id).toBe(2); // 7.0 comes first
    expect(result[1].id).toBe(1); // null treated as 0
  });

  it("should handle all null ratings", () => {
    const shows: Show[] = [
      createMockShow(1, "Show 1", null),
      createMockShow(2, "Show 2", null),
      createMockShow(3, "Show 3", null),
    ];

    const result = sortByRating(shows);

    expect(result).toHaveLength(3);
    // Order should be preserved when all ratings are equal (null = 0)
  });

  it("should handle empty array", () => {
    const shows: Show[] = [];

    const result = sortByRating(shows);

    expect(result).toEqual([]);
  });

  it("should not mutate the original array", () => {
    const shows: Show[] = [
      createMockShow(1, "Low", 5.0),
      createMockShow(2, "High", 9.5),
    ];
    const originalOrder = [...shows];

    const result = sortByRating(shows);

    expect(shows).toEqual(originalOrder); // Original unchanged
    expect(result).not.toBe(shows); // New array returned
  });

  it("should handle shows with same rating", () => {
    const shows: Show[] = [
      createMockShow(1, "Show 1", 8.0),
      createMockShow(2, "Show 2", 8.0),
      createMockShow(3, "Show 3", 8.0),
    ];

    const result = sortByRating(shows);

    expect(result).toHaveLength(3);
    expect(result.every((show) => show.rating.average === 8.0)).toBe(true);
  });

  it("should handle decimal ratings correctly", () => {
    const shows: Show[] = [
      createMockShow(1, "Show 1", 8.45),
      createMockShow(2, "Show 2", 8.5),
      createMockShow(3, "Show 3", 8.4),
    ];

    const result = sortByRating(shows);

    expect(result[0].rating.average).toBe(8.5);
    expect(result[1].rating.average).toBe(8.45);
    expect(result[2].rating.average).toBe(8.4);
  });
});
