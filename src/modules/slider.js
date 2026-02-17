export async function initProjectSlider() {
  const sliderContent = document.querySelector(".slider-content");
  const nextBtn = document.querySelector(".slider-btn.next");
  const prevBtn = document.querySelector(".slider-btn.prev");
  const REPO_URL =
    "https://api.github.com/users/frederikanspach/repos?sort=updated";

  if (!sliderContent) return;

  // Ladezustand (Skeletons)
  renderSkeletons(sliderContent);

  let repos = [];
  let currentIndex = 0;

  try {
    const response = await fetch(REPO_URL);
    if (!response.ok) throw new Error("GitHub API Fehler");
    const allRepos = await response.json();

    const excludedRepos = ["frederikanspach"];
    repos = allRepos.filter(
      (repo) =>
        !repo.fork && !excludedRepos.includes(repo.name) && repo.description,
    );

    if (repos.length === 0) {
      sliderContent.innerHTML = "<p>Keine weiteren Projekte gefunden.</p>";
      return;
    }

    renderSlider();

    nextBtn?.addEventListener("click", () => moveSlider(1));
    prevBtn?.addEventListener("click", () => moveSlider(-1));
  } catch (error) {
    console.error("Fetch Fehler:", error);
    sliderContent.innerHTML = "<p>Projekte konnten nicht geladen werden.</p>";
  }

  function moveSlider(direction) {
    currentIndex = (currentIndex + direction + repos.length) % repos.length;
    renderSlider();
  }

  function renderSlider() {
    sliderContent.innerHTML = "";

    const prevIndex = (currentIndex - 1 + repos.length) % repos.length;
    const nextIndex = (currentIndex + 1) % repos.length;

    const visibleItems = [
      { repo: repos[prevIndex], role: "pre" },
      { repo: repos[currentIndex], role: "active" },
      { repo: repos[nextIndex], role: "post" },
    ];

    visibleItems.forEach((item) => {
      const card = document.createElement("div");
      card.className = `slider-card ${item.role}`;

      card.innerHTML = `
        <div class="card-image">
          <img src="https://opengraph.githubassets.com/1/${item.repo.full_name}" alt="${item.repo.name}">
        </div>
        <h4>${item.repo.name.replace(/-/g, " ")}</h4>
        <div class="project-links">
          <a href="${item.repo.html_url}" target="_blank" rel="noopener">GitHub</a>
          ${item.repo.homepage ? `<a href="${item.repo.homepage}" target="_blank" rel="noopener">Live Demo</a>` : ""}
        </div>
      `;

      if (item.role === "pre") {
        card.addEventListener("click", () => moveSlider(-1));
      } else if (item.role === "post") {
        card.addEventListener("click", () => moveSlider(1));
      }

      sliderContent.appendChild(card);
    });
  }

  function renderSkeletons(container) {
    container.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      const role = i === 1 ? "active" : i === 0 ? "pre" : "post";
      const skeleton = document.createElement("div");
      skeleton.className = `slider-card skeleton-card ${role}`;
      skeleton.innerHTML = `
        <div class="skeleton-img skeleton"></div>
        <div class="skeleton-text skeleton"></div>
        <div class="project-links">
          <div class="skeleton-btn skeleton"></div>
          <div class="skeleton-btn skeleton"></div>
        </div>
      `;
      container.appendChild(skeleton);
    }
  }
}
