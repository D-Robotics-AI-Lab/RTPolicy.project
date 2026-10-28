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
  edge: {
    int16: [
      { device: "S600", latency: 30.35, frequency: 32.9 },
      { device: "S100", latency: 149.72, frequency: 6.7 },
    ],
  },
  commands: {
    install: {
      code: "git clone https://github.com/D-Robotics-AI-Lab/RTPolicy.git\ncd RTPolicy\npython -m pip install -e .",
      note: "Configure the dataset and pretrained weights as described in the Training Guide.",
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
