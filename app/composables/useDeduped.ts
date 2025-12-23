export function useDeduped<TArgs extends any[], TReturn>(
  callback: (signal: AbortSignal, ...args: TArgs) => Promise<TReturn>
) {
  let controller: AbortController | null = null;

  return async (...args: TArgs): Promise<TReturn> => {
    // Cancel previous request if still running
    if (controller) {
      controller.abort();
    }

    // Create new controller for this request
    controller = new AbortController();
    const currentController = controller;

    try {
      const result = await callback(currentController.signal, ...args);

      // Only clear controller if this is still the active one
      if (controller === currentController) {
        controller = null;
      }

      return result;
    } catch (error) {
      // Clear controller on error (including abort)
      if (controller === currentController) {
        controller = null;
      }
      throw error;
    }
  };
}
