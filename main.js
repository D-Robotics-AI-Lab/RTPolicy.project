"use strict";
(() => {
  const data = window.RTPOLICY_CONTENT;
  if (!data) return;
  const el = (tag, text, cls) => {
    const n = document.createElement(tag);
    if (text !== undefined) n.textContent = text;
    if (cls) n.className = cls;
    return n;
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
  const maxLatency = Math.max(...data.gpu_latency.map((x) => x.value));
  for (const result of data.gpu_latency) {
    const row = el(
      "div",
      undefined,
      `latency-row${result.ours ? " highlight" : ""}`,
    );
    row.append(el("span", result.name));
    const track = el("div", undefined, "benchmark-track");
    track.setAttribute("aria-hidden", "true");
    const fill = el("span", undefined, "benchmark-fill");
    fill.style.width = `${(result.value / maxLatency) * 100}%`;
    track.append(fill);
    row.append(
      track,
      el("span", `${result.value.toFixed(2)} ms`, "latency-value"),
    );
    document.querySelector("#gpu-bars").append(row);
  }
  for (const result of data.edge_estimates) {
    const card = el("div", undefined, "edge-speed");
    const frequency = el("strong", result.hz.toFixed(1) + " ");
    frequency.append(el("small", "Hz"));
    card.append(
      el("span", result.device, "edge-device"),
      frequency,
      el("span", result.latency_ms.toFixed(2) + " ms"),
    );
    document.querySelector("#edge-speed-grid").append(card);
  }
  function selectCommand(button) {
    document
      .querySelectorAll("[data-code]")
      .forEach((x) => x.setAttribute("aria-pressed", String(x === button)));
    const command = data.commands[button.dataset.code];
    document.querySelector("#code-example").textContent = command.code;
    document.querySelector("#code-note").textContent = command.note;
  }
  document
    .querySelectorAll("[data-code]")
    .forEach((x) => x.addEventListener("click", () => selectCommand(x)));
  selectCommand(document.querySelector('[data-code="install"]'));
  async function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return;
    }
    const box = document.createElement("textarea");
    box.value = value;
    box.style.position = "fixed";
    box.style.opacity = "0";
    document.body.append(box);
    box.select();
    const ok = document.execCommand("copy");
    box.remove();
    if (!ok) throw new Error("Copy unavailable");
  }
  const timers = new Map();
  function bindCopy(button, read, status) {
    const label = button.textContent;
    button.addEventListener("click", async () => {
      clearTimeout(timers.get(button));
      try {
        await copyText(read());
        button.textContent = "Copied";
        status.textContent = "Copied to clipboard.";
      } catch {
        button.textContent = "Select to copy";
        status.textContent = "Select the text and copy it.";
      }
      timers.set(
        button,
        setTimeout(() => {
          button.textContent = label;
          status.textContent = "";
        }, 1800),
      );
    });
  }
  bindCopy(
    document.querySelector("#copy-code"),
    () => document.querySelector("#code-example").textContent,
    document.querySelector("#copy-status"),
  );
  document.querySelector("#ai-prompt").textContent = data.agent_prompt;
  bindCopy(
    document.querySelector("#copy-ai-prompt"),
    () => data.agent_prompt,
    document.querySelector("#ai-copy-status"),
  );
  const menu = document.querySelector(".menu-toggle"),
    nav = document.querySelector("#main-navigation");
  const closeMenu = () => {
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
  };
  menu.addEventListener("click", () =>
    menu.setAttribute("aria-expanded", String(nav.classList.toggle("open"))),
  );
  nav
    .querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
  const dialog = document.querySelector("#figure-dialog");
  document.querySelectorAll("[data-lightbox]").forEach((button) =>
    button.addEventListener("click", () => {
      if (!dialog.showModal) {
        window.open(button.dataset.lightbox, "_blank", "noopener");
        return;
      }
      document.querySelector("#dialog-image").src = button.dataset.lightbox;
      document.querySelector("#dialog-image").alt =
        button.querySelector("img").alt;
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
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        dialog.close();
    }
  });
  if ("IntersectionObserver" in window) {
    const links = [...nav.querySelectorAll("a")];
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            links.forEach((a) => {
              const selected = a.hash === `#${entry.target.id}`;
              a.classList.toggle("current", selected);
              if (selected) a.setAttribute("aria-current", "location");
              else a.removeAttribute("aria-current");
            });
        }),
      { rootMargin: "-15% 0px -55% 0px" },
    );
    links.forEach((a) => {
      const target = document.querySelector(a.hash);
      if (target) observer.observe(target);
    });
  }
})();
