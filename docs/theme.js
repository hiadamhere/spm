(() => {
  const root = document.documentElement;
  const picker = document.querySelector(".theme-picker");
  const buttons = picker.querySelectorAll("[data-theme-choice]");
  const system = window.matchMedia("(prefers-color-scheme: dark)");
  const storageKey = "portfolio-theme";
  const validChoice = (value) =>
    value === "light" || value === "dark" ? value : "system";
  let choice = validChoice(root.dataset.theme);

  function render() {
    if (choice === "system") {
      delete root.dataset.theme;
    } else {
      root.dataset.theme = choice;
    }
    buttons.forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.themeChoice === choice),
      );
    });
    const dark = choice === "dark" || (choice === "system" && system.matches);
    document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
      meta.content = dark ? "#1c201c" : "#f8f7f2";
    });
  }

  buttons.forEach((button) =>
    button.addEventListener("click", () => {
      choice = validChoice(button.dataset.themeChoice);
      render();
      try {
        if (choice === "system") localStorage.removeItem(storageKey);
        else localStorage.setItem(storageKey, choice);
      } catch {
        // The control still works for this page when storage is unavailable.
      }
    }),
  );
  system.addEventListener("change", render);
  window.addEventListener("storage", (event) => {
    if (event.key === storageKey || event.key === null) {
      choice = validChoice(event.newValue);
      render();
    }
  });
  render();
  picker.hidden = false;
})();
