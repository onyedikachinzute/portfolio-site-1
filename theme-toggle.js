
const toggleBtn = document.getElementById("theme-toggle");
const body = document.body;

toggleBtn.addEventListener("click", () => {
  body.classList.toggle("dark-theme");
  const currentTheme = body.classList.contains("dark-theme") ? "🌞" : "🌙";
  toggleBtn.textContent = currentTheme;
});
