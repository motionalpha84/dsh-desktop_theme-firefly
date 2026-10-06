/**
 * dsh-theme-firefly —— 崩坏：星穹铁道 · 流萤主题（浏览器端）· 精简定制版
 *
 * 本文件是基于上游 0.1.3（commit 5fdfdb7）的 client.template.js 裁剪而来：
 *  - 保留：流萤霓虹配色（设计令牌）、firefly3.png 静态壁纸背景、萤火粒子
 *  - 粒子固定为「星点（星光）」档（12 颗），无切换 UI
 *  - 移除：dock 工具条、背景音乐播放器、壁纸切换/随机/自定义上传、打字音效、
 *          开屏变身动画、表情彩蛋、SAM 彩蛋、IndexedDB 持久化
 *  - 左侧栏：单层 55% 不透明 + 4px 轻度磨砂（内层 sidebar 透明防叠色）
 *  - 输入卡片保持实色，外围座席透明；裁切被输入区覆盖的正文，保留底部壁纸
 *  - 沿用官方会话列圆角，补齐圆角外侧衬底；侧栏列表底部按官方 24px 范围淡出
 *  - Windows 顶栏与原生窗口按钮统一深空底色；交互高亮及滚动条使用流萤银灰
 *  - 设置窗口独立使用暖浅灰底、浅灰卡片与深色文字
 *
 * 构建：node build.cjs（lib/client.js 由本模板注入 base64 素材生成）
 */
window.__ModuleLoader__.load({
	id: "dsh-theme-firefly",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;

		const THEME_ID = "dsh-theme-firefly";

		// ═══════════ 1. 设计令牌层：流萤配色 ═══════════
		// 深空海军蓝黑 × 萤火虫青绿（#00ff87 / #7dff9e）× 莹白文字
		const TOKENS = {
			// 背景：半透明深空蓝黑（让壁纸透出来；bg-base 是根容器，要最透明）
			"--dsw-alias-bg-base": "rgba(6, 10, 20, 0.30)",
			"--dsw-alias-bg-layer-1": "rgba(10, 16, 30, 0.52)",
			"--dsw-alias-bg-layer-2": "rgba(13, 21, 37, 0.72)",
			"--dsw-alias-bg-layer-3": "rgba(17, 27, 45, 0.80)",
			"--dsw-alias-bg-overlay": "rgba(15, 25, 43, 0.92)",
			"--dsw-alias-bg-module-platform": "rgba(8, 14, 26, 0.84)",
			"--dsw-alias-bg-multi-select": "rgba(15, 25, 43, 0.90)",
			"--dsw-alias-bg-skeleton": "rgba(0, 255, 135, 0.07)",
			"--dsw-alias-bg-mask-1": "rgba(3, 7, 15, 0.72)",
			"--dsw-alias-bg-mask-2": "rgba(3, 7, 15, 0.40)",
			"--dsw-alias-bg-mask-drop": "rgba(4, 8, 18, 0.72)",

			// 文字：莹白 / 薄荷灰
			"--dsw-alias-label-primary": "#eafff3",
			"--dsw-alias-label-secondary": "#a9c9b9",
			"--dsw-alias-label-tertiary": "#6f8a7c",
			"--dsw-alias-label-caption": "#8fb8a4",
			"--dsw-alias-label-dimmed": "#546f60",
			"--dsw-alias-label-primary-foreground": "#06240f",
			"--dsw-alias-label-primary-inverted": "#06240f",

			// 品牌：流萤绿
			"--dsw-alias-brand-primary": "#7dff9e",
			"--dsw-alias-brand-text": "#7dff9e",
			"--dsw-alias-brand-primary-invert": "#042b11",

			// 按钮
			"--dsw-alias-button-primary-fill": "#00e676",
			"--dsw-alias-button-primary-hover": "#2bf58a",
			"--dsw-alias-button-primary-dimmed": "rgba(0, 230, 118, 0.14)",
			"--dsw-alias-button-contrast-fill": "#eafff3",
			"--dsw-alias-button-elevated-fill": "#0e1628",
			"--dsw-alias-button-floating-fill": "#0c1424",
			"--dsw-alias-button-floating-hover": "#122036",
			"--dsw-alias-button-ghost-active-fill": "#0f1c30",
			"--dsw-alias-button-ghost-active-hover": "#16283f",
			"--dsw-alias-button-info-fill": "#00c78a",
			"--dsw-alias-button-info-hover": "#00ff9d",
			"--dsw-alias-button-tool-bar-fill": "rgba(184, 180, 188, 0.12)",
			"--dsw-alias-button-tool-bar-hover": "rgba(184, 180, 188, 0.28)",
			"--dsw-alias-button-ghost-active-border": "#b8b4bc",

			// 交互：参考流萤银灰发色与装甲，按定制不透明度区分状态。
			"--dsw-alias-interactive-bg-hover": "rgba(184, 180, 188, 0.20)",
			"--dsw-alias-interactive-bg-active": "rgba(184, 180, 188, 0.16)",
			"--dsw-alias-interactive-bg-hover-accent": "rgba(184, 180, 188, 0.22)",
			"--dsw-alias-interactive-bg-hover-danger": "rgba(255, 93, 122, 0.15)",

			// 边框
			"--dsw-alias-border-l1": "rgba(0, 255, 135, 0.13)",
			"--dsw-alias-border-l2": "rgba(0, 255, 135, 0.22)",
			"--dsw-alias-border-l2-darkmode-thin": "rgba(0, 255, 135, 0.10)",
			"--dsw-alias-border-l3": "rgba(125, 255, 158, 0.25)",
			"--dsw-alias-border-l4": "rgba(0, 255, 135, 0.38)",

			// 状态
			"--dsw-alias-state-success-primary": "#00ff87",
			"--dsw-alias-state-success-secondary": "rgba(0, 255, 135, 0.16)",
			"--dsw-alias-state-success-tertiary": "rgba(0, 255, 135, 0.08)",
			"--dsw-alias-state-error-primary": "#ff5d7a",
			"--dsw-alias-state-error-secondary": "rgba(255, 93, 122, 0.16)",
			"--dsw-alias-state-warn-primary": "#ffd93b",
			"--dsw-alias-state-warn-secondary": "rgba(255, 217, 59, 0.16)",
			"--dsw-alias-state-business-primary": "#00e6a0",
			"--dsw-alias-state-business-tertiary": "rgba(0, 230, 160, 0.10)",

			// toast / tooltip / markdown / 滚动条
			"--dsw-alias-toast-bg": "rgba(8, 14, 26, 0.92)",
			"--dsw-alias-tooltip-bg": "rgba(8, 14, 26, 0.95)",
			"--dsw-alias-markdown-inline-code": "rgba(0, 255, 135, 0.12)",
			"--dsw-alias-markdown-code-block": "rgba(4, 9, 18, 0.70)",
			"--dsw-alias-markdown-code-block-banner": "rgba(0, 255, 135, 0.06)",
			"--dsw-alias-scrollbar-bg-l1": "rgba(184, 180, 188, 0.15)",
			"--dsw-alias-scrollbar-bg-l2": "rgba(184, 180, 188, 0.22)",
			"--dsw-alias-scrollbar-hover-l1": "rgba(184, 180, 188, 0.30)",
			"--dsw-alias-scrollbar-hover-l2": "rgba(184, 180, 188, 0.42)",

			// 组件特化（左侧栏单层不透明度 55%）
			"--dsw-specific-sidebar-fill": "rgba(6, 11, 22, 0.55)",
			"--dsw-specific-sidebar-nav-item-active": "rgba(184, 180, 188, 0.26)",
			"--dsw-specific-sidebar-nav-item-active-accent": "#b8b4bc",
			"--dsw-specific-sidebar-nav-item-hover": "rgba(184, 180, 188, 0.15)",
			"--dsw-specific-bubble": "rgba(12, 20, 36, 0.88)",
			"--dsw-specific-bubble-highlight": "rgba(0, 255, 135, 0.08)",
			// 输入框（对话框主体）：实色。官方暗色把 input-major 映射到 bg-layer-2（实色），
			// 这里取 bg-layer-2 的实色等价物 #0d1525，卡片不再透出壁纸。
			"--dsw-specific-input-major": "#0d1525",
			"--dsw-specific-menu": "rgba(8, 14, 26, 0.94)",
			"--dsw-specific-selector": "rgba(10, 16, 30, 0.90)",
			"--dsw-specific-tip": "rgba(0, 255, 135, 0.10)",
		};

		// 设置窗口的独立浅色调色板。使用原生设置标记限定作用域，不改变全局外观偏好。
		// 卡片令牌必须在窗口内重新定义，避免继承 body 上已解析成深色的值。
		const SETTINGS_TOKENS = {
			"--dsw-alias-bg-base": "#b2aca9",
			"--dsw-alias-bg-layer-1": "#d1cbc8",
			"--dsw-alias-bg-layer-2": "#b2aca9",
			"--dsw-alias-bg-layer-3": "#d4cecb",
			"--dsw-alias-bg-overlay": "#d1cbc8",
			"--dsw-alias-bg-module-platform": "#c8c2bf",
			"--dsw-alias-bg-multi-select": "#c8c2bf",
			"--dsw-alias-bg-skeleton": "rgba(21, 21, 23, 0.07)",
			"--dsw-alias-settings-card-fill": "#c8c2bf",
			"--dsw-alias-settings-card-stroke": "rgba(21, 21, 23, 0.12)",
			"--dsw-alias-label-primary": "#151517",
			"--dsw-alias-label-primary-bluish": "#151517",
			"--dsw-alias-label-primary-dimmed": "#3c3a3b",
			"--dsw-alias-label-secondary": "#545557",
			"--dsw-alias-label-tertiary": "#545557",
			"--dsw-alias-label-caption": "#65676b",
			"--dsw-alias-label-dimmed": "#65676b",
			"--dsw-alias-label-primary-foreground": "#151517",
			"--dsw-alias-label-primary-inverted": "#f9fafb",
			"--dsw-alias-menu-icon": "#545557",
			"--dsw-alias-link": "#216447",
			"--dsw-alias-brand-primary": "#4ead83",
			"--dsw-alias-brand-text": "#216447",
			"--dsw-alias-brand-primary-invert": "#151517",
			"--dsw-alias-brand-primary-new-colorprimary-new-color": "#216447",
			"--dsw-alias-button-primary-fill": "#4ead83",
			"--dsw-alias-button-primary-hover": "#5cba90",
			"--dsw-alias-button-primary-dimmed": "#9aa49b",
			"--dsw-alias-button-contrast-fill": "#545557",
			"--dsw-alias-button-elevated-fill": "#c8c2bf",
			"--dsw-alias-button-floating-fill": "#c8c2bf",
			"--dsw-alias-button-floating-hover": "#d1cbc8",
			"--dsw-alias-button-ghost-active-fill": "#9aa49b",
			"--dsw-alias-button-ghost-active-hover": "#a3ada4",
			"--dsw-alias-button-ghost-active-border": "#81858c",
			"--dsw-alias-button-info-fill": "#4ead83",
			"--dsw-alias-button-info-hover": "#5cba90",
			"--dsw-alias-interactive-bg-hover": "rgba(21, 21, 23, 0.08)",
			"--dsw-alias-interactive-bg-active": "rgba(21, 21, 23, 0.14)",
			"--dsw-alias-interactive-bg-hover-accent": "rgba(21, 21, 23, 0.12)",
			"--dsw-alias-interactive-bg-hover-solid": "#b2aca9",
			"--dsw-alias-interactive-bg-hover-danger": "rgba(168, 40, 61, 0.12)",
			"--dsw-alias-border-l1": "rgba(21, 21, 23, 0.08)",
			"--dsw-alias-border-l2": "rgba(21, 21, 23, 0.16)",
			"--dsw-alias-border-l2-darkmode-thin": "rgba(21, 21, 23, 0.12)",
			"--dsw-alias-border-l3": "rgba(21, 21, 23, 0.20)",
			"--dsw-alias-border-l4": "rgba(21, 21, 23, 0.24)",
			"--dsw-alias-state-success-primary": "#216447",
			"--dsw-alias-state-success-secondary": "rgba(78, 173, 131, 0.20)",
			"--dsw-alias-state-success-tertiary": "rgba(78, 173, 131, 0.12)",
			"--dsw-alias-state-error-primary": "#a8283d",
			"--dsw-alias-state-error-secondary": "rgba(168, 40, 61, 0.16)",
			"--dsw-alias-state-warn-primary": "#8c590e",
			"--dsw-alias-state-warn-label": "#8c590e",
			"--dsw-alias-state-warn-secondary": "rgba(140, 89, 14, 0.16)",
			"--dsw-alias-state-business-primary": "#216447",
			"--dsw-alias-state-business-tertiary": "rgba(78, 173, 131, 0.12)",
			"--dsw-alias-switch-thumb": "#f9fafb",
			"--dsw-specific-sidebar-nav-item-active": "#9aa49b",
			"--dsw-specific-sidebar-nav-item-hover": "rgba(21, 21, 23, 0.08)",
			"--dsw-specific-input-major": "#d1cbc8",
			"--dsw-specific-selector": "#c8c2bf",
			"--dsw-specific-tip": "rgba(78, 173, 131, 0.12)",
		};

		// ═══════════ 2. 素材（base64，由 build.cjs 注入）═══════════
		// 精简版只保留一张静态壁纸 firefly3.png；GIF/MUSIC/封面/表情 token 保留占位
		// （build.cjs 的注入正则需要它们存在，实际代码不再引用后三者）
		const WALLPAPERS = /*__FIREFLY_BG_MANIFEST_START__*/[]/*__FIREFLY_BG_MANIFEST_END__*/;
		const GIF_DATA = /*__FIREFLY_GIF_START__*/""/*__FIREFLY_GIF_END__*/;
		const MUSIC = /*__FIREFLY_MUSIC_START__*/[]/*__FIREFLY_MUSIC_END__*/;
		const DEFAULT_COVER = /*__FIREFLY_DEFAULT_COVER_START__*/null/*__FIREFLY_DEFAULT_COVER_END__*/;
		const EMOTES = /*__FIREFLY_EMOTES_START__*/[]/*__FIREFLY_EMOTES_END__*/;

		// ═══════════ 3. 身份层 CSS（仅壁纸 / 遮罩 / 粒子）═══════════
		function identityCSS() {
			const tokenLines = Object.entries(TOKENS)
				.map(([name, value]) => "  " + name + ": " + value + " !important;")
				.join("\n");
			const settingsTokenLines = Object.entries(SETTINGS_TOKENS)
				.map(([name, value]) => "  " + name + ": " + value + " !important;")
				.join("\n");
			return [
				"html { color-scheme: dark !important; background: #050a14 !important; }",
				"body {",
				"  background-color: transparent !important;",
				"  color: #eafff3;",
				"  --dsw-font-family: 'MiSans', 'PingFang SC', 'Microsoft YaHei', -apple-system, 'Segoe UI', sans-serif;",
				"  --ds-font-family-code: 'SF Mono', 'JetBrains Mono', Consolas, Menlo, 'PingFang SC', monospace;",
				tokenLines,
				"}",
				// 原生 preload 从 body 的 sidebar-fill 同步窗口按钮颜色。Windows 下
				// 将该令牌设为实色，让标题栏与原生控件都使用同一底色；侧栏列仍独立绘制 55%。
				"html[data-windows-titlebar] body { --dsw-specific-sidebar-fill: #070c17 !important; }",

				// 壁纸背景层（z -2）+ 可读性遮罩（z -1）
				".ff-bg { position: fixed; inset: 0; z-index: -2; pointer-events: none; overflow: hidden;",
				"  background-color: #050a14; background-position: center; background-size: cover; background-repeat: no-repeat; }",
				".ff-bg-shade { position: fixed; inset: 0; z-index: -1; pointer-events: none;",
				"  background:",
				"    linear-gradient(100deg, rgba(4,8,18,0.72) 0%, rgba(4,8,18,0.52) 32%, rgba(4,8,18,0.20) 66%, rgba(4,8,18,0.06) 100%),",
				"    linear-gradient(180deg, rgba(4,8,18,0.40) 0%, rgba(4,8,18,0.02) 30%),",
				"    radial-gradient(90% 60% at 85% 10%, rgba(0,255,135,0.10), transparent 60%); }",

				"::selection { background: rgba(184, 180, 188, 0.25); color: #eafff3; }",

				// 萤火氛围粒子（精简版固定「星点」档，12 颗）
				".ff-amb { position: fixed; inset: 0; pointer-events: none; z-index: 60; overflow: hidden; }",
				// 星点留在内容区，避免越过统一底色的顶栏。
				"html[data-windows-titlebar] .ff-amb { top: var(--dsh-windows-titlebar-height); }",
				".ff-amb i { position: absolute; bottom: -14px; left: 0; opacity: 0;",
				"  transition: opacity 0.9s ease;",
				"  animation: ffFloat var(--dur, 20s) linear var(--delay, -5s) infinite;",
				"  will-change: transform, opacity; }",
				".ff-amb i.on { opacity: 1; }",
				".ff-amb i span { display: block; border-radius: 50%; background: #7dff9e;",
				"  box-shadow: 0 0 8px 2px rgba(125,255,158,0.55); opacity: var(--op, 0.6);",
				"  animation: ffTwinkle 3.2s ease-in-out infinite; }",
				"@keyframes ffTwinkle { 0%, 100% { opacity: calc(var(--op, 0.6) * 0.45); } 50% { opacity: var(--op, 0.6); } }",
				"@keyframes ffFloat { 0% { transform: translate3d(0, 0, 0); }",
				"  100% { transform: translate3d(var(--drift, 24px), -110vh, 0); } }",

				// ═══════════ 面板不透明度（0.1.8）═══════════
				// DSH 的面板背景是「叠层」的，token 值 ≠ 屏幕上的实际透明度：
				//   左侧栏 = frame 60% + sidebarCol 60% + SidebarRoot 60%  → 93.6%
				//   会话区 = frame 60% + centerCol 30% + ConversationRoot 30% → 80.4%
				// 下面把两层/三层压成精确的单层目标：侧栏 55%，会话区 40%。
				// 选择器一律用 data-* 属性 + 类名子串，DSH 升级换了 CSS Module 哈希也不会失效。

				// ① Windows 桌面端：窗口底 frame 不再整体上色（它是叠层里多出来的那 60%）。
				//    只在含侧栏列的那个 frame 上生效，避免误伤其它带 _frame 的元素。
				"[data-windows-titlebar] [class*=\"_frame\"]:has(> [class*=\"_sidebarCol\"]) { background-color: transparent !important; }",
				// 0.1.10：centerCol 沿用官方左上圆角。frame 透明后只给圆角外侧补回
				// 侧栏衬底；尺寸与位置读取官方变量，随侧栏拖宽、收起和标题栏高度更新。
				// 反向圆形 mask 只画圆角外侧，不与正文 40% 底色叠加。
				"[data-windows-titlebar] [class*=\"_frame\"]:has(> [class*=\"_sidebarCol\"])::after { content: \"\"; position: absolute; top: var(--dsh-windows-titlebar-height); left: var(--dsh-windows-sidebar-width, 0px); width: var(--dsh-windows-content-radius, 16px); height: var(--dsh-windows-content-radius, 16px); pointer-events: none; background: rgba(6, 11, 22, 0.55); -webkit-mask-image: radial-gradient(circle at bottom right, transparent calc(var(--dsh-windows-content-radius, 16px) - 0.5px), #000 var(--dsh-windows-content-radius, 16px)); mask-image: radial-gradient(circle at bottom right, transparent calc(var(--dsh-windows-content-radius, 16px) - 0.5px), #000 var(--dsh-windows-content-radius, 16px)); }",
				// ② 右栏在 Windows 下本来没有自己的背景、靠 ① 那层兜底，这里显式补回同样的 60%，
				//    保持它原来的观感不变。
				"[data-windows-titlebar] [class*=\"_rightbarCol\"] { background-color: rgba(6, 11, 22, 0.60) !important; }",
				// ③ 左侧栏：只留列本身一层 55%。列内所有还在读 --dsw-specific-sidebar-fill 的表面
				//    （内层 SidebarRoot 等）随之一并变透明。列表底部渐隐在下方单独处理。
				"[class*=\"_sidebarCol\"] { position: relative; isolation: isolate; background-color: rgba(6, 11, 22, 0.55) !important; --dsw-specific-sidebar-fill: transparent; }",
				// 模糊放在透明伪元素上，不给侧栏本体加 filter。否则原生 position:fixed
				// 折叠/新会话按钮会以侧栏为定位容器，从窗口标题栏掉到侧栏内部。
				// 不另叠底色，维持单层 55% 不透明度；文字与图标保持清晰。
				"[class*=\"_sidebarCol\"]::before { content: \"\"; position: absolute; inset: 0; z-index: -1; pointer-events: none; background: transparent; -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px); }",
				// 官方 WorkspaceBrowser 的 fade 位于 list 后方，覆盖底部 24px。
				// AnimatedRows 会在两者之间插入 exits 动画层，不能使用相邻兄弟选择器。
				// 把同样的过渡用于列表绘制 mask：文字逐渐隐去，侧栏底色/壁纸不叠层。
				// 只匹配原生带 fade 的 treeBody，分组、平铺与搜索列表都沿用同一规则。
				"[class*=\"_sidebarCol\"] [class*=\"_treeBody\"] > :is([class*=\"_list\"], [class*=\"_exits\"]):has(~ [class*=\"_fade\"]) { -webkit-mask-image: linear-gradient(to bottom, #000 calc(100% - 24px), transparent); mask-image: linear-gradient(to bottom, #000 calc(100% - 24px), transparent); }",
				"[class*=\"_sidebarCol\"] [class*=\"_treeBody\"] > [class*=\"_fade\"] { background: none !important; }",
				// 原生会话行和目录行复用通用 hover 令牌；侧栏树改用专用悬停值。
				// 选中会话单独读取侧栏选中令牌，避免跟着普通悬停的 20% 上色。
				"[class*=\"_sidebarCol\"] [class*=\"_treeBody\"] { --dsw-alias-interactive-bg-hover: var(--dsw-specific-sidebar-nav-item-hover) !important; }",
				"[class*=\"_sidebarCol\"] [class*=\"_sessionRow\"][aria-selected=\"true\"] { background-color: var(--dsw-specific-sidebar-nav-item-active) !important; }",
				// ④ 会话区：改用单层 40%（centerCol），会话根不再叠第二层 30%。
				//    居中正文区的滚动条、气泡等仍在 40% 的底上绘制。
				"[class*=\"_centerCol\"] { background-color: rgba(6, 10, 20, 0.40) !important; }",
				"[data-phase][class*=\"_root\"] { background-color: transparent !important; }",

				// 0.1.9：移除横跨会话底部的实色渐变遮罩。输入卡片仍由 input-major
				// 画实色，其两侧及状态栏下方与正文共用 40% 会话底色，壁纸连续透出。
				// startComposerClipping 只裁掉输入卡片下方的正文，避免状态栏叠字。
				"[data-phase=\"active\"] [class*=\"_composerSeat\"], [data-content-phase=\"active\"] [class*=\"_composerSeat\"] { background: transparent !important; }",
				"[data-phase=\"active\"] [class*=\"_composerSeat\"] [class*=\"_composerStack\"], [data-content-phase=\"active\"] [class*=\"_composerSeat\"] [class*=\"_composerStack\"] { background-color: transparent !important; }",

				// 官方 SettingsRoot 保留尺寸、圆角、导航与内容滚动；只覆盖窗口内的配色。
				"[data-shortcut-modal=\"settings\"] {",
				"  color-scheme: light !important; color: var(--dsw-alias-label-primary);",
				settingsTokenLines,
				"}",
				"[role=\"presentation\"]:has(> [data-shortcut-modal=\"settings\"]) > [aria-hidden=\"true\"] { background: rgba(3, 7, 15, 0.72) !important; backdrop-filter: none !important; }",
				"[data-shortcut-modal=\"settings\"] ::selection { background: rgba(78, 173, 131, 0.26); color: #151517; }",

				"@media (prefers-reduced-motion: reduce) { .ff-amb { display: none; } }"
			].join("\n");
		}

		// ═══════════ 4. 壁纸背景：固定 firefly3.png（单张，无切换 UI）═══════════
		function startBackground() {
			const all = Array.isArray(WALLPAPERS) ? WALLPAPERS : [];
			// 优先 firefly3.png，缺失时回退清单第一张（视频也会转成背景图分支外处理）
			let pick = all.find((w) => w.id === "firefly3.png")
				|| all.find((w) => w.kind === "image")
				|| all[0]
				|| null;

			const bg = document.createElement("div");
			bg.className = "ff-bg";
			const shade = document.createElement("div");
			shade.className = "ff-bg-shade";

			if (pick) {
				if (pick.kind === "video") {
					const video = document.createElement("video");
					video.autoplay = true; video.loop = true; video.muted = true; video.playsInline = true;
					video.src = pick.data;
					bg.appendChild(video);
					video.play().catch(() => {});
				} else {
					bg.style.backgroundImage = 'url("' + pick.data + '")';
				}
			}

			document.body.append(bg, shade);
			return () => { bg.remove(); shade.remove(); };
		}

		// ═══════════ 5. 萤火粒子：固定「星点」（星光）档 12 颗 ═══════════
		const AMB_COUNT = 12; // 上游 AMB_LEVELS 中 star(星点) 档数量
		function startParticles() {
			const wrap = document.createElement("div");
			wrap.className = "ff-amb";
			for (let i = 0; i < AMB_COUNT; i++) {
				const dot = document.createElement("i");
				const core = document.createElement("span");
				dot.appendChild(core);
				const size = 3 + Math.random() * 4;
				const op = 0.35 + Math.random() * 0.45;
				dot.style.left = (Math.random() * 100) + "%";
				dot.style.setProperty("--dur", (12 + Math.random() * 20) + "s");
				dot.style.setProperty("--delay", (-Math.random() * 25) + "s");
				dot.style.setProperty("--drift", Math.round((Math.random() - 0.5) * 120) + "px");
				core.style.width = size + "px";
				core.style.height = size + "px";
				core.style.setProperty("--op", op.toFixed(2));
				dot.classList.add("on"); // 固定常显，不做档位切换
				wrap.appendChild(dot);
			}
			document.body.appendChild(wrap);
			return () => { wrap.remove(); };
		}

		// ═══════════ 6. 输入区遮住的正文：只裁内容，不遮壁纸 ═══════════
		function startComposerClipping() {
			const tracked = new Map();
			const observed = new Set();
			let frame = 0;
			let stopped = false;
			function schedule() {
				if (!stopped && !frame) frame = requestAnimationFrame(update);
			}
			const resize = new ResizeObserver(schedule);
			function restore(view, previous) {
				if (previous.value) view.style.setProperty("clip-path", previous.value, previous.priority);
				else view.style.removeProperty("clip-path");
			}
			function update() {
				frame = 0;
				const current = new Set();
				const nextObserved = new Set();
				for (const scroll of document.querySelectorAll("[data-conversation-scroll]")) {
					const phase = scroll.closest("[data-content-phase], [data-phase]");
					if (!phase || (phase.getAttribute("data-content-phase") || phase.getAttribute("data-phase")) !== "active") continue;
					const seat = Array.from(scroll.children).find(el => el.matches("[data-composer-seat]"));
					const card = seat?.querySelector("[data-composer-card]");
					if (!card || getComputedStyle(seat).visibility === "hidden") continue;
					const cutoff = card.getBoundingClientRect().top;
					for (const view of scroll.querySelectorAll('[class*="_viewArea"]')) {
						if (view.closest("[data-conversation-scroll]") !== scroll) continue;
						const rect = view.getBoundingClientRect();
						if (!tracked.has(view)) tracked.set(view, {
							value: view.style.getPropertyValue("clip-path"),
							priority: view.style.getPropertyPriority("clip-path")
						});
						current.add(view);
						// 不改高度、滚动距离或消息 DOM；仅隐藏被输入区覆盖的正文绘制。
						const bottom = Math.min(rect.height, Math.max(0, rect.bottom - cutoff));
						view.style.setProperty("clip-path", "inset(0px 0px " + bottom + "px 0px)", "important");
						nextObserved.add(view);
					}
					nextObserved.add(scroll);
					nextObserved.add(seat);
					nextObserved.add(card);
				}
				for (const [view, previous] of tracked) {
					if (!current.has(view)) { restore(view, previous); tracked.delete(view); }
				}
				for (const el of observed) {
					if (!nextObserved.has(el)) { resize.unobserve(el); observed.delete(el); }
				}
				for (const el of nextObserved) {
					if (!observed.has(el)) { resize.observe(el); observed.add(el); }
				}
			}
			const mutation = new MutationObserver(schedule);
			mutation.observe(document.body, {
				childList: true, subtree: true, attributes: true,
				attributeFilter: ["data-phase", "data-content-phase", "hidden"]
			});
			document.addEventListener("scroll", schedule, true);
			window.addEventListener("resize", schedule);
			schedule();
			return () => {
				stopped = true;
				cancelAnimationFrame(frame);
				mutation.disconnect();
				resize.disconnect();
				document.removeEventListener("scroll", schedule, true);
				window.removeEventListener("resize", schedule);
				for (const [view, previous] of tracked) restore(view, previous);
				tracked.clear();
			};
		}

		// ═══════════ 7. apply ═══════════
		function apply(ctx) {
			ctx.effect(() => {
				// 1) 注入身份层样式。始终重写 textContent：HMR 重载本插件时，
				//    若旧 fiber 的清理晚于新 apply，仅判断「元素是否已存在」会留下上一版 CSS。
				let style = document.querySelector("style[data-firefly-theme]");
				if (!style) {
					style = document.createElement("style");
					style.dataset.fireflyTheme = THEME_ID;
					document.head.appendChild(style);
				}
				style.textContent = identityCSS();

				// 2) 注册主题并激活
				try {
					ctx.theme.register({
						id: THEME_ID,
						colorScheme: "dark",
						tokens: TOKENS
					});
					ctx.theme.setTheme(THEME_ID);
				} catch (e) {
					console.error("dsh-theme-firefly register failed", e);
				}

				// 3) 锁深色（防止主题服务切回亮色把壁纸冲淡）
				document.documentElement.style.colorScheme = "dark";
				document.body.toggleAttribute("data-ds-dark-theme", true);
				const darkObserver = new MutationObserver(() => {
					document.documentElement.style.colorScheme = "dark";
					document.body.toggleAttribute("data-ds-dark-theme", true);
				});
				darkObserver.observe(document.body, { attributes: true, attributeFilter: ["data-ds-dark-theme"] });

				// 4) 壁纸背景 + 萤火粒子
				const stopBackground = startBackground();
				const stopParticles = startParticles();
				const stopComposerClipping = startComposerClipping();

				return () => {
					darkObserver.disconnect();
					stopComposerClipping();
					stopBackground();
					stopParticles();
					document.querySelectorAll("style[data-firefly-theme]").forEach((s) => s.remove());
				};
			}, "dsh-theme-firefly: apply");
		}

		exports.isPlugin = true;
		exports.inject = ["theme"];
		exports.apply = apply;
		return module.exports;
	}
});
