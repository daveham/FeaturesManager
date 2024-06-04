// External Dependencies
import { useEffect, useRef } from 'react';

// Hook Definition
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export default usePrevious;
