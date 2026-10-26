# RTPolicy.project

RTPolicy 的独立项目主页仓库。代码仓库：[D-Robotics-AI-Lab/RTPolicy](https://github.com/D-Robotics-AI-Lab/RTPolicy)。

纯 HTML / CSS / JavaScript，无框架、安装或构建步骤；没有外部字体、跟踪器或第三方脚本。

## 当前状态

仓库保持 **Private**，网页源码可以在本地预览，尚未启用托管站点。当前组织是 GitHub Free；访问受限的 GitHub Pages 需要 GitHub Enterprise Cloud。私有仓库和私有网页是两回事，不能把仓库设为 Private 就假定网页也受限。

参考：[GitHub Pages 站点可见性](https://docs.github.com/en/pages/getting-started-with-github-pages/changing-the-visibility-of-your-github-pages-site)。

## 预览

下载或克隆本仓库后，直接用浏览器打开 `index.html` 即可。也可以在本机启动：

```bash
git clone git@github.com:D-Robotics-AI-Lab/RTPolicy.project.git
cd RTPolicy.project
python3 -m http.server 8000 --bind 127.0.0.1
```

在同一台机器打开 `http://127.0.0.1:8000`。在远程服务器运行时，请通过 SSH 转发端口访问，不要把该预览服务暴露到公网。

## 后续怎么改

|文件|修改内容|
|---|---|
|`index.html`|标题、介绍、章节、链接、实验条件与说明|
|`content.js`|实测数字、JPEG/Video 数据路径说明、命令示例|
|`styles.css`|配色、间距、字体、桌面与手机布局|
|`main.js`|表格生成、切换、折叠说明及复制交互|

数字更新时，同时检查首页摘要、表格汇总和对应实验条件。320×240 成功率与640×480效率分开，Video/640成功率未测；不要将速度实验当成质量等效证明。

## GitHub Pages

已准备手动触发的 `.github/workflows/pages.yml`，没有自动发布。它先检查页面仓库的 Private 状态，以及 Pages 的 `public:false`，再允许部署；未配置私有 Pages 时会停止。

将来组织支持 Enterprise Cloud 私有 Pages 后：

1. 在本仓库 Settings → Pages 中选择 GitHub Actions，并确认 **站点可见性为 Private**。
2. 在 Actions → Deploy private project page 中手动运行。
3. 以 Pages 设置页返回的地址为准，不假定默认 `github.io` 地址。

如果以后希望主页公开，需要明确调整可见性和部署策略；代码仓库可以继续私有。

## 数据来源

- 2026-10-21：8×A100、原生640×480、100步预热+1000步计时，EFS Video/JPEG 对照。
- 2026-10-15：320×240、EFS Lance JPEG 五任务训练与匹配协议评测。
- 2026-10-16：8卡正常输入 / 固定 GPU 输入诊断。
- [完整实验和讲解](https://horizonrobotics.feishu.cn/wiki/MqF0wlQ9PixLJHkBVwYcTZW6nnf)（需要文档权限）。

页面初稿：2026-10-26。
