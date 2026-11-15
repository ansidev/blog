<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref } from 'vue'

const GITHUB_URL = 'https://github.com/ansidev/skill-manager-cli'
const RELEASES_URL = 'https://github.com/ansidev/skill-manager-cli/releases'
const LICENSE_URL = 'https://github.com/ansidev/skill-manager-cli/blob/main/LICENSE'
const BREW_INSTALL = 'brew install ansidev/tap/skill-manager-cli'

const steps = [
  {
    title: 'Describe your skills',
    text: 'List the skills you want in a declarative config.yaml — one source of truth for every coding assistant.',
  },
  {
    title: 'Preview the changes',
    text: 'Run apply --dry-run to see exactly what would be installed, updated or removed before anything happens.',
  },
  {
    title: 'Apply everywhere',
    text: 'One command installs each skill into every agent directory, from a central store via symlinks.',
  },
]

const features = [
  {
    icon: 'yaml',
    title: 'Declarative state',
    text: 'Describe the skills you want in config.yaml, then run apply to make it so. Diff it, review it, keep it in git.',
  },
  {
    icon: 'git',
    title: 'Multiple providers',
    text: 'Fetch skills from GitHub repositories, local filesystem paths or your own custom Git host.',
  },
  {
    icon: 'bots',
    title: 'Multi-agent targeting',
    text: "Install into several agents' skill directories at once via a dirs map or the -a/--agents flag.",
  },
  {
    icon: 'link',
    title: 'Central skill store',
    text: 'Skills are cached in ~/.agents/skills and symlinked into each agent directory — one copy, everywhere.',
  },
  {
    icon: '!',
    title: 'Conflict detection',
    text: 'Conflicting skill entries across repositories are reported before any changes are made.',
  },
  {
    icon: 'bin',
    title: 'Safe operation modes',
    text: '--dry-run previews changes, confirmation prompts guard destructive actions, and --overwrite is opt-in.',
  },
]

const tabs = [
  {
    id: 'install',
    label: 'Install',
    code: 'brew install ansidev/tap/skill-manager-cli',
  },
  { id: 'init', label: 'Init', code: 'skill-manager-cli init' },
  { id: 'preview', label: 'Preview', code: 'skill-manager-cli apply --dry-run' },
  { id: 'apply', label: 'Apply', code: 'skill-manager-cli apply' },
]

const techs = ['Go', 'urfave/cli', 'YAML', 'Homebrew']

// Copy buttons: one shared "copied" key so only one button shows the state at a time.
const copiedKey = ref('')
let copiedTimer: ReturnType<typeof setTimeout> | undefined

const copy = async (key: string, text: string) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    return
  }
  copiedKey.value = key
  clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => {
    copiedKey.value = ''
  }, 2000)
}

onBeforeUnmount(() => clearTimeout(copiedTimer))

// Tabs (ARIA tabs pattern with roving tabindex and arrow keys)
const activeTab = ref(tabs[0].id)
const tabRefs = ref<HTMLButtonElement[]>([])

const onTabKeydown = async (event: KeyboardEvent, index: number) => {
  const last = tabs.length - 1
  let next = index
  if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1
  else if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = last
  else return
  event.preventDefault()
  activeTab.value = tabs[next].id
  await nextTick()
  tabRefs.value[next]?.focus()
}
</script>

<template>
  <div class="smc">
    <p class="smc-visually-hidden" role="status" aria-live="polite">{{ copiedKey ? 'Copied to clipboard' : '' }}</p>
    <!-- Hero -->
    <section class="smc-hero" aria-labelledby="smc-title">
      <div class="smc-hero-copy">
        <p class="smc-eyebrow">skill-manager-cli</p>
        <h1 id="smc-title" class="smc-title"><span>Manage agent skills like code.</span></h1>
        <p class="smc-lead">
          One declarative config.yaml for every coding assistant. Install skills from GitHub, local paths or custom Git
          hosts, and keep every agent's skill directory reproducible with a single command.
        </p>
        <div class="smc-cta">
          <a class="smc-btn smc-btn-primary" :href="GITHUB_URL" target="_blank" rel="noopener noreferrer"><svg class="smc-btn-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/></svg>GitHub</a>
          <a class="smc-btn" :href="RELEASES_URL" target="_blank" rel="noopener noreferrer">Download release</a>
        </div>
        <div class="smc-snippet">
          <code>$ {{ BREW_INSTALL }}</code>
          <button type="button" class="smc-copy" :aria-label="`Copy ${BREW_INSTALL}`" @click="copy('hero', BREW_INSTALL)">
            {{ copiedKey === 'hero' ? 'Copied' : 'Copy' }}
          </button>
        </div>
      </div>

      <div class="smc-hero-visual">
        <div class="smc-terminal" role="img" aria-label="Terminal running skill-manager-cli apply and installing skills">
          <div class="smc-terminal-bar" aria-hidden="true"><i /><i /><i /><span>skill-manager-cli</span></div>
          <pre class="smc-terminal-body" aria-hidden="true"><span class="smc-prompt">$</span> skill-manager-cli apply --dry-run
<span class="smc-info">plan</span> 3 skills to install, 1 to remove
<span class="smc-prompt">$</span> skill-manager-cli apply
<span class="smc-ok">✔</span> pi        + blog-banner
<span class="smc-ok">✔</span> codex     + blog-banner  → symlink
<span class="smc-ok">✔</span> claude    + blog-banner  → symlink
<span class="smc-ok">✔</span> Removed unused skill old-helper
<span class="smc-prompt">$</span> <span class="smc-caret" /></pre>
        </div>
        <figure class="smc-preview" role="img" aria-label="Declarative config.yaml with agent directories and skill repositories">
          <div class="smc-config" aria-hidden="true">
            <div class="smc-config-head"><strong>config.yaml</strong><span>declarative state</span></div>
            <pre>dirs:
  pi: ~/.pi/skills
  codex: ~/.codex/skills
skills:
  - repo: owner/repo
    skills:
      - name: "*"</pre>
          </div>
        </figure>
      </div>
    </section>

    <!-- How it works -->
    <section class="smc-section" aria-labelledby="smc-how">
      <h2 id="smc-how">How it works</h2>
      <ol class="smc-steps">
        <li v-for="(step, i) in steps" :key="step.title" class="smc-card">
          <span class="smc-step-n" aria-hidden="true">{{ i + 1 }}</span>
          <h3>{{ step.title }}</h3>
          <p>{{ step.text }}</p>
        </li>
      </ol>
    </section>

    <!-- Features -->
    <section class="smc-section" aria-labelledby="smc-features">
      <h2 id="smc-features">Features</h2>
      <ul class="smc-grid">
        <li v-for="f in features" :key="f.title" class="smc-card">
          <span class="smc-icon" aria-hidden="true">{{ f.icon }}</span>
          <h3>{{ f.title }}</h3>
          <p>{{ f.text }}</p>
        </li>
      </ul>
    </section>

    <!-- Quick start -->
    <section class="smc-section" aria-labelledby="smc-quick">
      <h2 id="smc-quick">Quick start</h2>
      <div class="smc-tabs">
        <div class="smc-tablist" role="tablist" aria-label="Quick start steps">
          <button
            v-for="(tab, i) in tabs"
            :id="`smc-tab-${tab.id}`"
            :key="tab.id"
            :ref="(el) => { if (el) tabRefs[i] = el as HTMLButtonElement }"
            type="button"
            role="tab"
            :aria-selected="activeTab === tab.id"
            :aria-controls="`smc-panel-${tab.id}`"
            :tabindex="activeTab === tab.id ? 0 : -1"
            class="smc-tab"
            @click="activeTab = tab.id"
            @keydown="onTabKeydown($event, i)"
          >
            {{ tab.label }}
          </button>
        </div>
        <div
          v-for="tab in tabs"
          v-show="activeTab === tab.id"
          :id="`smc-panel-${tab.id}`"
          :key="tab.id"
          role="tabpanel"
          :aria-labelledby="`smc-tab-${tab.id}`"
          tabindex="0"
          class="smc-code"
        >
          <pre><code>{{ tab.code }}</code></pre>
          <button type="button" class="smc-copy" :aria-label="`Copy ${tab.label} commands`" @click="copy(tab.id, tab.code)">
            {{ copiedKey === tab.id ? 'Copied' : 'Copy' }}
          </button>
        </div>
      </div>
    </section>

    <!-- Tech & license -->
    <section class="smc-section" aria-labelledby="smc-tech">
      <h2 id="smc-tech" class="smc-visually-hidden">Technology and license</h2>
      <ul class="smc-badges">
        <li v-for="t in techs" :key="t">{{ t }}</li>
        <li class="smc-badge-alt"><a :href="LICENSE_URL" target="_blank" rel="noopener noreferrer">MIT</a></li>
        <li class="smc-badge-ok">Status: active</li>
      </ul>
    </section>

    <!-- Footer CTA -->
    <section class="smc-section smc-final" aria-labelledby="smc-final">
      <h2 id="smc-final">Keep every agent in sync</h2>
      <div class="smc-cta smc-cta-center">
        <a class="smc-btn smc-btn-primary" :href="GITHUB_URL" target="_blank" rel="noopener noreferrer"><svg class="smc-btn-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/></svg>Star on GitHub</a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.smc {
  --smc-term-bg: #1e1f29;
  --smc-term-fg: #f8f8f2;
  --smc-term-muted: #9aa0bd;
  --smc-term-ok: #50fa7b;
  --smc-term-info: #8be9fd;
  --smc-term-accent: #f4b450;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px 64px;
  color: var(--vp-c-text-1);
}
.smc * {
  box-sizing: border-box;
}
.smc h1,
.smc h2,
.smc h3,
.smc p,
.smc ul,
.smc ol,
.smc pre {
  margin: 0;
  padding: 0;
  border: 0;
}
.smc ul,
.smc ol {
  list-style: none;
}
.smc a {
  color: var(--accent);
  font-weight: 500;
}
.smc a:hover {
  color: var(--accent-soft);
}
.smc-visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

/* Hero (mobile first: terminal first, preview second) */
.smc-hero {
  display: grid;
  gap: 32px;
  padding: 48px 0 24px;
}
.smc-eyebrow {
  font-family: var(--vp-font-family-mono);
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
}
.smc-title {
  margin-top: 8px;
  font-size: clamp(2rem, 6vw, 3.25rem);
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: -0.04em;
}
.smc-title span {
  background: linear-gradient(90deg, var(--vp-c-text-1), var(--accent-soft) 70%, var(--accent));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.smc-lead {
  margin-top: 16px;
  max-width: 36rem;
  color: var(--vp-c-text-2);
  font-size: 1.1rem;
  line-height: 1.6;
}
.smc-cta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}
.smc-cta-center {
  justify-content: center;
}
.smc-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 20px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1) !important;
  font-weight: 600;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}
.smc-btn-icon {
  flex: none;
}
.smc-btn:hover {
  border-color: var(--accent);
  background: color-mix(in srgb, var(--accent) 14%, var(--vp-c-bg-soft));
}
.smc-btn-primary {
  border-color: var(--accent);
  background: var(--accent);
  color: #1e1f29 !important;
}
.smc-btn-primary:hover {
  background: color-mix(in srgb, var(--accent) 85%, #1e1f29);
}
.smc-snippet {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  max-width: 30rem;
  margin-top: 20px;
  padding: 8px 8px 8px 16px;
  background: var(--smc-term-bg);
  color: var(--smc-term-fg);
  font-family: var(--vp-font-family-mono);
  font-size: 0.9rem;
}
.smc-snippet code {
  overflow-x: auto;
  white-space: nowrap;
  background: none;
  color: inherit;
}
.smc-copy {
  flex: none;
  min-height: 36px;
  min-width: 64px;
  padding: 0 12px;
  border: 1px solid #44475a;
  background: transparent;
  color: var(--smc-term-fg);
  font-family: var(--vp-font-family-mono);
  font-size: 0.8rem;
  cursor: pointer;
}
.smc-copy:hover {
  border-color: var(--smc-term-accent);
  color: var(--smc-term-accent);
}
.smc-copy:focus-visible {
  outline: 2px solid var(--smc-term-accent);
  outline-offset: 2px;
}

.smc-hero-visual {
  display: grid;
  gap: 16px;
  align-content: start;
}
.smc-terminal {
  background: var(--smc-term-bg);
  color: var(--smc-term-fg);
  border: 1px solid #44475a;
}
.smc-terminal-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  border-bottom: 1px solid #44475a;
  color: var(--smc-term-muted);
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
}
.smc-terminal-bar i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #44475a;
}
.smc-terminal-bar span {
  margin-left: 8px;
}
/* Two classes: the `.smc pre` reset above has higher specificity (class +
   attr + element) than a single-class scoped rule, and would zero the padding. */
.smc .smc-terminal-body {
  padding: 16px 20px;
  overflow-x: auto;
  font-family: var(--vp-font-family-mono);
  font-size: 0.85rem;
  line-height: 1.7;
  white-space: pre;
}
/* Keep breathing room on the right while scrolling: padding-right is
   swallowed at the scroll end in some engines, so pad via ::after. */
.smc .smc-terminal-body::after {
  content: '';
  display: inline-block;
  width: 0;
  padding-left: 16px;
}
.smc-prompt {
  color: var(--smc-term-accent);
}
.smc-ok {
  color: var(--smc-term-ok);
}
.smc-info {
  color: var(--smc-term-info);
}
.smc-caret {
  display: inline-block;
  width: 8px;
  height: 1em;
  vertical-align: text-bottom;
  background: var(--smc-term-fg);
  animation: smc-blink 1.1s steps(1) infinite;
}
@keyframes smc-blink {
  50% {
    opacity: 0;
  }
}

/* config.yaml preview (pure CSS/HTML mock, so there is no image to maintain) */
.smc-preview {
  margin: 0;
  padding: 16px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
}
.smc-config {
  background: var(--smc-term-bg);
  color: var(--smc-term-fg);
  box-shadow: 0 8px 30px -12px rgba(0, 0, 0, 0.4);
}
.smc-config-head {
  display: flex;
  flex-direction: column;
  padding: 10px 14px;
  border-bottom: 1px solid #44475a;
}
.smc-config-head strong {
  font-size: 0.85rem;
  font-family: var(--vp-font-family-mono);
}
.smc-config-head span {
  font-size: 0.7rem;
  color: var(--smc-term-muted);
  font-family: var(--vp-font-family-mono);
}
.smc-config pre {
  padding: 14px;
  overflow-x: auto;
  font-family: var(--vp-font-family-mono);
  font-size: 0.8rem;
  line-height: 1.7;
  color: var(--smc-term-fg);
}

/* Sections */
.smc-section {
  padding-top: 56px;
}
.smc-section h2 {
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.2;
}
.smc-sub {
  margin-top: 8px;
  color: var(--vp-c-text-2);
}
.smc-card {
  position: relative;
  padding: 20px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  transition: border-color 0.2s ease;
}
.smc-card:hover,
.smc-card:focus-within {
  border-color: color-mix(in srgb, var(--accent) 55%, transparent);
}
.smc-card h3 {
  margin-top: 8px;
  font-size: 1.05rem;
  font-weight: 600;
}
.smc-card p {
  margin-top: 6px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}
.smc-steps,
.smc-grid {
  display: grid;
  gap: 16px;
}
.smc .smc-steps,
.smc .smc-grid {
  margin-top: 48px;
}
.smc-step-n,
.smc-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-elv);
  color: var(--accent);
  font-family: var(--vp-font-family-mono);
  font-size: 0.85rem;
  font-weight: 500;
}

/* Tabs */
.smc-tabs {
  margin-top: 24px;
}
.smc-tablist {
  display: flex;
  gap: 4px;
  overflow-x: auto;
}
.smc-tab {
  min-height: 44px;
  padding: 0 18px;
  border: 1px solid var(--vp-c-divider);
  border-bottom: 0;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-family: var(--vp-font-family-mono);
  font-size: 0.85rem;
  cursor: pointer;
}
.smc-tab[aria-selected='true'] {
  background: var(--smc-term-bg);
  border-color: var(--smc-term-bg);
  color: var(--smc-term-fg);
}
.smc-tab:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.smc-code {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 16px;
  background: var(--smc-term-bg);
  color: var(--smc-term-fg);
}
.smc-code:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.smc-code pre {
  overflow-x: auto;
  font-family: var(--vp-font-family-mono);
  font-size: 0.85rem;
  line-height: 1.7;
}
.smc-code code {
  background: none;
  color: inherit;
  border: 0;
  padding: 0;
}

/* Badges */
.smc-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 24px;
  border-top: 1px solid var(--vp-c-divider);
}
.smc-badges li {
  padding: 4px 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-elv);
  font-family: var(--vp-font-family-mono);
  font-size: 0.8rem;
}
.smc-badge-ok {
  color: var(--green);
}

/* Footer CTA */
.smc-final {
  text-align: center;
}

@media (min-width: 640px) {
  .smc-steps {
    grid-template-columns: repeat(2, 1fr);
  }
  .smc-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 900px) {
  .smc-hero {
    grid-template-columns: 1.05fr 1fr;
    align-items: center;
    padding-top: 72px;
  }
  .smc-steps {
    grid-template-columns: repeat(3, 1fr);
  }
  .smc-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 899px) {
  /* terminal first, preview second: already the DOM order; keep the copy above both */
  .smc-hero-visual {
    order: 2;
  }
}
@media (prefers-reduced-motion: reduce) {
  .smc-caret {
    animation: none;
  }
  .smc-card,
  .smc-btn {
    transition: none;
  }
}
</style>
