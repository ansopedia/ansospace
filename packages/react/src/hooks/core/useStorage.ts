import { useAuthContext } from "../../providers/AuthProvider";

/**
 * Exposes the underlying storage engine (Async).
 * Use this to store arbitrary data like theme preferences, last visited page, etc.
 */
export const useStorage = () => {
  const { storage } = useAuthContext();

  return {
    get: storage.get.bind(storage),
    set: storage.set.bind(storage),
    remove: storage.remove.bind(storage),
  };
};
