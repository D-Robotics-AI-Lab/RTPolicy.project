"use strict";
(() => {
  const data = window.RTPOLICY_CONTENT;
  if (!data) return;
  const el = (tag, text, className) => {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  for (const result of data.simulation) {
    const row = el(
      "div",
      undefined,
      `benchmark-row${result.ours ? " highlight" : ""}`,
    );
    row.append(el("span", result.name, "benchmark-name"));
    const track = el("div", undefined, "benchmark-track");
    track.setAttribute("aria-hidden", "true");
    const fill = el("span", undefined, "benchmark-fill");
    fill.style.width = `${result.value}%`;
    track.append(fill);
    row.append(
      track,
      el("span", `${result.value.toFixed(1)}%`, "benchmark-value"),
    );
    document.querySelector("#simulation-bars").append(row);
  }
  for (const result of data.real) {
    const row = el("tr", undefined, result.ours ? "highlight" : "");
    const label = el("th", result.name);
    label.scope = "row";
    row.append(label);
    result.scores.forEach((score) => row.append(el("td", `${score}%`)));
    row.append(el("td", `${result.mean.toFixed(1)}%`));
    document.querySelector("#real-results").append(row);
  }
  function renderEdge(precision) {
    const container = document.querySelector("#edge-results");
    container.replaceChildren();
    for (const result of data.edge[precision]) {
      const card = el("article", undefined, "edge-device");
      card.append(el("h4", result.device));
      const speed = el("strong", `${result.frequency.toFixed(1)} `);
      speed.append(el("span", "Hz"));
      card.append(
        speed,
        el(
          "p",
          `${result.latency.toFixed(2)} ms inference · ${precision.toUpperCase()}`,
        ),
      );
      container.append(card);
    }
    document
      .querySelectorAll("[data-precision]")
      .forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.precision === precision),
        ),
      );
  }
  renderEdge("int16");
  document
    .querySelectorAll("[data-precision]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        renderEdge(button.dataset.precision),
      ),
    );

  const tabs = [...document.querySelectorAll("[data-result]")];
  function selectResult(button, focus) {
    tabs.forEach((item) => {
      const selected = item === button;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
      document.querySelector(`#panel-${item.dataset.result}`).hidden =
        !selected;
    });
    if (focus) button.focus();
  }
  tabs.forEach((button, index) => {
    button.addEventListener("click", () => selectResult(button, false));
    button.addEventListener("keydown", (event) => {
      const keys = {
        ArrowRight: (index + 1) % tabs.length,
        ArrowLeft: (index - 1 + tabs.length) % tabs.length,
        Home: 0,
        End: tabs.length - 1,
      };
      if (event.key in keys) {
        event.preventDefault();
        selectResult(tabs[keys[event.key]], true);
      }
    });
  });
  let copyTimer;
  function selectCommand(button) {
    document
      .querySelectorAll("[data-code]")
      .forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
    const command = data.commands[button.dataset.code];
    document.querySelector("#code-example").textContent = command.code;
    document.querySelector("#code-note").textContent = command.note;
    document.querySelector("#copy-code").textContent = "Copy";
    clearTimeout(copyTimer);
  }
  document
    .querySelectorAll("[data-code]")
    .forEach((button) =>
      button.addEventListener("click", () => selectCommand(button)),
    );
  selectCommand(document.querySelector('[data-code="install"]'));
  document.querySelector("#copy-code").addEventListener("click", async () => {
    const button = document.querySelector("#copy-code");
    const text = document.querySelector("#code-example").textContent;
    try {
      if (navigator.clipboard && window.isSecureContext)
        await navigator.clipboard.writeText(text);
      else {
        const area = el("textarea", text);
        area.value = text;
        area.style.cssText = "position:fixed;opacity:0;pointer-events:none";
        document.body.append(area);
        area.select();
        const copied = document.execCommand("copy");
        area.remove();
        if (!copied) throw new Error("Clipboard unavailable");
      }
      button.textContent = "Copied";
      document.querySelector("#copy-status").textContent =
        "Command copied to clipboard.";
    } catch {
      button.textContent = "Select text";
      document.querySelector("#copy-status").textContent =
        "Copy unavailable. Select the command and copy it manually.";
    }
    copyTimer = setTimeout(() => {
      button.textContent = "Copy";
    }, 2200);
  });

  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#main-navigation");
  const closeMenu = () => {
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  };
  menuButton.addEventListener("click", () => {
    const open = navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });
  navigation
    .querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  const dialog = document.querySelector("#figure-dialog");
  document.querySelectorAll("[data-lightbox]").forEach((button) =>
    button.addEventListener("click", () => {
      if (!dialog.showModal) {
        window.open(button.dataset.lightbox, "_blank", "noopener");
        return;
      }
      const image = document.querySelector("#dialog-image");
      image.src = button.dataset.lightbox;
      image.alt = button.dataset.caption || button.querySelector("img").alt;
      document.querySelector("#dialog-caption").textContent =
        button.dataset.caption;
      dialog.showModal();
      document.body.classList.add("dialog-open");
    }),
  );
  document
    .querySelector("#close-figure")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () =>
    document.body.classList.remove("dialog-open"),
  );
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      const box = dialog.getBoundingClientRect();
      if (
        event.clientX < box.left ||
        event.clientX > box.right ||
        event.clientY < box.top ||
        event.clientY > box.bottom
      )
        dialog.close();
    }
  });

  if ("IntersectionObserver" in window) {
    const links = [...navigation.querySelectorAll("a")];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            links.forEach((link) =>
              link.classList.toggle(
                "current",
                link.hash === `#${entry.target.id}`,
              ),
            );
        });
      },
      { rootMargin: "-15% 0px -55% 0px" },
    );
    links.forEach((link) => {
      const target = document.querySelector(link.hash);
      if (target) observer.observe(target);
    });
  }
})();
