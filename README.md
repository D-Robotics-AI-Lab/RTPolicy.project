# RTPolicy · Project page

A standalone research page for **RTPolicy: Real-Time (32.9 Hz) Multi-View
Visuomotor Policy for Robotic Manipulation on Edge Devices**.

[Project website](https://d-robotics-ai-lab.github.io/RTPolicy.project/)

## Preview

Open `index.html`, or serve this directory locally:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000` on that machine. Forward the port when working remotely.

## Page structure

1. Introduction: one centered overview.
2. Method: architecture and a selectable four-stage pipeline tour.
3. Performance and efficiency: paper simulation results, GPU latency and model metrics.
4. Getting started: commands, AI-assisted setup and repository structure.
5. Training and deployment: three practical steps, followed by acknowledgements.

The S100/S600 section presents INT16 quantization and links to the complete compiler
HTML reports. The two speed cards are explicitly labeled as compiler estimates.

## Files

| File         | Content                                                                   |
| ------------ | ------------------------------------------------------------------------- |
| `index.html` | Paper identity, sections and resource links                               |
| `styles.css` | Responsive layout and typography                                          |
| `content.js` | Paper metrics, compiler estimates, commands and the AI handoff prompt     |
| `main.js`    | Charts, motion, pipeline tour, copy buttons, navigation and figure viewer |
| `assets/`    | Original demonstration, paper figure and HTML reports                     |

Public setup guides are in `guides/`. They are derived from the runtime project's
operating instructions and accept a user-provided source checkout and checkpoint.
The copyable AI prompt resolves to the current website's own guide URL.

## Interaction and motion

Navigation highlights the current section and shows reading progress. The
architecture opens in a larger viewer; its four-stage tour supports clicking,
keyboard navigation and user-triggered playback. Charts reveal on entry, and
cards respond to pointer movement. Copy controls support commands and the AI
handoff prompt. Motion respects the visitor's reduced-motion preference.

## Evidence and media

Simulation figures follow Table I; GPU inference latency follows Table VII.
900 → 12 visual tokens refers to the paper's three 640 × 480 views. The action
model uses four integration steps in the reported setup.

`assets/demo/RTPolicy.mp4` is the complete original demonstration. The WebM file
is a full-length compatibility encoding. The architecture image is from the paper.
The S600 and S100 HTML files retain their original bytes and are downloadable from the website's own asset directory.

## Hosting

This repository is the standalone public website project, following the
TabletopGen.project pattern. The RTPolicy algorithm repository remains private.

The manually triggered Pages workflow requires the exact tested commit SHA and
packages only static page files, `assets/` and `guides/`. Runtime implementations,
weights, repository history and credentials are outside the published site artifact.
