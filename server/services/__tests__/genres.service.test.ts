import { describe, it, expect } from "vitest";
import { genresSatisfied } from "../genres.service";
import type { GenreCounts } from "../../../shared/types/Show";

describe("genres.service", () => {
  describe("genresSatisfied", () => {
    it("should return true when all genres meet minimum threshold", () => {
      const counts: GenreCounts = {
        Drama: 10,
        Comedy: 15,
        Action: 20,
      };

      const result = genresSatisfied(counts);

      expect(result).toBe(true);
    });

    it("should return false when any genre is below threshold", () => {
      const counts: GenreCounts = {
        Drama: 10,
        Comedy: 5, // Below threshold (MIN_SHOWS_PER_GENRE = 10)
        Action: 20,
      };

      const result = genresSatisfied(counts);

      expect(result).toBe(false);
    });

    it("should return false when any genre is exactly at threshold minus one", () => {
      const counts: GenreCounts = {
        Drama: 10,
        Comedy: 9, // Just below
        Action: 10,
      };

      const result = genresSatisfied(counts);

      expect(result).toBe(false);
    });

    it("should return true when all genres are exactly at threshold", () => {
      const counts: GenreCounts = {
        Drama: 10,
        Comedy: 10,
        Action: 10,
      };

      const result = genresSatisfied(counts);

      expect(result).toBe(true);
    });

    it("should return true for empty counts object", () => {
      const counts: GenreCounts = {};

      const result = genresSatisfied(counts);

      expect(result).toBe(true); // every() returns true for empty array
    });

    it("should handle single genre", () => {
      const countsPass: GenreCounts = { Drama: 10 };
      const countsFail: GenreCounts = { Drama: 9 };

      expect(genresSatisfied(countsPass)).toBe(true);
      expect(genresSatisfied(countsFail)).toBe(false);
    });

    it("should handle large genre counts", () => {
      const counts: GenreCounts = {
        Drama: 100,
        Comedy: 50,
        Action: 75,
        Thriller: 10,
      };

      const result = genresSatisfied(counts);

      expect(result).toBe(true);
    });
  });
});

/*
 * Note: Tests for setGenreCounts, resetGenreCounts, and getGenreCounts
 * are skipped as they depend on Nuxt's useStorage which requires
 * integration testing or a more complex mocking setup.
 *
 * These functions are thin wrappers around the cache layer and
 * the core business logic (genresSatisfied and count merging) is
 * already tested above and in the internal countGenres/mergeCountsInPlace
 * functions which are pure.
 */
