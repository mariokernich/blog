// Scroll progress indicator for the sticky header.
// Updates the width of any `.progress-bar` element based on
// the document's scroll position. Wrapped in requestAnimationFrame
// for smoother updates on fast scrolls.
document.addEventListener(
    "scroll",
    () => {
        const { scrollTop, scrollHeight, clientHeight } =
            document.documentElement;
        const denom = scrollHeight - clientHeight;
        const scrolled = denom > 0 ? (scrollTop / denom) * 100 : 0;
        const progressBars = document.querySelectorAll(".progress-bar");

        window.requestAnimationFrame(() => {
            progressBars.forEach((bar) => {
                bar.style.width = `${scrolled}%`;
            });
        });
    },
    { passive: true },
);
