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
  real: [
    { name: "Diffusion Policy", scores: [80, 8, 0], mean: 29.3 },
    { name: "VO-DP", scores: [84, 34, 4], mean: 40.7 },
    { name: "π0.5", scores: [88, 56, 12], mean: 52.0 },
    { name: "RTPolicy", scores: [92, 94, 30], mean: 72.0, ours: true },
  ],
  edge: {
    int16: [
      { device: "S600", latency: 30.35, frequency: 32.9 },
      { device: "S100", latency: 149.72, frequency: 6.7 },
    ],
    int8: [
      { device: "S600", latency: 18.59, frequency: 53.8 },
      { device: "S100", latency: 86.56, frequency: 11.6 },
    ],
  },
  commands: {
    install: {
      code: "git clone git@github.com:D-Robotics-AI-Lab/RTPolicy.git\ncd RTPolicy\n\n# In an existing compatible environment\nconda activate RTPolicy\npython -m pip install -e . --no-deps",
      note: "New environments: install requirements_cluster.txt first. Download pretrained weights and simulation assets separately.",
    },
    train: {
      code: 'export DATASET_ROOT=/path/to/lerobot/task_parent\nexport ARTIFACT_DIR=/path/to/external/storage/rtpolicy\n\nWANDB_MODE=disabled accelerate launch --config_file configs/accelerate_config.yaml \\\n  main.py --config-path=configs/rtpolicy_train \\\n  --config-name=dit_fm_dinov3cnnl_3v_bs256 \\\n  +observation_config=dinov3cnnl_3v_cnn_b \\\n  train_dataset.path="$DATASET_ROOT" train_dataset.task=beat_block_hammer \\\n  train_dataset.demo=100 horizon=30 n_obs_steps=1 train_dataset.pad_after=28 \\\n  train_batch_size=256 optimizer.lr=2e-4 seed=0 \\\n  output_dir="$ARTIFACT_DIR/train"',
      note: "Starter example for three-view CNN-base training. Adjust the dataset, robot configuration, GPU count, and training budget for your experiment.",
    },
    export: {
      code: 'export CHECKPOINT_DIR=/path/to/checkpoint\nexport ARTIFACT_DIR=/path/to/external/storage/rtpolicy\n\npython -m rtpolicy.trainer.onnx \\\n  --checkpoint-dir "$CHECKPOINT_DIR" \\\n  --onnx-path "$ARTIFACT_DIR/model.onnx" \\\n  --device cpu --export-dtype fp32 \\\n  --image-preprocess-in-onnx --verify',
      note: "Export requires a compatible checkpoint and ONNX dependencies. Target-device INT8 / INT16 toolchain instructions will be added with the deployment release.",
    },
  },
};
