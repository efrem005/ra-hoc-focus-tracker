export function composeEventHandlers<T extends (...args: any[]) => any>(
  ...handlers: (T | undefined | null)[]
): T {
  return ((...args: Parameters<T>) => {
    for (const handler of handlers) {
      if (typeof handler === 'function') {
        const result = handler(...args)
        if (result !== undefined) {
          return result
        }
      }
    }
  }) as T
}
