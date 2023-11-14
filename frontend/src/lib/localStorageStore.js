import { writable } from 'svelte/store';

/**
 * @template T any type of value
 * @param {string} key the storage key
 * @param {T} initial the default value
 * @returns {import('svelte/store').Writable<T>}
 */
export default function localStorageStore(key, initial) {
  let initialValue = initial;

  const storedValue = localStorage.getItem(key);
  if (storedValue) {
    try {
      initialValue = JSON.parse(storedValue);
    } catch (err) {
      console.error('Failed to parse initial value of local storage store', key, err);
    }
  }

  const result = writable(initialValue);

  result.subscribe(newValue => {
    localStorage.setItem(key, JSON.stringify(newValue));
  });

  return result;
}
