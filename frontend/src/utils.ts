export function groupBy<T, K extends keyof T, TK extends T[K] & (string | number)>(
  items: T[],
  field: K,
): Record<TK, T[]> {
  return items.reduce(
    (acc, item) => {
      const key = item[field] as TK;
      const itemsForKey = acc[key] ?? [];
      return {
        ...acc,
        [key]: itemsForKey.concat(item),
      };
    },
    {} as Record<TK, T[]>,
  );
}
