export const classNames = (classes: Record<string, boolean>) => {
  return Object.keys(classes)
    .reduce<string[]>((acc, className) => {
      classes[className] && acc.push(className);

      return acc;
    }, [])
    .join(' ');
};
