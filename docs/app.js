/* =============================================================================
   卸载大师 官网脚本（零依赖，单文件）
   -----------------------------------------------------------------------------
   1. 双语切换：HTML 里写死中文，这里用「中文快照 + 英文字典」的方式替换
   2. 顶栏滚动后加毛玻璃底
   3. 窄屏导航折叠菜单（键盘可操作）
   4. IntersectionObserver 滚动淡入（尊重 prefers-reduced-motion）
   5. 滚动时同步导航高亮
   ========================================================================== */

(function () {
  "use strict";

  const LANG_KEY = "uninstaller.site.lang";
  const LANGS = ["zh", "en"];

  /* 当前语言状态，切换时同步，避免重复应用导致闪烁 */
  const state = { lang: "zh" };

  /* ------------------------------------------------------- 1. 双语字典 */
  /* 只维护英文；中文直接取页面 HTML 的原始内容（加载时快照一次），
     这样文案只写一处，不会出现 HTML 与字典对不上的漏翻。 */
  const EN = {
    "meta.title": "Uninstaller · A lightweight Windows uninstaller with leftover cleanup",
    "meta.desc":
      "Uninstaller is a free, lightweight Windows uninstaller: silent uninstall, leftover scanning, force removal, startup and Store app management. About 4 MB, fully local, no data uploaded.",

    "a11y.skip": "Skip to content",
    "a11y.menu": "Toggle navigation menu",

    "nav.features": "Features",
    "nav.workflow": "How it works",
    "nav.compare": "Comparison",
    "nav.release": "Updates",
    "nav.faq": "FAQ",

    "cta.downloadShort": "Download",
    "cta.download": "Download installer",
    "cta.changelog": "View changelog",

    "hero.badge": "v0.2.0 is out · Windows 10 / 11",
    "hero.title1": "Uninstall clean.",
    "hero.title2": "Nothing left behind.",
    "hero.lead":
      "A tiny, free Windows uninstaller that runs entirely on your PC. Silent uninstall, leftover scanning, force removal and startup control — all in one window.",
    "hero.meta1": "Windows 10 / 11 · x64",
    "hero.meta2": "~4 MB installer",
    "hero.meta3": "Free, no ads",

    "preview.alt":
      "Preview of the Uninstaller app: sidebar navigation, program list, size column and cleanup progress",
    "preview.app": "Uninstaller",
    "preview.search": "Search apps",
    "preview.export": "Export",
    "preview.refresh": "Refresh",
    "preview.nav1": "Desktop apps",
    "preview.nav2": "Store apps",
    "preview.nav3": "Startup",
    "preview.nav4": "History",
    "preview.admin": "Administrator",
    "preview.all": "All apps",
    "preview.system": "System components",
    "preview.sort": "Sort by size",
    "preview.colProgram": "App",
    "preview.colPublisher": "Publisher",
    "preview.colSize": "Size",
    "preview.progress": "Calculating installed size",
    "preview.status1": "214 apps installed",
    "preview.status2": "96.4 GB in use",
    "preview.status3": "Sizes cached",
    "preview.toast": "Cleanup complete · 1.24 GB freed",

    "stats.1k": "Installer size",
    "stats.1v": "~4 MB",
    "stats.2k": "Memory in use",
    "stats.2v": "~35 MB",
    "stats.3k": "Leftover sources",
    "stats.3v": "4 types",
    "stats.4k": "Data uploaded",
    "stats.4v": "0 bytes",
    "stats.note":
      "Measured on a local machine with the v0.2.0 installer; memory use varies slightly with workload.",

    "features.k": "Features",
    "features.t": "Everything you need, nothing you don't",
    "features.d":
      "No bundles, no background service, no hidden startup entry. Eight capabilities covering every step from removal to cleanup.",
    "features.1t": "Silent uninstall",
    "features.1d":
      "Uses the quiet uninstall command the app registered itself. MSI, NSIS and Inno are detected automatically, so the vendor's wizard never appears.",
    "features.2t": "Leftover scan",
    "features.2d":
      "Keeps looking after the uninstall: install folder, matching AppData and ProgramData directories, Start menu and desktop shortcuts, and leftover registry keys.",
    "features.3t": "Force removal",
    "features.3d":
      "Uninstaller broken, hung or missing altogether? Skip it, scan and clean directly, then take the app off the list for good.",
    "features.4t": "Locked files",
    "features.4d":
      "Before cleaning it checks which processes hold the files, and can end them. Anything still stuck can be deleted on the next reboot.",
    "features.5t": "Store apps",
    "features.5d":
      "Microsoft Store apps appear with icon, size and publisher, and uninstall from the same window — no more digging through Settings.",
    "features.6t": "Startup items",
    "features.6d":
      "Run, RunOnce and Startup-folder entries in one list. Disable or delete them, and know exactly what slowed the boot down.",
    "features.7t": "Real size",
    "features.7d":
      "When the registry has no size, it computes one in parallel in the background and caches it, so the next launch shows real numbers instantly.",
    "features.8t": "HTML report",
    "features.8d":
      "Export every installed app and cleanup record as a single HTML file — handy for backups, handovers or troubleshooting.",

    "workflow.k": "How it works",
    "workflow.t": "Three steps, one straight line",
    "workflow.d":
      "No setup wizard, no account. Open it and uninstall — then see exactly what was cleaned.",
    "workflow.1t": "Pick an app",
    "workflow.1d":
      "The list sorts by size; double-click or press Enter to start. Newly installed and modified apps are highlighted.",
    "workflow.2t": "Scan leftovers",
    "workflow.2d":
      "Install folder, app data, shortcuts and registry keys are listed automatically, with confident and uncertain items marked apart.",
    "workflow.3t": "Confirm cleanup",
    "workflow.3d":
      "Items go to the Recycle Bin by default; locked files are unlocked first, and failures are queued for deletion on reboot — nothing is hidden.",

    "compare.k": "Comparison",
    "compare.t": "Side by side, on the same table",
    "compare.d":
      "Only the differences, no verdict. If the built-in tools are enough, use them; reach for a tool when you need finer cleanup.",
    "compare.caption": "Feature comparison",
    "compare.th1": "Capability",
    "compare.th2": "Uninstaller",
    "compare.th3": "Windows built-in",
    "compare.th4": "Geek Uninstaller (free)",
    "compare.r1": "Silent uninstall",
    "compare.r1a": "Picks MSI / NSIS / Inno parameters automatically",
    "compare.r1b": "Requires clicking through the vendor UI",
    "compare.r1c": "Yes",
    "compare.r2": "Scan scope",
    "compare.r2a": "Folder, AppData / ProgramData, shortcuts, registry",
    "compare.r2b": "No",
    "compare.r2c": "Install folder and registry",
    "compare.r3": "Force removal",
    "compare.r3a": "Yes, can skip the vendor uninstaller",
    "compare.r3b": "No",
    "compare.r3c": "Yes",
    "compare.r4": "Batch actions",
    "compare.r4a": "Batch force-removal and batch entry removal",
    "compare.r4b": "No",
    "compare.r4c": "One app at a time",
    "compare.r5": "Locked files",
    "compare.r5a": "Detects and ends processes, delete on reboot",
    "compare.r5b": "No",
    "compare.r5c": "Asks you to close the app",
    "compare.r6": "Startup items",
    "compare.r6a": "Disable and delete",
    "compare.r6b": "Disable via Task Manager",
    "compare.r6c": "No",
    "compare.r7": "Store apps",
    "compare.r7a": "Uninstall supported",
    "compare.r7b": "Yes, inside Settings",
    "compare.r7c": "No",
    "compare.r8": "Size & price",
    "compare.r8a": "~4 MB, completely free",
    "compare.r8b": "Built into Windows",
    "compare.r8c": "Portable, some features paid",
    "compare.note":
      "Based on each product's public documentation and v0.2.0 behaviour; only rows that differ are listed. An unlisted capability does not mean it is unsupported.",

    "release.k": "Updates",
    "release.t": "0.2.0: uninstalling, taken seriously",
    "release.d": "Interface, scanning and cleanup were rebuilt. Here is everything in the current release.",
    "release.t1tag": "UI",
    "release.t1":
      "Sidebar navigation plus a details drawer, with light, dark and follow-system themes; virtual scrolling keeps long lists smooth.",
    "release.t2tag": "Scan",
    "release.t2":
      "Leftovers now cover the install folder, matching AppData and ProgramData directories, Start menu and desktop shortcuts, plus heuristic registry matches.",
    "release.t3tag": "Cleanup",
    "release.t3":
      "Restart Manager reports which processes hold the files so you can end them; anything that still fails can be scheduled for removal on reboot.",
    "release.t4tag": "Manage",
    "release.t4":
      "Two new views for Store apps and startup items: uninstall packaged apps and disable or delete autostart entries without leaving the window.",
    "release.t5tag": "Data",
    "release.t5":
      "Size calculation runs in parallel and is cached locally, so sorting by size is instant. HTML reports and cleanup history included.",
    "release.t6tag": "Updates",
    "release.t6":
      "Built-in updates from GitHub Releases, verified by signature before anything is installed.",
    "release.sideSub": "Current stable release · Windows 10 / 11 · x64",
    "release.f1": "About 4 MB NSIS installer, no background service left behind",
    "release.f2": "Checks for updates on launch, or on demand",
    "release.f3": "The previous 0.1.0 release was the first public build",
    "release.dl": "Download latest",
    "release.all": "All releases",

    "faq.k": "FAQ",
    "faq.t": "A few things worth checking first",
    "faq.d": "Anything else, open an issue on GitHub — the author reads them.",
    "faq.q1": "Is it really free? Any ads or bundled software?",
    "faq.a1":
      "Completely free — no ads, no bundles, no account. The installer is a few megabytes, and uninstalling leaves no service running and no startup entry behind.",
    "faq.q2": "Can it delete files I still need?",
    "faq.a2":
      "Cleanup goes to the Recycle Bin, and drive roots, C:\\Windows and other critical paths are blocked outright. Heuristic registry and data-folder matches start unchecked and are labelled \u201cneeds review\u201d, so you decide item by item.",
    "faq.q3": "How does silent uninstall work?",
    "faq.a3":
      "It uses the quiet uninstall command registered by the app. When there is none, it adds the right switches for the installer type — msiexec /X /qn for MSI, /S for NSIS, /VERYSILENT for Inno. Untick the option to get the vendor's own wizard.",
    "faq.q4": "Does it need administrator rights?",
    "faq.a4":
      "Browsing the list does not. Writing to HKLM or deleting protected folders triggers a \u201crestart as administrator\u201d prompt — one click, no reinstall needed.",
    "faq.q5": "Is my data uploaded? How do updates work?",
    "faq.a5":
      "Scanning and cleanup happen entirely on your machine — no data is uploaded and there is no sign-in. Updates only fetch a manifest and installer from GitHub Releases, and nothing installs until the signature checks out.",
    "faq.q6": "Which Windows versions are supported?",
    "faq.a6":
      "Windows 10 and Windows 11 (x64). The interface uses the built-in WebView2 runtime, which ships with Windows 11 and is installed automatically on Windows 10.",

    "foot.tag": "A lightweight, free Windows uninstaller that runs entirely on your PC.",
    "foot.privacy": "Runs locally. No data is ever uploaded.",
    "foot.h1": "Product",
    "foot.h2": "Source & downloads",
    "foot.h3": "Release",
    "foot.lReleases": "All releases",
    "foot.lLatest": "Download latest",
    "foot.lIssues": "Report an issue",
    "foot.v": "Version 0.2.0",
    "foot.platform": "Windows 10 / 11 only",
    "foot.lang": "UI in Chinese and English",
    "foot.rights": "All rights reserved",
    "foot.disclaim": "An independent product, not affiliated with Microsoft.",
  };

  /* 元信息的两种语言（HTML 里是中文静态值，便于爬虫与无脚本环境） */
  const META = {
    zh: {
      title: "卸载大师 · 轻量级 Windows 卸载与残留清理工具",
      desc: "卸载大师是一款免费、轻量的 Windows 卸载工具：静默卸载、残留扫描、强制删除、启动项与 Store 应用管理，安装包约 4 MB，纯本地运行不上传数据。",
    },
    en: { title: EN["meta.title"], desc: EN["meta.desc"] },
  };

  /* ------------------------------------------- 1.1 中文快照（页面原始文案） */
  const zhText = new Map();
  const zhAttr = new Map();

  function collectZh() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const key = el.dataset.i18n;
      if (key && !zhText.has(key)) zhText.set(key, el.textContent);
    });

    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      parseAttrMap(el.dataset.i18nAttr).forEach(function (pair) {
        const mapKey = pair.key + "|" + pair.attr;
        if (!zhAttr.has(mapKey)) zhAttr.set(mapKey, el.getAttribute(pair.attr) || "");
      });
    });
  }

  /* "aria-label:key" 或 "data-label:key;title:other.key" → [{attr, key}] */
  function parseAttrMap(value) {
    if (!value) return [];
    return value
      .split(";")
      .map(function (chunk) {
        const index = chunk.indexOf(":");
        if (index < 0) return null;
        return { attr: chunk.slice(0, index).trim(), key: chunk.slice(index + 1).trim() };
      })
      .filter(Boolean);
  }

  /* ------------------------------------------------------- 1.2 应用语言 */
  function translate(key, lang) {
    if (lang === "en" && Object.prototype.hasOwnProperty.call(EN, key)) return EN[key];
    return null;
  }

  function applyLang(lang) {
    if (LANGS.indexOf(lang) < 0) lang = "zh";

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const key = el.dataset.i18n;
      if (!key) return;
      const next = translate(key, lang);
      if (next !== null) {
        el.textContent = next;
      } else {
        const zh = zhText.get(key);
        if (zh !== undefined) el.textContent = zh;
      }
    });

    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      parseAttrMap(el.dataset.i18nAttr).forEach(function (pair) {
        const next = translate(pair.key, lang);
        const value = next !== null ? next : zhAttr.get(pair.key + "|" + pair.attr);
        if (value !== undefined) el.setAttribute(pair.attr, value);
      });
    });

    const meta = META[lang] || META.zh;
    document.title = meta.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", meta.desc);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", meta.title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", meta.desc);

    document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
    document.documentElement.dataset.lang = lang;

    document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
      const on = btn.dataset.langBtn === lang;
      btn.classList.toggle("is-on", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function readLang() {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved && LANGS.indexOf(saved) >= 0) return saved;
    } catch (error) {
      /* file:// 或隐私模式下 localStorage 可能不可用，忽略即可 */
    }
    return "zh";
  }

  function saveLang(lang) {
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch (error) {
      /* 存不下就算了，不影响本次切换 */
    }
  }

  function initLang() {
    collectZh();
    state.lang = readLang();
    applyLang(state.lang);

    document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const lang = btn.dataset.langBtn;
        if (!lang || state.lang === lang) return;
        state.lang = lang;
        applyLang(lang);
        saveLang(lang);
      });
    });
  }

  /* --------------------------------------------------- 2. 顶栏滚动状态 */
  function initHead() {
    const head = document.getElementById("head");
    if (!head) return;
    let ticking = false;

    function update() {
      ticking = false;
      head.classList.toggle("is-scrolled", window.scrollY > 8);
    }

    update();
    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
      },
      { passive: true }
    );
  }

  /* ----------------------------------------------------- 3. 折叠导航菜单 */
  function initMenu() {
    const btn = document.getElementById("menu-btn");
    const nav = document.getElementById("site-nav");
    if (!btn || !nav) return;
    const mq = window.matchMedia("(max-width: 900px)");

    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    }

    btn.addEventListener("click", function () {
      setOpen(!nav.classList.contains("is-open"));
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(event.target) || btn.contains(event.target)) return;
      setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        btn.focus();
      }
    });

    // 视口变宽后清掉展开状态，避免桌面端残留 aria-expanded
    const onChange = function (event) {
      if (!event.matches) setOpen(false);
    };
    if (typeof mq.addEventListener === "function") mq.addEventListener("change", onChange);
  }

  /* ------------------------------------------------------- 4. 滚动淡入 */
  function initReveal() {
    const items = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    const reduced =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!items.length) return;

    if (reduced || !("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-in");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    items.forEach(function (el) {
      observer.observe(el);
    });

    // 兜底：若观察器完全没触发（异常环境），才整体显示，避免内容一直透明
    window.setTimeout(function () {
      const anyRevealed = items.some(function (el) {
        return el.classList.contains("is-in");
      });
      if (anyRevealed) return;
      items.forEach(function (el) {
        el.classList.add("is-in");
      });
    }, 1800);
  }

  /* --------------------------------------------------- 5. 导航高亮同步 */
  function initNavState() {
    const links = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
    if (!links.length) return;

    const pairs = links
      .map(function (link) {
        const id = (link.getAttribute("href") || "").replace("#", "");
        const section = id ? document.getElementById(id) : null;
        return section ? { link: link, section: section } : null;
      })
      .filter(Boolean);

    if (!pairs.length) return;

    let ticking = false;

    function update() {
      ticking = false;
      const line = 140;
      let current = null;

      pairs.forEach(function (pair) {
        if (pair.section.getBoundingClientRect().top <= line) current = pair;
      });

      pairs.forEach(function (pair) {
        if (pair === current) {
          pair.link.setAttribute("aria-current", "true");
        } else {
          pair.link.removeAttribute("aria-current");
        }
      });
    }

    update();
    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
      },
      { passive: true }
    );
    window.addEventListener("resize", update);
  }

  /* ----------------------------------------------------------- 6. 启动 */
  function boot() {
    initLang();
    initHead();
    initMenu();
    initReveal();
    initNavState();

    const year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
