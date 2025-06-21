import { useEffect, useState } from "react";

export function useFetch<T>(fetchFn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    fetchFn()
      .then((res) => mounted && setData(res))
      .catch(() => mounted && setError("Failed to fetch data"))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [fetchFn]);

  return { data, loading, error };
}
