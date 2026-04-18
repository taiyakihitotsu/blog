export const handleScrollToTop = (instant = true) => {
  const target = document.querySelector(".outer") || window;

  target.scrollTo({
    top: 0,
    behavior: instant ? "auto" : "smooth",
  });
};
