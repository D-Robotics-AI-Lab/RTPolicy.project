"use strict";
(() => {
  const data = window.RTPOLICY_CONTENT;
  if (!data) return;
  const cell = (tag, text) => {
    const node = document.createElement(tag);
    node.textContent = text;
    return node;
  };
  const maxSpeed = Math.max(...data.speed.map((row) => row.it));
  for (const row of data.speed) {
    const tr = document.createElement("tr");
    if (row.it === maxSpeed) tr.className = "best";
    const label = cell("th", row.label);
    label.scope = "row";
    tr.append(label);
    const speed = document.createElement("td");
    speed.className = "speed-cell";
    const wrap = document.createElement("div");
    wrap.className = "speed-value";
    wrap.append(cell("strong", row.it.toFixed(4)));
    const bar = document.createElement("span");
    bar.className = "speed-bar";
    bar.setAttribute("aria-hidden", "true");
    const fill = document.createElement("i");
    fill.style.setProperty("--bar-width", `${(row.it / maxSpeed) * 100}%`);
    bar.append(fill);
    wrap.append(bar);
    speed.append(wrap);
    tr.append(speed);
    for (const text of [
      `${row.sm.toFixed(2)}%`,
      `${row.sd.toFixed(2)} pp`,
      `${row.p99.toFixed(2)} ms`,
    ])
      tr.append(cell("td", text));
    document.querySelector("#speed-rows").append(tr);
  }
  for (const row of data.quality) {
    const tr = document.createElement("tr");
    const label = cell("th", row.task);
    label.scope = "row";
    tr.append(label);
    const delta = row.after - row.before;
    for (const text of [
      `${row.before}%`,
      `${row.after}%`,
      `${delta > 0 ? "+" : ""}${delta} pp`,
      row.it.toFixed(4),
    ])
      tr.append(cell("td", text));
    document.querySelector("#quality-rows").append(tr);
  }
  document.querySelector("#metric-jpeg").textContent =
    data.speed[2].it.toFixed(4);
  const change = (data.speed[1].it / data.speed[0].it - 1) * 100;
  const speedup = document.querySelector("#metric-speedup");
  speedup.replaceChildren(
    document.createTextNode(`+${change.toFixed(2)}`),
    cell("span", "%"),
  );

  const resultTabs = [...document.querySelectorAll("[data-result]")];
  function selectResult(button, focus = false) {
    for (const item of resultTabs) {
      const selected = item === button;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
      document.querySelector(`#${item.dataset.result}-panel`).hidden =
        !selected;
    }
    if (focus) button.focus();
  }
  resultTabs.forEach((button, index) => {
    button.addEventListener("click", () => selectResult(button));
    button.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % resultTabs.length;
      if (event.key === "ArrowLeft")
        next = (index - 1 + resultTabs.length) % resultTabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = resultTabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        selectResult(resultTabs[next], true);
      }
    });
  });
  document.querySelectorAll("[data-format]").forEach((button) =>
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-format]").forEach((item) => {
        item.classList.toggle("active", item === button);
        item.setAttribute("aria-pressed", String(item === button));
      });
      const format = data.formats[button.dataset.format];
      document.querySelector("#format-title").textContent = format.title;
      document.querySelector("#format-description").textContent =
        format.description;
      document.querySelector("#decode-title").textContent = format.decode;
    }),
  );

  function selectCode(button) {
    document.querySelectorAll("[data-code]").forEach((item) => {
      item.classList.toggle("active", item === button);
      item.setAttribute("aria-pressed", String(item === button));
    });
    document.querySelector("#code-example").textContent =
      data.commands[button.dataset.code].code;
    document.querySelector("#code-note").textContent =
      data.commands[button.dataset.code].note;
    document.querySelector("#copy-code").textContent = "复制";
  }
  document
    .querySelectorAll("[data-code]")
    .forEach((button) =>
      button.addEventListener("click", () => selectCode(button)),
    );
  selectCode(document.querySelector('[data-code="install"]'));
  let copyTimer;
  document.querySelector("#copy-code").addEventListener("click", async () => {
    const button = document.querySelector("#copy-code");
    const text = document.querySelector("#code-example").textContent;
    try {
      if (navigator.clipboard && window.isSecureContext)
        await navigator.clipboard.writeText(text);
      else {
        const area = document.createElement("textarea");
        area.value = text;
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.append(area);
        area.select();
        const copied = document.execCommand("copy");
        area.remove();
        if (!copied) throw new Error("Copy unavailable");
      }
      button.textContent = "已复制";
      document.querySelector("#copy-status").textContent = "当前命令已复制";
    } catch {
      button.textContent = "请手动复制";
      document.querySelector("#copy-status").textContent =
        "浏览器未允许复制，请选中命令手动复制";
    }
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      button.textContent = "复制";
    }, 2200);
  });
})();
