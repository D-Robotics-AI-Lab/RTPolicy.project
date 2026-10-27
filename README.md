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

| File         | Content                                                                          |
| ------------ | -------------------------------------------------------------------------------- |
| `index.html` | Paper identity, authors, sections, protocol notes, resource placeholders         |
| `styles.css` | Responsive layout, typography, colors, and visual hierarchy                      |
| `content.js` | Benchmark rows, precision-specific device results, and command examples          |
| `main.js`    | Result tabs, device-precision switch, command copying, image viewer, mobile menu |
| `assets/`    | Actual paper figures / keyframes and the code-native wordmark / favicon          |

The overview images open the paper figures at full resolution. Demonstration cards
contain **still frames**, not videos. The results panel supports keyboard navigation.
Animations respect reduced-motion preferences.

## Results and evidence

Content follows the current manuscript prepared on **2026-10-27**:

- **Simulation:** Table I, RoboTwin 2.0 clean-to-clean, 50 tasks, 50 demonstrations
  per task, 100 evaluation episodes per task, task-specific checkpoints. RTPolicy
  mean success is 52.26% (52.3% rounded). Baselines come from the official leaderboard.
- **Physical tasks:** Table VI, 200 demonstrations / 150K training steps / 50 trials
  per task, RTX 4090 evaluation. RTPolicy success is 92% / 94% / 30% across drawer,
  stack-and-cover, and assembly; the mean is 72.0%.
- **Paper-reported device inference:** Table VII, batch 1. S600 INT16 is 30.35 ms / 32.9 Hz;
  S600 INT8 is 18.59 ms / 53.8 Hz. S100 INT16 is 149.72 ms / 6.7 Hz;
  S100 INT8 is 86.56 ms / 11.6 Hz.
- **Representation:** Figure 2, three 640 × 480 (W × H) views give 900 patch tokens,
  compressed to 12 visual tokens. This is 75× token-count reduction.

GPU task success and device latency are different evaluations. The figure frequency
is policy inference speed, not full camera-to-actuation timing or a measurement of
task success on each edge device. Keep protocol notes alongside updated numbers.

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

## Pending materials

Paper / arXiv, videos, downloadable models, device toolchain packages, and BibTeX
remain visibly marked **Coming soon / To be added** until verified URLs are available.
Do not replace them with dummy links or unverified release claims.

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
