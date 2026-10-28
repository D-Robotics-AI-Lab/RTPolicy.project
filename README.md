# RTPolicy · Project page

A paper-first project page for **RTPolicy: Real-Time (32.9 Hz) Multi-View
Visuomotor Policy for Robotic Manipulation on Edge Devices**.

[Runtime repository](https://github.com/D-Robotics-AI-Lab/RTPolicy) ·
[Repository presentation](https://github.com/D-Robotics-AI-Lab/RTPolicy#readme)

The presentation follows the research-release structure used by DOSOD:
introduction and method, model overview and results, getting started, training /
export / inference, and acknowledgements / citation. Real experiment images and
paper figures are the primary visual material.

## Preview

This is a buildless HTML / CSS / JavaScript site. No framework, package installation,
external fonts, analytics, or third-party scripts are required.

Open `index.html` directly, or run a local preview:

```bash
git clone git@github.com:D-Robotics-AI-Lab/RTPolicy.project.git
cd RTPolicy.project
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000` on that machine. For a remote server, forward the port
through SSH. The local preview is independent of GitHub Pages hosting.

## Update the presentation

| File         | Content                                                                  |
| ------------ | ------------------------------------------------------------------------ |
| `index.html` | Paper identity, authors, sections, protocol notes, resource placeholders |
| `styles.css` | Responsive layout, typography, colors, and visual hierarchy              |
| `content.js` | Benchmark rows, INT16 device results, and command examples               |
| `main.js`    | Result tabs, command copying, image viewer, mobile menu                  |
| `assets/`    | Actual paper figures / keyframes and the code-native wordmark / favicon  |

The opening HTML5 player shows the full RTPolicy demonstration. The architecture
figure opens at full resolution, and benchmark tabs support keyboard navigation.
Animations respect reduced-motion preferences.

## Results and evidence

Content follows the current manuscript prepared on **2026-10-27**:

- **Simulation:** Table I, RoboTwin 2.0 clean-to-clean, 50 tasks, 50 demonstrations
  per task, 100 evaluation episodes per task, task-specific checkpoints. RTPolicy
  mean success is 52.26% (52.3% rounded). Baselines come from the official leaderboard.
- **Paper-reported device inference:** S600 INT16 is 30.35 ms / 32.9 Hz;
  S100 INT16 is 149.72 ms / 6.7 Hz. NVIDIA TensorRT uses FP16. INT8 deployment
  is not supported in the current release.
- **Representation:** Figure 2, three 640 × 480 (W × H) views give 900 patch tokens,
  compressed to 12 visual tokens. This is 75× token-count reduction.

Keep benchmark values and device specifications synchronized with the source paper.

`assets/rtpolicy-architecture.webp` is Figure 2. The full task-sequence image and
three individual keyframes are from Figure 4. No synthetic robot demonstrations are
used. Original PDFs, extraction contact sheets, and working asset manifests are not
included in this repository.

## Device HTML reports

The quantization section links directly to the complete, self-contained HTML files:

- `assets/quantization/s600.html`: S600 / nash-p / INT16 / 4 cores.
- `assets/quantization/s100.html`: S100 / nash-e / INT16 / 1 core.

The original report bytes are preserved. Their performance entries are compiler
estimates. There are no report screenshots or embedded previews.

Acknowledgements are maintained in `index.html`. Benchmark tables retain the
method names reported in the paper. Dataset storage receives a brief runtime note.

### View the reports as webpages

The files are complete HTML applications. GitHub's file and Raw interfaces are
source/download interfaces, not a website host. Save a report with its `.html`
extension and open it with Chrome or Edge, or serve this repository locally:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Then open these URLs on the same machine:

- `http://127.0.0.1:8000/assets/quantization/s600.html`
- `http://127.0.0.1:8000/assets/quantization/s100.html`

For a remote server, forward that port to your browser machine. These large reports
initialize their interactive charts before the navigation and summaries appear.
The repository currently has no configured GitHub Pages site; Raw links do not
provide an online-rendered report page.

## Demonstration video

`assets/demo/RTPolicy.mp4` is the complete 137.967-second original video provided
by the authors: 1920 × 1080, 30 fps, H.264/yuv420p, silent, with faststart metadata.
It is copied byte-for-byte; no segment or re-encoded preview replaces the full MP4.
`assets/demo/RTPolicy.webm` is an additional full-length VP9 compatibility version
(1080p30, all 4139 source frames) for browsers without an H.264 decoder.
`assets/demo/poster.webp` is taken at 2 seconds. The runtime README embeds the full
demonstration as a private GitHub video attachment.

GitHub Raw serves MP4/WebM as file downloads (`application/octet-stream`). The
project player uses local/hosted media paths with `video/mp4` / `video/webm`; the
runtime README embeds the demonstration using GitHub’s native attachment player.

The demo includes architecture, simulation, conveyor picking, and assembly-related
scenarios. It is presented separately from the paper's quantitative task tables.
The navy, ice-white, and cyan branding follows its title card.

The runtime Python package is `rtpolicy`; command examples and code links use that
namespace. Pre-existing checkpoint metadata is handled by the runtime migration
compatibility path.

## Pending materials

The RoboTwin2.0 checkpoint table reserves an empty Google Drive cell until its
real download URL is available.

## Hosting

The repository remains private. The existing manually triggered
`.github/workflows/pages.yml` workflow is retained; it packages the site **including
assets** and deploys only to an already configured private GitHub Pages site.
Editing or pushing this source does not make a site public or change repository
visibility. Direct-file and local HTTP previews work without a hosted site.

## Design references

- [DOSOD](https://github.com/D-Robotics-AI-Lab/DOSOD): release-page structure and numbered sections.
- [TabletopGen](https://github.com/D-Robotics-AI-Lab/TabletopGen): clean academic presentation and large paper imagery.
- [XLens](https://github.com/D-Robotics-AI-Lab/XLens): visual evidence and clear research identity.

The RTPolicy page uses its own layout and assets. It does not copy another project's
claims, author links, badges, or license.
