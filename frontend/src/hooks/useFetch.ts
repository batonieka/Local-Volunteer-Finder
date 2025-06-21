import { useState, useEffect, useRef } from "react";

export function useFetch<T>(fetchFn: () => Promise<T> | null, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Keep track of mounted state to avoid setting state on unmounted component
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    const fetchData = async () => {
      const promise = fetchFn();
      if (!promise) {
        if (isMounted.current) {
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const result = await promise;
        if (isMounted.current) {
          setData(result);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted.current) {
          setError(err.message || "Unknown error");
          setData(null);
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted.current = false; // cleanup on unmount
    };
  }, deps);

  return { data, loading, error };
}
