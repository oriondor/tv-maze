import { describe, it, expect } from "vitest";
import { getPerGenre } from "../getPerGenre";
import type { Show } from "../../types/Show";

const createMockShow = (id: number, name: string, genres: string[]): Show => ({
  id,
  name,
  genres,
  rating: { average: null },
  image: { medium: "", original: "" },
  summary: "",
});

describe("getPerGenre", () => {
  it("should filter shows by genre", () => {
    const shows: Show[] = [
      createMockShow(1, "Drama Show", ["Drama"]),
      createMockShow(2, "Comedy Show", ["Comedy"]),
      createMockShow(3, "Another Drama", ["Drama"]),
    ];

    const result = getPerGenre(shows, "Drama");

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(1);
    expect(result[1].id).toBe(3);
  });

  it("should return empty array when no shows match genre", () => {
    const shows: Show[] = [
      createMockShow(1, "Drama Show", ["Drama"]),
      createMockShow(2, "Comedy Show", ["Comedy"]),
    ];

    const result = getPerGenre(shows, "Horror");

    expect(result).toEqual([]);
  });

  it("should handle shows with multiple genres", () => {
    const shows: Show[] = [
      createMockShow(1, "Multi-Genre Show", ["Drama", "Comedy", "Thriller"]),
      createMockShow(2, "Drama Only", ["Drama"]),
      createMockShow(3, "Comedy Only", ["Comedy"]),
    ];

    const resultDrama = getPerGenre(shows, "Drama");
    const resultComedy = getPerGenre(shows, "Comedy");
    const resultThriller = getPerGenre(shows, "Thriller");

    expect(resultDrama).toHaveLength(2); // Shows 1 and 2
    expect(resultComedy).toHaveLength(2); // Shows 1 and 3
    expect(resultThriller).toHaveLength(1); // Show 1 only
  });

  it("should handle empty shows array", () => {
    const shows: Show[] = [];

    const result = getPerGenre(shows, "Drama");

    expect(result).toEqual([]);
  });

  it("should handle shows with empty genres array", () => {
    const shows: Show[] = [
      createMockShow(1, "No Genre Show", []),
      createMockShow(2, "Drama Show", ["Drama"]),
    ];

    const result = getPerGenre(shows, "Drama");

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  it("should be case-sensitive", () => {
    const shows: Show[] = [
      createMockShow(1, "Drama Show", ["Drama"]),
      createMockShow(2, "drama Show", ["drama"]),
    ];

    const resultUpperCase = getPerGenre(shows, "Drama");
    const resultLowerCase = getPerGenre(shows, "drama");

    expect(resultUpperCase).toHaveLength(1);
    expect(resultUpperCase[0].id).toBe(1);

    expect(resultLowerCase).toHaveLength(1);
    expect(resultLowerCase[0].id).toBe(2);
  });

  it("should not mutate the original array", () => {
    const shows: Show[] = [
      createMockShow(1, "Drama Show", ["Drama"]),
      createMockShow(2, "Comedy Show", ["Comedy"]),
    ];
    const originalLength = shows.length;

    const result = getPerGenre(shows, "Drama");

    expect(shows).toHaveLength(originalLength);
    expect(result).not.toBe(shows);
  });

  it("should handle all shows matching the genre", () => {
    const shows: Show[] = [
      createMockShow(1, "Drama 1", ["Drama"]),
      createMockShow(2, "Drama 2", ["Drama"]),
      createMockShow(3, "Drama 3", ["Drama"]),
    ];

    const result = getPerGenre(shows, "Drama");

    expect(result).toHaveLength(3);
  });
});
