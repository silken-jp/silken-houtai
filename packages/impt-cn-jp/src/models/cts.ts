import { useState } from 'react';

export default () => {
  const [ctsStore, setCtsStore] = useState({
    canAccept: true,
  });
  return { ctsStore, setCtsStore };
};
