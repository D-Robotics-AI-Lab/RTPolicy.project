// Edit this file to update measurements and command examples. No build step is needed.
window.RTPOLICY_CONTENT = {
  speed: [
    {
      label: "Video · 未编译",
      it: 2.2895538655949275,
      sm: 96.38898809523809,
      sd: 3.6422860658620104,
      p99: 462.2529315948487,
    },
    {
      label: "Video · 编译",
      it: 2.7247516232664624,
      sm: 93.20833333333333,
      sd: 7.3640848291128735,
      p99: 642.7147572534257,
    },
    {
      label: "JPEG · 编译",
      it: 3.1061299273525633,
      sm: 96.93203883495146,
      sd: 2.1520463773214398,
      p99: 339.7851237840951,
    },
  ],
  quality: [
    { task: "beat_block_hammer", before: 86, after: 86, it: 6.053687935871457 },
    { task: "adjust_bottle", before: 100, after: 99, it: 6.128702267271795 },
    { task: "click_alarmclock", before: 56, after: 51, it: 6.047031369826001 },
    { task: "click_bell", before: 70, after: 71, it: 6.055657235018909 },
    { task: "dump_bin_bigbin", before: 86, after: 91, it: 6.167498037250611 },
  ],
  modelModes: {
    architecture: [
      {
        label: "VISUAL REPRESENTATION",
        title: "DINOv3-CNN 提取多视角表征",
        description: "共享预训练视觉骨干，示例配置冻结骨干",
      },
      {
        label: "MULTI-VIEW FUSION",
        title: "交替注意力 + 空间 Adapter",
        description: "视角内 / 跨视角交互，输出紧凑视觉 tokens",
      },
      {
        label: "CONDITIONED TRAJECTORY",
        title: "视觉条件 + 状态 / 动作 tokens",
        description: "已知状态锚定轨迹前缀，未来动作从噪声开始",
      },
      {
        label: "FLOW MATCHING POLICY",
        title: "DiT 预测速度场，生成动作片段",
        description: "沿时间积分，得到可执行的动作序列",
      },
    ],
    inference: [
      {
        label: "01 / OBSERVE",
        title: "读取当前多视角图像与机器人状态",
        description: "图像经过视觉编码、交替注意力与 Adapter",
      },
      {
        label: "02 / INITIALIZE",
        title: "固定已知状态，初始化未来动作",
        description: "未来轨迹从高斯噪声出发",
      },
      {
        label: "03 / INTEGRATE",
        title: "迭代预测速度并更新动作轨迹",
        description: "本轮评测 NFE10；步数由策略配置决定",
      },
      {
        label: "04 / ACT",
        title: "输出动作片段，接收下一次观察",
        description: "动作维度与执行长度遵循机器人配置",
      },
    ],
  },
  commands: {
    install: {
      code: "git clone git@github.com:D-Robotics-AI-Lab/RTPolicy.git\ncd RTPolicy\nconda activate RTPolicy\npython -m pip install -e '.[lance]' --no-deps",
      note: "在已有环境中登记当前代码；新环境先安装锁定依赖。",
    },
    train: {
      code: "torchrun --standalone --nproc_per_node=8 main.py \\\n  --config-path=configs/rtpolicy_train \\\n  --config-name=dit_fm_dinov3cnnb_3v_lance_real640_bs256 \\\n  train_dataset.root=/data/efs/your_lance_jpeg_blob \\\n  train_dataset.task=your_task train_dataset.demo=224 \\\n  output_dir=/data/efs/your_training_output",
      note: "示例对应三相机、16维状态/动作；请替换数据、任务、输出及预训练权重路径。",
    },
    convert: {
      code: "python tools/lerobot_v30_to_lance.py --help\n\n# 保留原始 MP4：\n# --mode video\n\n# 逐帧 JPEG，使用 blob 布局：\n# --mode jpeg --jpeg-storage blob",
      note: "完整调用需指定 --root 与独立的 --output。仅接收 LeRobot v3.0；转换前先阅读脚本说明。",
    },
  },
};
