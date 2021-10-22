import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const useIsMounted = () => {
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    router.isReady & setLoaded(true);
  }, [router.isReady]);

  return loaded;
};

export default useIsMounted;
