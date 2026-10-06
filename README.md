# DSH 流萤主题 · 精简定制版

为 DeepSeek Harness 提供流萤壁纸、半透明侧栏、银灰交互高亮和暖浅灰设置窗口。

本仓库首次发布版本为 **v0.1.1**，插件包版本为 **0.1.1**。

## 效果

| 项目 | 效果 |
| --- | --- |
| 壁纸 | 固定 `firefly3.png` |
| 左侧栏 | 单层 55% 不透明度、4px 磨砂 |
| 侧栏底部 | 沿用官方 24px 范围淡出 |
| 侧栏与会话区交接 | 官方 16px 圆角及匹配衬底 |
| 会话正文区 | 单层 40% 不透明度 |
| 输入区 | 实色输入卡片，外围透明；裁切被输入卡片覆盖的正文 |
| 顶栏 | Windows 顶栏与窗口控制按钮统一深空底色 `#070C17` |
| 高亮与滚动条 | 流萤银灰 `#B8B4BC` |
| 设置窗口 | 暖浅灰底 `#B2ACA9`、浅灰卡片 `#C8C2BF`、深色文字、灰绿选中导航 |
| 氛围粒子 | 12 颗萤火星点，支持减少动态效果 |

银灰高亮不透明度：普通悬停 20%、侧栏选中 26%、侧栏悬停 15%、
强调悬停 22%、工具栏悬停 28%。设置窗口使用独立的浅色调色板。

此定制版保留固定壁纸和星点，移除了音乐播放器、音效、背景切换、开屏动画、
dock 工具条与表情彩蛋。

## 下载与安装

1. 在 [Releases](https://github.com/motionalpha84/dsh-desktop_theme-firefly/releases) 下载
   `dsh-theme-firefly-0.1.1.tgz`。
2. 在 DSH 插件管理中安装该本地插件包。
3. 启用 `dsh-theme-firefly`；若界面未刷新，重新载入桌面端窗口。

本包的插件名和客户端模块 ID 均为 `dsh-theme-firefly`。

## 从源码构建

需要 Node.js 和 npm；构建脚本仅使用 Node.js 内置模块。

```sh
git clone https://github.com/motionalpha84/dsh-desktop_theme-firefly.git
cd dsh-desktop_theme-firefly
node build.cjs --clean
npm pack --pack-destination ..
```

`build.include.txt` 只包含 `assets/firefly3.png`。构建会把壁纸内嵌到
`lib/client.js`，生成的插件包无需额外下载素材。

## 实现与验证

原生布局的多层背景压缩为侧栏、会话列各一层，避免实际不透明度叠加。
侧栏磨砂放在透明伪元素上，文字、图标及原生固定按钮保留原有定位。
圆角衬底读取官方布局变量；列表淡出覆盖原生列表及退场动画。

设置配色限定在官方设置窗口的 `data-shortcut-modal="settings"` 作用域内。
输入区只裁切其下方的正文绘制，保留消息布局和滚动距离。

当前实现已通过基于官方 CSS 的 Chromium 渲染检查及 Windows DSH 桌面端
运行样式核对，覆盖侧栏透明度与磨砂、圆角与列表淡出、输入区裁切，以及
设置卡片、文字和表单配色。Web UI 共用客户端实现；目前的实机验证平台为 Windows。

## 来源与许可

- 定制维护：[motionalpha84](https://github.com/motionalpha84)。
- 基于 [Liu-ZA-81/dsh-theme-firefly](https://github.com/Liu-ZA-81/dsh-theme-firefly)
  上游 v0.1.3（commit `5fdfdb7`）裁剪及修改，保留上游署名和许可证。
- 代码使用 [MIT License](LICENSE)。流萤角色、名称及图像素材的版权归各自原权利方。
