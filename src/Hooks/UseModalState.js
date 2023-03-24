import { useCallback, useState } from "react";

export const UseModalState = (defaultValue = false) => {
  const [isOpen, setIsOpen] = useState(defaultValue);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);
  return { isOpen, open, close };
};
