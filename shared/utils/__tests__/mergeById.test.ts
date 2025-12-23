import { describe, it, expect } from "vitest";
import { mergeById } from "../mergeById";
import type { Show, ShowById } from "../../types/Show";

const createMockShow = (id: number, name: string): Show => ({
  id,
  name,
  genres: [],
  rating: { average: null },
  image: { medium: "", original: "" },
  summary: "",
});

describe("mergeById", () => {
  it("should merge shows into an empty target", () => {
    const target: ShowById = {};
    const incoming: Show[] = [
      createMockShow(1, "Show 1"),
      createMockShow(2, "Show 2"),
    ];

    const result = mergeById(target, incoming);

    expect(result).toEqual({
      1: createMockShow(1, "Show 1"),
      2: createMockShow(2, "Show 2"),
    });
  });

  it("should merge shows into an existing target", () => {
    const target: ShowById = {
      1: createMockShow(1, "Show 1"),
    };
    const incoming: Show[] = [
      createMockShow(2, "Show 2"),
      createMockShow(3, "Show 3"),
    ];

    const result = mergeById(target, incoming);

    expect(result).toEqual({
      1: createMockShow(1, "Show 1"),
      2: createMockShow(2, "Show 2"),
      3: createMockShow(3, "Show 3"),
    });
  });

  it("should overwrite existing shows with same ID", () => {
    const target: ShowById = {
      1: createMockShow(1, "Old Show 1"),
    };
    const incoming: Show[] = [createMockShow(1, "New Show 1")];

    const result = mergeById(target, incoming);

    expect(result[1].name).toBe("New Show 1");
  });

  it("should handle empty incoming array", () => {
    const target: ShowById = {
      1: createMockShow(1, "Show 1"),
    };
    const incoming: Show[] = [];

    const result = mergeById(target, incoming);

    expect(result).toEqual({
      1: createMockShow(1, "Show 1"),
    });
  });

  it("should mutate the target object", () => {
    const target: ShowById = {};
    const incoming: Show[] = [createMockShow(1, "Show 1")];

    const result = mergeById(target, incoming);

    expect(result).toBe(target); // Same reference
    expect(target[1]).toBeDefined();
  });

  it("should prevent duplicates by overwriting", () => {
    const target: ShowById = {
      1: createMockShow(1, "First Version"),
    };
    const incoming: Show[] = [
      createMockShow(1, "Second Version"),
      createMockShow(1, "Third Version"),
    ];

    const result = mergeById(target, incoming);

    expect(Object.keys(result)).toHaveLength(1);
    expect(result[1].name).toBe("Third Version");
  });
});
