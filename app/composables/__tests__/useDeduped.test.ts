import { describe, it, expect, vi } from "vitest";
import { useDeduped } from "../useDeduped";

describe("useDeduped", () => {
  it("should call the callback with AbortSignal and arguments", async () => {
    const mockCallback = vi.fn(
      async (signal: AbortSignal, arg: string) => `result: ${arg}`
    );
    const deduped = useDeduped(mockCallback);

    const result = await deduped("test");

    expect(mockCallback).toHaveBeenCalledWith(
      expect.any(AbortSignal),
      "test"
    );
    expect(result).toBe("result: test");
  });

  it("should abort previous request when new request is made", async () => {
    const signals: AbortSignal[] = [];

    const mockCallback = vi.fn(async (signal: AbortSignal) => {
      signals.push(signal);
      // Simulate async work
      await new Promise((resolve) => setTimeout(resolve, 100));
      return "done";
    });

    const deduped = useDeduped(mockCallback);

    // Start first request
    const promise1 = deduped("first");

    // Start second request immediately (should abort first)
    const promise2 = deduped("second");

    await Promise.allSettled([promise1, promise2]);

    // First signal should be aborted, second should not
    expect(signals[0].aborted).toBe(true);
    expect(signals[1].aborted).toBe(false);
  });

  it("should only complete the latest request", async () => {
    const results: string[] = [];

    const mockCallback = vi.fn(async (signal: AbortSignal, value: string) => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      if (!signal.aborted) {
        results.push(value);
      }
      return value;
    });

    const deduped = useDeduped(mockCallback);

    // Fire multiple requests rapidly
    const promise1 = deduped("first");
    const promise2 = deduped("second");
    const promise3 = deduped("third");

    await Promise.allSettled([promise1, promise2, promise3]);

    // Only the last request should complete
    expect(results).toEqual(["third"]);
  });

  it("should clear controller after successful completion", async () => {
    let capturedSignal: AbortSignal | null = null;

    const mockCallback = vi.fn(async (signal: AbortSignal) => {
      capturedSignal = signal;
      return "success";
    });

    const deduped = useDeduped(mockCallback);

    await deduped();

    // Signal should not be aborted after successful completion
    expect(capturedSignal?.aborted).toBe(false);

    // Next call should get a fresh signal
    await deduped();
    expect(mockCallback).toHaveBeenCalledTimes(2);
  });

  it("should clear controller after error", async () => {
    const mockCallback = vi.fn(async (signal: AbortSignal) => {
      throw new Error("Test error");
    });

    const deduped = useDeduped(mockCallback);

    await expect(deduped()).rejects.toThrow("Test error");

    // Should be able to call again after error
    await expect(deduped()).rejects.toThrow("Test error");
    expect(mockCallback).toHaveBeenCalledTimes(2);
  });

  it("should handle AbortError gracefully", async () => {
    const mockCallback = vi.fn(async (signal: AbortSignal) => {
      await new Promise((resolve, reject) => {
        setTimeout(resolve, 100);
        signal.addEventListener("abort", () => {
          reject(new DOMException("Aborted", "AbortError"));
        });
      });
      return "done";
    });

    const deduped = useDeduped(mockCallback);

    const promise1 = deduped();
    const promise2 = deduped(); // This aborts promise1

    await expect(promise1).rejects.toThrow("Aborted");
    await expect(promise2).resolves.toBe("done");
  });

  it("should pass multiple arguments correctly", async () => {
    const mockCallback = vi.fn(
      async (signal: AbortSignal, a: number, b: string, c: boolean) => {
        return { a, b, c };
      }
    );

    const deduped = useDeduped(mockCallback);

    const result = await deduped(42, "test", true);

    expect(mockCallback).toHaveBeenCalledWith(
      expect.any(AbortSignal),
      42,
      "test",
      true
    );
    expect(result).toEqual({ a: 42, b: "test", c: true });
  });

  it("should handle rapid sequential calls", async () => {
    let callCount = 0;
    const mockCallback = vi.fn(async (signal: AbortSignal, value: number) => {
      callCount++;
      await new Promise((resolve) => setTimeout(resolve, 10));
      if (signal.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }
      return value;
    });

    const deduped = useDeduped(mockCallback);

    // Fire 5 requests rapidly
    const promises = [
      deduped(1),
      deduped(2),
      deduped(3),
      deduped(4),
      deduped(5),
    ];

    const results = await Promise.allSettled(promises);

    // All should be called
    expect(callCount).toBe(5);

    // First 4 should be aborted, last should succeed
    expect(results[0].status).toBe("rejected");
    expect(results[1].status).toBe("rejected");
    expect(results[2].status).toBe("rejected");
    expect(results[3].status).toBe("rejected");
    expect(results[4].status).toBe("fulfilled");
    expect((results[4] as PromiseFulfilledResult<number>).value).toBe(5);
  });

  it("should maintain separate state for different instances", async () => {
    const mockCallback1 = vi.fn(async (signal: AbortSignal) => "callback1");
    const mockCallback2 = vi.fn(async (signal: AbortSignal) => "callback2");

    const deduped1 = useDeduped(mockCallback1);
    const deduped2 = useDeduped(mockCallback2);

    const result1 = await deduped1();
    const result2 = await deduped2();

    expect(result1).toBe("callback1");
    expect(result2).toBe("callback2");
    expect(mockCallback1).toHaveBeenCalledTimes(1);
    expect(mockCallback2).toHaveBeenCalledTimes(1);
  });

  it("should not abort if callback completes before next call", async () => {
    const signals: AbortSignal[] = [];

    const mockCallback = vi.fn(async (signal: AbortSignal, value: string) => {
      signals.push(signal);
      return value;
    });

    const deduped = useDeduped(mockCallback);

    // Call and wait for completion
    await deduped("first");
    // Call again after first completes
    await deduped("second");

    // Neither signal should be aborted
    expect(signals[0].aborted).toBe(false);
    expect(signals[1].aborted).toBe(false);
    expect(signals).toHaveLength(2);
  });
});
