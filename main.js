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
  const latencyRows = new Map();
  for (const result of data.latency_comparison[0].rows) {
    const row = el(
      "div",
      undefined,
      `latency-row${result.ours ? " highlight" : ""}`,
    );
    row.append(el("span", result.name, "latency-name"));
    const track = el("div", undefined, "benchmark-track");
    track.setAttribute("aria-hidden", "true");
    const fill = el("span", undefined, "benchmark-fill");
    track.append(fill);
    const value = el("span", undefined, "latency-value");
    row.append(track, value);
    document.querySelector("#gpu-bars").append(row);
    latencyRows.set(result.name, { fill, value });
  }
  const latencyButtons = [...document.querySelectorAll("[data-latency]")];
  function selectLatency(id) {
    const mode = data.latency_comparison.find((item) => item.id === id);
    if (!mode) return;
    for (const button of latencyButtons) {
      const selected = button.dataset.latency === id;
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
    }
    const maxLatency = Math.max(...mode.rows.map((item) => item.value));
    for (const result of mode.rows) {
      const row = latencyRows.get(result.name);
      row.fill.style.width = `${(result.value / maxLatency) * 100}%`;
      row.value.textContent = `${result.value.toFixed(2)} ms`;
    }
    document.querySelector("#latency-platform").textContent =
      `${mode.platform} · ${mode.precision} · batch 1`;
    document
      .querySelector("#gpu-bars")
      .setAttribute("aria-labelledby", `latency-tab-${id}`);
  }
  latencyButtons.forEach((button, index) => {
    button.addEventListener("click", () =>
      selectLatency(button.dataset.latency),
    );
    button.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight")
        next = (index + 1) % latencyButtons.length;
      else if (event.key === "ArrowLeft")
        next = (index + latencyButtons.length - 1) % latencyButtons.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = latencyButtons.length - 1;
      else return;
      event.preventDefault();
      latencyButtons[next].focus();
      selectLatency(latencyButtons[next].dataset.latency);
    });
  });
  selectLatency("s600");
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
      try {
        await navigator.clipboard.writeText(value);
        return;
      } catch {
        // Fall through to the user-gesture copy path.
      }
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
    const originalAriaLabel = button.getAttribute("aria-label");
    button.style.minWidth =
      Math.ceil(button.getBoundingClientRect().width) + "px";
    button.addEventListener("click", async () => {
      clearTimeout(timers.get(button));
      try {
        await copyText(read());
        button.textContent = button.id === "copy-code" ? "✓" : "Copied";
        button.setAttribute("aria-label", "Copied to clipboard");
        status.textContent = "Copied to clipboard.";
      } catch {
        button.textContent =
          button.id === "copy-code" ? label : "Select prompt";
        const target =
          button.id === "copy-code"
            ? document.querySelector("#code-example")
            : document.querySelector("#ai-prompt");
        if (button.id === "copy-ai-prompt")
          document.querySelector(".agent-prompt").open = true;
        const range = document.createRange();
        range.selectNodeContents(target);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        status.textContent = "Select the text and copy it.";
      }
      timers.set(
        button,
        setTimeout(() => {
          button.textContent = label;
          if (originalAriaLabel === null) button.removeAttribute("aria-label");
          else button.setAttribute("aria-label", originalAriaLabel);
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
  const publicAgentPrompt = data.agent_prompt.replace(
    "https://github.com/D-Robotics-AI-Lab/RTPolicy/blob/main/docs/AI_SETUP.md",
    new URL("guides/AI_SETUP.md", window.location.href).href,
  );
  document.querySelector("#ai-prompt").textContent = publicAgentPrompt;
  bindCopy(
    document.querySelector("#copy-ai-prompt"),
    () => publicAgentPrompt,
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

  const motionPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  const reduced = () => motionPreference.matches;
  const animate = (node, frames, options) => {
    if (reduced() || typeof node.animate !== "function") return null;
    return node.animate(frames, options);
  };
  const easing = "cubic-bezier(.2,.7,.2,1)";
  document
    .querySelectorAll(
      ".hero-wordmark,#paper-title,.authors,.affiliations,.resource-links",
    )
    .forEach((node, i) => {
      animate(
        node,
        [
          { opacity: 0.25, transform: "translateY(15px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 650, delay: i * 65, easing },
      );
    });
  const revealTargets = document.querySelectorAll(
    ".section-heading,.intro-text,.paper-figure,.method-steps,.method-tour,.metric-card,.result-card,.quantization-evidence,.setup-card,.repository-layout,.deployment-card,.acknowledgements",
  );
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            revealObserver.unobserve(entry.target);
            entry.target.dataset.revealed = "true";
            animate(
              entry.target,
              [
                { opacity: 0.35, transform: "translateY(18px)" },
                { opacity: 1, transform: "translateY(0)" },
              ],
              {
                duration: 620,
                delay: Math.min(
                  Number(entry.target.dataset.revealDelay) || 0,
                  180,
                ),
                easing,
              },
            );
          }
      },
      { threshold: 0.08 },
    );
    revealTargets.forEach((node, i) => {
      node.dataset.revealDelay = String((i % 3) * 55);
      revealObserver.observe(node);
    });
    const chartObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            chartObserver.unobserve(entry.target);
            entry.target.dataset.chartPlayed = "true";
            entry.target
              .querySelectorAll(".benchmark-fill")
              .forEach((fill, i) =>
                animate(
                  fill,
                  [{ transform: "scaleX(.03)" }, { transform: "scaleX(1)" }],
                  { duration: 900, delay: i * 70, easing },
                ),
              );
          }
      },
      { threshold: 0.3 },
    );
    document
      .querySelectorAll("#simulation-bars,#gpu-bars")
      .forEach((node) => chartObserver.observe(node));
  }
  document
    .querySelectorAll(".benchmark-fill")
    .forEach((node) => (node.style.transformOrigin = "left"));
  const progress = document.querySelector(".reading-progress span"),
    backToTop = document.querySelector(".back-to-top");
  let scrollFrame = 0;
  function updateScroll() {
    scrollFrame = 0;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const value = max > 0 ? Math.max(0, Math.min(1, window.scrollY / max)) : 0;
    progress.style.transform = `scaleX(${value})`;
    backToTop.classList.toggle(
      "visible",
      window.scrollY > window.innerHeight * 0.8,
    );
  }
  window.addEventListener(
    "scroll",
    () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
    },
    { passive: true },
  );
  window.addEventListener("resize", updateScroll, { passive: true });
  updateScroll();
  backToTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: reduced() ? "auto" : "smooth" }),
  );
  const cardNodes = document.querySelectorAll(
    ".metric-card,.result-card,.setup-card,.deployment-card,.repository-layout,.edge-speed",
  );
  cardNodes.forEach((card) => {
    card.classList.add("motion-card");
    let frame = 0,
      last = null;
    const reset = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      last = null;
      card.classList.remove("is-pointed");
      card.style.removeProperty("transform");
    };
    card.addEventListener(
      "pointermove",
      (event) => {
        if (
          reduced() ||
          !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
          event.pointerType === "touch"
        )
          return;
        last = { x: event.clientX, y: event.clientY };
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          if (!last) return;
          const r = card.getBoundingClientRect();
          const x = Math.max(0, Math.min(1, (last.x - r.left) / r.width)),
            y = Math.max(0, Math.min(1, (last.y - r.top) / r.height));
          card.style.setProperty("--pointer-x", `${x * 100}%`);
          card.style.setProperty("--pointer-y", `${y * 100}%`);
          card.classList.add("is-pointed");
          card.style.transform = `perspective(1000px) rotateX(${(0.5 - y) * 2}deg) rotateY(${(x - 0.5) * 2}deg) translateY(-2px)`;
        });
      },
      { passive: true },
    );
    card.addEventListener("pointerleave", reset);
    card.addEventListener("pointercancel", reset);
  });
  const stages = [
    {
      tag: "01 / OBSERVATION",
      title: "Observe the scene",
      description:
        "Three RGB views and the current robot state describe the scene. The cameras provide complementary observations.",
    },
    {
      tag: "02 / REPRESENTATION",
      title: "Fuse the camera views",
      description:
        "A frozen DINOv3 backbone extracts features. View-aware fusion connects information across the camera views.",
    },
    {
      tag: "03 / COMPRESSION",
      title: "Compress scene features",
      description:
        "Each view becomes a 2 × 2 token grid. In the paper's 480 × 640 setup, 900 visual tokens are compressed to 12.",
    },
    {
      tag: "04 / ACTION GENERATION",
      title: "Generate an action chunk",
      description:
        "Visual tokens and robot state condition the DiT. In the paper's setup, four Euler steps generate an action chunk.",
    },
  ];
  const stageButtons = [...document.querySelectorAll("[data-method-stage]")],
    stagePanel = document.querySelector("#method-stage-panel"),
    playButton = document.querySelector("#method-autoplay");
  let activeStage = 0,
    flowTimer = 0;
  function stopFlow() {
    if (flowTimer) clearInterval(flowTimer);
    flowTimer = 0;
    playButton.textContent = "Play flow";
    playButton.setAttribute("aria-pressed", "false");
    stagePanel.setAttribute("aria-live", "polite");
  }
  function selectStage(index, manual = false) {
    activeStage = (index + stages.length) % stages.length;
    const stage = stages[activeStage];
    if (manual) stopFlow();
    stagePanel.setAttribute("aria-live", flowTimer ? "off" : "polite");
    stageButtons.forEach((button, i) => {
      const selected = i === activeStage;
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    stagePanel.setAttribute("aria-labelledby", `method-step-${activeStage}`);
    document.querySelector("#stage-tag").textContent = stage.tag;
    document.querySelector("#stage-title").textContent = stage.title;
    document.querySelector("#stage-description").textContent =
      stage.description;
    document.querySelector("#stage-position").textContent =
      `${activeStage + 1} / ${stages.length}`;
    animate(
      stagePanel,
      [
        { opacity: 0.45, transform: "translateY(5px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 260, easing },
    );
  }
  stageButtons.forEach((button, i) => {
    button.addEventListener("click", () => selectStage(i, true));
    button.addEventListener("keydown", (event) => {
      const keys = {
        ArrowRight: (i + 1) % stages.length,
        ArrowLeft: (i + stages.length - 1) % stages.length,
        Home: 0,
        End: stages.length - 1,
      };
      if (event.key in keys) {
        event.preventDefault();
        selectStage(keys[event.key], true);
        stageButtons[keys[event.key]].focus();
      }
    });
  });
  playButton.addEventListener("click", () => {
    if (flowTimer) {
      stopFlow();
      return;
    }
    if (reduced()) return;
    playButton.textContent = "Pause flow";
    playButton.setAttribute("aria-pressed", "true");
    stagePanel.setAttribute("aria-live", "off");
    flowTimer = setInterval(() => selectStage(activeStage + 1), 2600);
  });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) stopFlow();
      },
      { threshold: 0.05 },
    ).observe(document.querySelector(".method-tour"));
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopFlow();
  });
  const onMotionChange = () => {
    if (reduced()) {
      stopFlow();
      document.getAnimations?.().forEach((a) => a.cancel());
      cardNodes.forEach((card) => {
        card.classList.remove("is-pointed");
        card.style.removeProperty("transform");
      });
    }
  };
  if (motionPreference.addEventListener)
    motionPreference.addEventListener("change", onMotionChange);
  else motionPreference.addListener(onMotionChange);
  let measureFrame = 0;
  function measureStagePanel() {
    measureFrame = 0;
    const width = stagePanel.getBoundingClientRect().width;
    if (!width) return;
    const clone = stagePanel.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.inert = true;
    Object.assign(clone.style, {
      position: "fixed",
      left: "-10000px",
      top: "0",
      visibility: "hidden",
      width: width + "px",
      minHeight: "0",
      maxWidth: "none",
      pointerEvents: "none",
    });
    document.body.append(clone);
    let height = 0;
    for (const stage of stages) {
      clone.querySelector("#stage-tag").textContent = stage.tag;
      clone.querySelector("#stage-title").textContent = stage.title;
      clone.querySelector("#stage-description").textContent = stage.description;
      height = Math.max(height, clone.getBoundingClientRect().height);
    }
    clone.remove();
    stagePanel.style.minHeight = Math.ceil(height) + "px";
  }
  const scheduleMeasure = () => {
    if (!measureFrame) measureFrame = requestAnimationFrame(measureStagePanel);
  };
  window.addEventListener("resize", scheduleMeasure, { passive: true });
  if (motionPreference.addEventListener)
    motionPreference.addEventListener("change", scheduleMeasure);
  document.fonts?.ready.then(scheduleMeasure);
  selectStage(0);
  measureStagePanel();
})();
