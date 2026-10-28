"use strict";
// Numbers follow the current manuscript; update each protocol together with its results.
window.RTPOLICY_CONTENT = {
  simulation: [
    { name: "RTPolicy", value: 52.3, ours: true },
    { name: "π0", value: 46.4 },
    { name: "RDT", value: 34.5 },
    { name: "ACT", value: 29.7 },
    { name: "Diffusion Policy", value: 28.0 },
  ],
  gpu_latency: [
    { name: "FP32", value: 23.8 },
    { name: "FP16", value: 10.92, ours: true },
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
    "Follow https://github.com/D-Robotics-AI-Lab/RTPolicy/blob/main/docs/AI_SETUP.md for https://github.com/D-Robotics-AI-Lab/RTPolicy, using LOCAL_REPO_PATH=/path/to/RTPolicy, CHECKPOINT_DIRECTORY=/path/to/checkpoint, and ARTIFACT_ROOT=/path/to/external/artifacts.\nCreate a fresh compatible environment under ARTIFACT_ROOT, route caches and generated files there, and preserve shared environments and the original checkpoint.\nInspect the checkpoint to derive actual cameras, state/action shapes, history, horizon, active NFE, and preprocessing; preserve those settings and check the native RoboTwin2 image convention.\nVerify rtpolicy imports and export static FP32 ONNX with --verify, explicitly distinguishing synthetic export checks from representative-input validation.\nIf I select NVIDIA, also build and validate mixed FP16 separately from BPU INT16; install simulation software or assets only if I request evaluation.\nReturn reproducible commands, resolved versions/configuration, I/O, numerical errors and tolerances, artifact paths, and exact missing-resource blockers, keeping generated results outside Git.",
  commands: {
    install: {
      code: "cd /path/to/RTPolicy\npython -m pip install -e .",
      note: "Use your local source checkout and configure the dataset and pretrained weights in YAML.",
    },
    train: {
      code: "python main.py --config-path=configs/rtpolicy_train \\\n  --config-name=dit_fm_dinov3cnnl_3v",
      note: "Set the dataset path, task, pretrained-weight path and output directory in the configuration first. Lance is optional.",
    },
    export: {
      code: 'export CHECKPOINT_DIR=/path/to/checkpoint\nexport ARTIFACT_DIR=/path/to/external/storage/rtpolicy\n\npython -m rtpolicy.trainer.onnx \\\n  --checkpoint-dir "$CHECKPOINT_DIR" \\\n  --onnx-path "$ARTIFACT_DIR/model.onnx" \\\n  --device cpu --export-dtype fp32 --static-batch \\\n  --image-preprocess-in-onnx --verify',
      note: "Export requires a compatible checkpoint and ONNX dependencies. NVIDIA TensorRT uses FP16; S600 / S100 use INT16.",
    },
  },
};
