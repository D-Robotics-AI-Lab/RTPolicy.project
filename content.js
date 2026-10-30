"use strict";
// Numbers follow the current manuscript; update each protocol together with its results.
window.RTPOLICY_CONTENT = {
  simulation: [
    { name: "RTPolicy", value: 52.3, ours: true },
    { name: "π0", value: 46.4 },
    { name: "RDT", value: 34.5 },
    { name: "ACT", value: 29.7 },
    { name: "DP", value: 28.0 },
  ],
  latency_comparison: [
    {
      id: "s600",
      platform: "RDK S600",
      precision: "INT16",
      rows: [
        { name: "DP", value: 19.76 },
        { name: "RTPolicy", value: 30.35, ours: true },
        { name: "VO-DP", value: 181.47 },
        { name: "π0.5", value: 331.6 },
      ],
    },
    {
      id: "gpu-fp16",
      platform: "RTX 4090",
      precision: "FP16",
      rows: [
        { name: "DP", value: 8.72 },
        { name: "RTPolicy", value: 10.92, ours: true },
        { name: "VO-DP", value: 25.31 },
        { name: "π0.5", value: 58.84 },
      ],
    },
    {
      id: "gpu-fp32",
      platform: "RTX 4090",
      precision: "FP32",
      rows: [
        { name: "DP", value: 23.15 },
        { name: "RTPolicy", value: 23.8, ours: true },
        { name: "VO-DP", value: 88.16 },
        { name: "π0.5", value: 109.33 },
      ],
    },
  ],
  edge_estimates: [
    {
      device: "S600",
      precision: "INT16",
      latency_ms: 30.35,
      hz: 32.9,
      source: "compiler_estimate",
      core: 0,
    },
    {
      device: "S100",
      precision: "INT16",
      latency_ms: 149.72,
      hz: 6.7,
      source: "compiler_estimate",
      core: 0,
    },
  ],
  agent_prompt:
    "Follow https://github.com/D-Robotics-AI-Lab/RTPolicy/blob/main/docs/AI_SETUP.md for https://github.com/D-Robotics-AI-Lab/RTPolicy, using ARTIFACT_ROOT=/path/to/external/artifacts. Use an existing checkout if available; otherwise clone the repository.\nCreate an isolated compatible environment, install the root requirements.txt, and route downloads, checkpoints, caches and outputs outside Git.\nAutomatically download the released lift_pot PyTorch model from the Google Drive links in the guide, verify its pinned SHA256 and safely extract it. Reuse verified cached files. A local checkpoint directory is optional.\nInspect the checkpoint and export static FP32 ONNX with verification, using the released lift_pot protocol NFE4 and seed0 through configuration overrides; preserve checkpoint weights and stored config.json. If I provide another checkpoint or protocol, use those settings instead.\nValidate the exported policy once and report action/action_pred errors against the same FP32 reference and identical inputs/noise. Label synthetic inputs explicitly.\nIf I request published ONNX or TensorRT validation, download and verify the matching package too. Check the TensorRT build environment before using its engine; rebuild from FP32 ONNX when the host requires it.\nRun RoboTwin2 task evaluation only when I request it, through the external launcher with the simulator code unchanged. Validate each requested stage once.\nReturn reproducible commands, source/download identities and checksums, resolved versions/settings, real artifact paths and validation results. Report concrete blockers without substituting different models or claiming unrun tests.",
  commands: {
    install: {
      code: "cd /path/to/RTPolicy\npython -m pip install -r requirements.txt",
      note: "Use your local source checkout and configure the dataset and pretrained weights in YAML.",
    },
    train: {
      code: "python main.py --config-path=configs/rtpolicy_train \\\n  --config-name=dit_fm_dinov3cnnl_3v",
      note: "Set the dataset path, task, pretrained-weight path and output directory in the configuration first. Lance is optional.",
    },
    export: {
      code: "python main.py --config-path=configs/rtpolicy_onnx \\\n  --config-name=rtpolicy_onnx_robotwin2",
      note: "Set checkpoint_dir and output_dir in the export YAML. TensorRT can be added with the optional tensorrt extra.",
    },
  },
};
