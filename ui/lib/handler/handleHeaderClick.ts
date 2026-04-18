export const handleHeaderClick = (id: string | undefined) => {
  if (id === undefined) return;
  window.location.hash = id;
};
