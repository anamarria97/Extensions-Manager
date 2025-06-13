document.addEventListener("DOMContentLoaded", () => {
  const extensionList = document.querySelector(".extension-list");
  const themeSwitch = document.getElementById("theme-switch");
  const filterButtons = document.querySelectorAll(".filter");

  let extensions = [];

  fetch("data.json")
    .then(response => response.json())
    .then(data => {
      extensions = data;
      renderExtensions(getFilteredExtensions());
    });

  function renderExtensions(data) {
    extensionList.innerHTML = "";

    data.forEach(ext => {
      const card = document.createElement("div");
      card.classList.add("extension-card");

      card.innerHTML = `
        <div class="card-header">
          <img class="ext-icon" src="${ext.logo}" alt="${ext.name} logo">
          <div class="extension-info">
            <h3>${ext.name}</h3>
            <p>${ext.description}</p>
          </div>
        </div>
        <div class="actions">
          <button class="remove">Remove</button>
          <label class="switch">
            <input type="checkbox" ${ext.isActive ? "checked" : ""}>
            <span class="slider-toggle"></span>
          </label>
        </div>
      `;

      // Remove extension
      card.querySelector(".remove").addEventListener("click", () => {
        extensions = extensions.filter(e => e.name !== ext.name);
        renderExtensions(getFilteredExtensions());
      });

      // Toggle active/inactive
      const toggleInput = card.querySelector("input[type='checkbox']");
      toggleInput.addEventListener("change", () => {
        const target = extensions.find(e => e.name === ext.name);
        if (target) {
          target.isActive = toggleInput.checked;
          renderExtensions(getFilteredExtensions());
        }
      });

      extensionList.appendChild(card);
    });
  }

  // Theme toggle
  themeSwitch.addEventListener("change", () => {
    document.body.classList.toggle("dark");
  });

  // Filter buttons
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderExtensions(getFilteredExtensions());
    });
  });

  function getFilteredExtensions() {
    const activeBtn = document.querySelector(".filter.active").textContent.toLowerCase();
    if (activeBtn === "all") return extensions;
    if (activeBtn === "active") return extensions.filter(e => e.isActive);
    return extensions.filter(e => !e.isActive);
  }
});
