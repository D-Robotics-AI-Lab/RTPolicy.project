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
  formats: {
    jpeg: {
      title: "按位置读取 JPEG 字节",
      description: "blob 描述符 + 按需 mmap",
      decode: "并行解码，有界预取",
    },
    video: {
      title: "按范围读取原始视频",
      description: "AV1 / GOP2 · 文件范围读取",
      decode: "PyAV CPU 解码 + decoder cache",
    },
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
