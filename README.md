# RTPolicy · Project page

A standalone research page for **RTPolicy: Real-Time (32.9 Hz) Multi-View
Visuomotor Policy for Robotic Manipulation on Edge Devices**.

[Runtime repository](https://github.com/D-Robotics-AI-Lab/RTPolicy)

## Preview

Open `index.html`, or serve this directory locally:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000` on that machine. Forward the port when working remotely.

## Page structure

1. Introduction: one centered overview.
2. Method: architecture and four information-flow steps.
3. Performance and efficiency: paper simulation results, GPU latency and model metrics.
4. Getting started: commands, AI-assisted setup and repository structure.
5. Training and deployment: three practical steps, followed by acknowledgements.

The S100/S600 section presents INT16 quantization and links to the complete compiler
HTML reports. The two speed cards are explicitly labeled as compiler estimates.

## Files

| File         | Content                                                               |
| ------------ | --------------------------------------------------------------------- |
| `index.html` | Paper identity, sections and resource links                           |
| `styles.css` | Responsive layout and typography                                      |
| `content.js` | Paper metrics, compiler estimates, commands and the AI handoff prompt |
| `main.js`    | Charts, copy buttons, mobile navigation and figure viewer             |
| `assets/`    | Original demonstration, paper figure and HTML reports                 |

AI setup links to the runtime repository's `docs/AI_SETUP.md`. Keep the handoff
prompt synchronized with that guide. The guide reads a user-provided checkpoint;
provide that checkpoint directory when using the guide.

## Evidence and media

Simulation figures follow Table I; GPU inference latency follows Table VII.
900 → 12 visual tokens refers to the paper's three 640 × 480 views. The action
model uses four integration steps in the reported setup.

`assets/demo/RTPolicy.mp4` is the complete original demonstration. The WebM file
is a full-length compatibility encoding. The architecture image is from the paper.
The S600 and S100 HTML files retain their original bytes and are downloaded from
the project's `project-files` release.

## Hosting

This repository remains private. Local preview and file viewing do not alter
repository visibility or enable GitHub Pages. The existing deployment workflow
requires an explicitly configured Pages site.
