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
      code: "git clone git@github.com:D-Robotics-AI-Lab/RTPolicy.git\ncd RTPolicy\n\n# In an existing compatible environment\nconda activate RTPolicy\npython -m pip install -e . --no-deps",
      note: "New environments: install requirements_cluster.txt first. Download pretrained weights and simulation assets separately.",
    },
    train: {
      code: 'export TASK=beat_block_hammer\nexport DATASET_ROOT=/path/to/lerobot_v21/$TASK\nexport DINOV3_ROOT=/path/to/dinov3-convnext-large-pretrain-lvd1689m\nexport RUN_DIR=/path/to/external/storage/rtpolicy/$TASK\n\npython main.py \\\n  --config-path=configs/rtpolicy_train \\\n  --config-name=dit_fm_dinov3cnnl_3v \\\n  train_dataset.backend=lerobot \\\n  train_dataset.root="$DATASET_ROOT" train_dataset.task="$TASK" \\\n  train_dataset.demo=null \\\n  model.obs_encoder.emvis_config.backbone_path="$DINOV3_ROOT" \\\n  train_batch_size=8 val_batch_size=8 dataloader_num_workers=4 \\\n  report_to=null output_dir="$RUN_DIR" hydra.run.dir="$RUN_DIR/hydra"',
      note: "Single-GPU starter with LeRobot v2.1. The Training Guide covers dataset preparation and the optional Lance backend.",
    },
    export: {
      code: 'export CHECKPOINT_DIR=/path/to/checkpoint\nexport ARTIFACT_DIR=/path/to/external/storage/rtpolicy\n\npython -m rtpolicy.trainer.onnx \\\n  --checkpoint-dir "$CHECKPOINT_DIR" \\\n  --onnx-path "$ARTIFACT_DIR/model.onnx" \\\n  --device cpu --export-dtype fp32 --static-batch \\\n  --image-preprocess-in-onnx --verify',
      note: "Export requires a compatible checkpoint and ONNX dependencies. NVIDIA TensorRT uses FP16; S600 / S100 use INT16.",
    },
  },
};
