const REPO_URL = "/repos.php";

export async function initProjectSlider() {
    const sliderContent = document.querySelector(".slider-content");
    const prevBtn = document.querySelector(".slider-btn.prev");
    const nextBtn = document.querySelector(".slider-btn.next");

    if (!sliderContent) return;

    try {
        const response = await fetch(REPO_URL);
        const repos = await response.json();

        if (repos.length === 0) {
            sliderContent.innerHTML = "<p>Keine Projekte gefunden.</p>";
            return;
        }

        renderSlider(repos, sliderContent);

        sliderContent.addEventListener("wheel", (evt) => {
            if (evt.deltaY !== 0) {
                evt.preventDefault();
                sliderContent.scrollLeft += evt.deltaY;
            }
        }, { passive: false });

        const scrollAmount = 350;

        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                const isAtEnd = sliderContent.scrollLeft + sliderContent.clientWidth >= sliderContent.scrollWidth - 10;
                if (isAtEnd) {
                    sliderContent.scrollTo({ left: 0, behavior: "smooth" });
                } else {
                    sliderContent.scrollBy({ left: scrollAmount, behavior: "smooth" });
                }
            });
        }

        if (prevBtn) {
            prevBtn.onclick = () => {
                if (sliderContent.scrollLeft <= 10) {
                    sliderContent.scrollTo({ left: sliderContent.scrollWidth, behavior: "smooth" });
                } else {
                    sliderContent.scrollBy({ left: -scrollAmount, behavior: "smooth" });
                }
            };
        }
    } catch (error) {
        console.error("Slider-Error:", error);
    }
}

function renderSlider(projects, container) {
    container.innerHTML = "";

    projects.forEach((repo) => {
        const card = document.createElement("div");
        card.className = "slider-card";

        const ogImageUrl = `https://opengraph.githubassets.com/1/${repo.full_name}`;

        card.innerHTML = `
            <div class="card-image">
                <img src="${ogImageUrl}" alt="${repo.name}" loading="lazy">
            </div>
            <h4>${repo.name}</h4>
            <p>${repo.description || "Ein spannendes GitHub Projekt."}</p>
            <div class="project-links">
                <a href="${repo.html_url}" target="_blank">Code</a>
                ${repo.homepage ? `<a href="${repo.homepage}" target="_blank">Demo</a>` : ""}
            </div>
        `;
        container.appendChild(card);
    });
}