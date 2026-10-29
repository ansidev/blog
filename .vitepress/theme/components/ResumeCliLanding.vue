<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref } from 'vue'

const GITHUB_URL = 'https://github.com/ansidev/resume-cli-ce'
const DEMO_URL = 'https://resume-theme-default-demo.pages.dev/'
const THEME_URL = 'https://github.com/ansidev/resume-theme-default'
const PROJECT_URL = '/projects/resume-cli'
const BREW_INSTALL = 'brew install resume-cli'

const steps = [
  {
    title: 'Write your data',
    text: 'Keep your experience, skills and education in one structured file, inspired by JSON Resume.',
  },
  {
    title: 'Pick a theme',
    text: 'Use the default theme or your own Handlebars theme. Preview changes live while you edit.',
  },
  {
    title: 'Run generate',
    text: 'Run resume-cli generate and get a PDF or an HTML file you can send or host anywhere.',
  },
]

const features = [
  {
    icon: '{{ }}',
    title: 'Handlebars themes',
    text: 'Themes are plain Handlebars templates. Copy one, change it, done.',
  },
  { icon: '>_', title: 'Live dev server', text: 'resume-cli dev serves your resume and reloads while you edit.' },
  { icon: 'PDF', title: 'PDF export', text: 'A headless Chrome (chromedp) renders the page to a print-ready PDF.' },
  {
    icon: 'Go',
    title: 'Go theme helpers',
    text: 'Write template helpers in Go. They are interpreted at runtime by yaegi.',
  },
  { icon: '{ }', title: 'Data, not documents', text: 'JSON Resume-inspired data. Diff it, review it, keep it in git.' },
  { icon: 'bin', title: 'Single binary', text: 'One executable, installed with Homebrew. No runtime to manage.' },
]

const tabs = [
  {
    id: 'install',
    label: 'Install',
    code: 'brew tap ansidev/resume-cli-ce https://github.com/ansidev/resume-cli-ce\nbrew trust --formula ansidev/resume-cli-ce/resume-cli\nbrew install resume-cli',
  },
  { id: 'dev', label: 'Dev', code: 'resume-cli dev' },
  { id: 'generate', label: 'Generate', code: 'resume-cli generate' },
]

const techs = ['Go', 'urfave/cli', 'Fiber', 'Handlebars']

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
  <div class="rc">
    <p class="rc-visually-hidden" role="status" aria-live="polite">{{ copiedKey ? 'Copied to clipboard' : '' }}</p>
    <!-- Hero -->
    <section class="rc-hero" aria-labelledby="rc-title">
      <div class="rc-hero-copy">
        <p class="rc-eyebrow">Resume CLI</p>
        <h1 id="rc-title" class="rc-title"><span>Generate a beautiful resume from data.</span></h1>
        <p class="rc-lead">
          Your resume is data. Ship it like code. Write it once, pick a theme, and generate a PDF or HTML resume with one
          command.
        </p>
        <div class="rc-cta">
          <a class="rc-btn rc-btn-primary" :href="DEMO_URL" target="_blank" rel="noopener noreferrer">View demo</a>
          <a class="rc-btn" :href="GITHUB_URL" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
        <div class="rc-snippet">
          <code>$ {{ BREW_INSTALL }}</code>
          <button type="button" class="rc-copy" :aria-label="`Copy ${BREW_INSTALL}`" @click="copy('hero', BREW_INSTALL)">
            {{ copiedKey === 'hero' ? 'Copied' : 'Copy' }}
          </button>
        </div>
      </div>

      <div class="rc-hero-visual">
        <div class="rc-terminal" role="img" aria-label="Terminal running resume-cli generate and writing resume.pdf">
          <div class="rc-terminal-bar" aria-hidden="true"><i /><i /><i /><span>resume-cli</span></div>
          <pre class="rc-terminal-body" aria-hidden="true"><span class="rc-prompt">$</span> resume-cli generate
<span class="rc-ok">✔</span> Loaded resume data
<span class="rc-ok">✔</span> Rendered theme resume-theme-default
<span class="rc-ok">✔</span> Wrote resume.pdf
<span class="rc-prompt">$</span> <span class="rc-caret" /></pre>
        </div>
        <figure class="rc-preview" role="img" aria-label="Preview of a resume rendered with the default theme">
          <div class="rc-paper" aria-hidden="true">
            <div class="rc-paper-head">
              <strong>Jane Doe</strong>
              <span>Software Engineer</span>
            </div>
            <h3>Experience</h3>
            <div class="rc-line rc-w90" />
            <div class="rc-line rc-w70" />
            <div class="rc-line rc-w80" />
            <h3>Skills</h3>
            <div class="rc-tags"><i /><i /><i /><i /></div>
            <h3>Education</h3>
            <div class="rc-line rc-w60" />
          </div>
        </figure>
      </div>
    </section>

    <!-- How it works -->
    <section class="rc-section" aria-labelledby="rc-how">
      <h2 id="rc-how">How it works</h2>
      <ol class="rc-steps">
        <li v-for="(step, i) in steps" :key="step.title" class="rc-card">
          <span class="rc-step-n" aria-hidden="true">{{ i + 1 }}</span>
          <h3>{{ step.title }}</h3>
          <p>{{ step.text }}</p>
        </li>
      </ol>
    </section>

    <!-- Features -->
    <section class="rc-section" aria-labelledby="rc-features">
      <h2 id="rc-features">Features</h2>
      <ul class="rc-grid">
        <li v-for="f in features" :key="f.title" class="rc-card">
          <span class="rc-icon" aria-hidden="true">{{ f.icon }}</span>
          <h3>{{ f.title }}</h3>
          <p>{{ f.text }}</p>
        </li>
      </ul>
    </section>

    <!-- Live demo -->
    <section class="rc-section" aria-labelledby="rc-demo">
      <h2 id="rc-demo">Live demo</h2>
      <p class="rc-sub">The default theme, rendered from sample data.</p>
      <div class="rc-frame">
        <iframe
          :src="DEMO_URL"
          title="Resume rendered with the default theme"
          loading="lazy"
          referrerpolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
      <p><a class="rc-btn" :href="DEMO_URL" target="_blank" rel="noopener noreferrer">Open full demo</a></p>
    </section>

    <!-- Quick start -->
    <section class="rc-section" aria-labelledby="rc-quick">
      <h2 id="rc-quick">Quick start</h2>
      <div class="rc-tabs">
        <div class="rc-tablist" role="tablist" aria-label="Quick start steps">
          <button
            v-for="(tab, i) in tabs"
            :id="`rc-tab-${tab.id}`"
            :key="tab.id"
            :ref="(el) => { if (el) tabRefs[i] = el as HTMLButtonElement }"
            type="button"
            role="tab"
            :aria-selected="activeTab === tab.id"
            :aria-controls="`rc-panel-${tab.id}`"
            :tabindex="activeTab === tab.id ? 0 : -1"
            class="rc-tab"
            @click="activeTab = tab.id"
            @keydown="onTabKeydown($event, i)"
          >
            {{ tab.label }}
          </button>
        </div>
        <div
          v-for="tab in tabs"
          v-show="activeTab === tab.id"
          :id="`rc-panel-${tab.id}`"
          :key="tab.id"
          role="tabpanel"
          :aria-labelledby="`rc-tab-${tab.id}`"
          tabindex="0"
          class="rc-code"
        >
          <pre><code>{{ tab.code }}</code></pre>
          <button type="button" class="rc-copy" :aria-label="`Copy ${tab.label} commands`" @click="copy(tab.id, tab.code)">
            {{ copiedKey === tab.id ? 'Copied' : 'Copy' }}
          </button>
        </div>
      </div>
    </section>

    <!-- Themes -->
    <section class="rc-section" aria-labelledby="rc-themes">
      <h2 id="rc-themes">Themes</h2>
      <div class="rc-themes">
        <article class="rc-card">
          <h3>resume-theme-default</h3>
          <p>The default theme: clean, printable and ready to use.</p>
          <p class="rc-links">
            <a :href="THEME_URL" target="_blank" rel="noopener noreferrer">Repository</a>
            <a :href="DEMO_URL" target="_blank" rel="noopener noreferrer">Demo</a>
          </p>
        </article>
        <article class="rc-card">
          <h3>Build your own theme</h3>
          <p>A theme is a set of Handlebars templates plus optional Go helpers. Start from the default theme.</p>
          <p class="rc-links">
            <a :href="THEME_URL" target="_blank" rel="noopener noreferrer">Start from the default theme</a>
          </p>
        </article>
      </div>
    </section>

    <!-- Tech & license -->
    <section class="rc-section" aria-labelledby="rc-tech">
      <h2 id="rc-tech" class="rc-visually-hidden">Technology and license</h2>
      <ul class="rc-badges">
        <li v-for="t in techs" :key="t">{{ t }}</li>
        <li class="rc-badge-alt"><a href="https://github.com/ansidev/resume-cli-ce/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">AGPL-3.0</a></li>
        <li class="rc-badge-ok">Status: active</li>
      </ul>
    </section>

    <!-- Footer CTA -->
    <section class="rc-section rc-final" aria-labelledby="rc-final">
      <h2 id="rc-final">Ship your resume like code</h2>
      <div class="rc-cta rc-cta-center">
        <a class="rc-btn rc-btn-primary" :href="GITHUB_URL" target="_blank" rel="noopener noreferrer">Star on GitHub</a>
        <a class="rc-btn" :href="PROJECT_URL">Project page</a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.rc {
  --rc-term-bg: #1e1f29;
  --rc-term-fg: #f8f8f2;
  --rc-term-muted: #9aa0bd;
  --rc-term-ok: #50fa7b;
  --rc-term-accent: #bd93f9;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px 64px;
  color: var(--vp-c-text-1);
}
.rc * {
  box-sizing: border-box;
}
.rc h1,
.rc h2,
.rc h3,
.rc p,
.rc ul,
.rc ol,
.rc pre {
  margin: 0;
  padding: 0;
  border: 0;
}
.rc ul,
.rc ol {
  list-style: none;
}
.rc a {
  color: var(--accent);
  font-weight: 500;
}
.rc a:hover {
  color: var(--accent-soft);
}
.rc-visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

/* Hero (mobile first: terminal first, preview second) */
.rc-hero {
  display: grid;
  gap: 32px;
  padding: 48px 0 24px;
}
.rc-eyebrow {
  font-family: var(--vp-font-family-mono);
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
}
.rc-title {
  margin-top: 8px;
  font-size: clamp(2rem, 6vw, 3.25rem);
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: -0.04em;
}
.rc-title span {
  background: linear-gradient(90deg, var(--vp-c-text-1), var(--accent-soft) 70%, var(--accent));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.rc-lead {
  margin-top: 16px;
  max-width: 36rem;
  color: var(--vp-c-text-2);
  font-size: 1.1rem;
  line-height: 1.6;
}
.rc-cta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}
.rc-cta-center {
  justify-content: center;
}
.rc-btn {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 20px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1) !important;
  font-weight: 600;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}
.rc-btn:hover {
  border-color: var(--accent);
  background: color-mix(in srgb, var(--accent) 14%, var(--vp-c-bg-soft));
}
.rc-btn-primary {
  border-color: var(--accent);
  background: var(--accent);
  color: #fff !important;
}
.rc-btn-primary:hover {
  background: var(--vp-c-brand-3);
}
.rc-snippet {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  max-width: 26rem;
  margin-top: 20px;
  padding: 8px 8px 8px 16px;
  background: var(--rc-term-bg);
  color: var(--rc-term-fg);
  font-family: var(--vp-font-family-mono);
  font-size: 0.9rem;
}
.rc-snippet code {
  overflow-x: auto;
  white-space: nowrap;
  background: none;
  color: inherit;
}
.rc-copy {
  flex: none;
  min-height: 36px;
  min-width: 64px;
  padding: 0 12px;
  border: 1px solid #44475a;
  background: transparent;
  color: var(--rc-term-fg);
  font-family: var(--vp-font-family-mono);
  font-size: 0.8rem;
  cursor: pointer;
}
.rc-copy:hover {
  border-color: var(--rc-term-accent);
  color: var(--rc-term-accent);
}
.rc-copy:focus-visible {
  outline: 2px solid var(--rc-term-accent);
  outline-offset: 2px;
}

.rc-hero-visual {
  display: grid;
  gap: 16px;
  align-content: start;
}
.rc-terminal {
  background: var(--rc-term-bg);
  color: var(--rc-term-fg);
  border: 1px solid #44475a;
}
.rc-terminal-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  border-bottom: 1px solid #44475a;
  color: var(--rc-term-muted);
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
}
.rc-terminal-bar i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #44475a;
}
.rc-terminal-bar span {
  margin-left: 8px;
}
.rc-terminal-body {
  padding: 16px;
  overflow-x: auto;
  font-family: var(--vp-font-family-mono);
  font-size: 0.85rem;
  line-height: 1.7;
  white-space: pre;
}
.rc-prompt {
  color: var(--rc-term-accent);
}
.rc-ok {
  color: var(--rc-term-ok);
}
.rc-caret {
  display: inline-block;
  width: 8px;
  height: 1em;
  vertical-align: text-bottom;
  background: var(--rc-term-fg);
  animation: rc-blink 1.1s steps(1) infinite;
}
@keyframes rc-blink {
  50% {
    opacity: 0;
  }
}

/* Resume preview (pure CSS mock, so there is no image to maintain) */
.rc-preview {
  margin: 0;
  padding: 16px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
}
.rc-paper {
  padding: 20px;
  background: #fff;
  color: #1f1f1f;
  box-shadow: 0 8px 30px -12px rgba(0, 0, 0, 0.4);
}
.rc-paper-head {
  display: flex;
  flex-direction: column;
  padding-bottom: 8px;
  border-bottom: 2px solid #644ac9;
}
.rc-paper-head strong {
  font-size: 1.1rem;
}
.rc-paper-head span {
  font-size: 0.8rem;
  color: #4b4b52;
}
.rc-paper h3 {
  margin: 14px 0 6px;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #644ac9;
}
.rc-line {
  height: 6px;
  margin-bottom: 6px;
  background: #dcdce2;
}
.rc-w90 {
  width: 90%;
}
.rc-w80 {
  width: 80%;
}
.rc-w70 {
  width: 70%;
}
.rc-w60 {
  width: 60%;
}
.rc-tags {
  display: flex;
  gap: 6px;
}
.rc-tags i {
  width: 44px;
  height: 14px;
  background: #e4defa;
}

/* Sections */
.rc-section {
  padding-top: 56px;
}
.rc-section h2 {
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.2;
}
.rc-sub {
  margin-top: 8px;
  color: var(--vp-c-text-2);
}
.rc-card {
  position: relative;
  padding: 20px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  transition: border-color 0.2s ease;
}
.rc-card:hover,
.rc-card:focus-within {
  border-color: color-mix(in srgb, var(--accent) 55%, transparent);
}
.rc-card h3 {
  margin-top: 8px;
  font-size: 1.05rem;
  font-weight: 600;
}
.rc-card p {
  margin-top: 6px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}
.rc-steps,
.rc-grid,
.rc-themes {
  display: grid;
  gap: 16px;
  margin-top: 24px;
}
.rc-step-n,
.rc-icon {
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
.rc-links {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

/* Live demo */
.rc-frame {
  margin: 20px 0 16px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-elv);
}
.rc-frame iframe {
  display: block;
  width: 100%;
  height: 420px;
  border: 0;
  background: #fff;
}

/* Tabs */
.rc-tabs {
  margin-top: 24px;
}
.rc-tablist {
  display: flex;
  gap: 4px;
  overflow-x: auto;
}
.rc-tab {
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
.rc-tab[aria-selected='true'] {
  background: var(--rc-term-bg);
  border-color: var(--rc-term-bg);
  color: var(--rc-term-fg);
}
.rc-tab:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.rc-code {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 16px;
  background: var(--rc-term-bg);
  color: var(--rc-term-fg);
}
.rc-code:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.rc-code pre {
  overflow-x: auto;
  font-family: var(--vp-font-family-mono);
  font-size: 0.85rem;
  line-height: 1.7;
}
.rc-code code {
  background: none;
  color: inherit;
  border: 0;
  padding: 0;
}

/* Badges */
.rc-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 24px;
  border-top: 1px solid var(--vp-c-divider);
}
.rc-badges li {
  padding: 4px 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-elv);
  font-family: var(--vp-font-family-mono);
  font-size: 0.8rem;
}
.rc-badge-ok {
  color: var(--green);
}

/* Footer CTA */
.rc-final {
  text-align: center;
}

@media (min-width: 640px) {
  .rc-steps,
  .rc-themes {
    grid-template-columns: repeat(2, 1fr);
  }
  .rc-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 900px) {
  .rc-hero {
    grid-template-columns: 1.05fr 1fr;
    align-items: center;
    padding-top: 72px;
  }
  .rc-steps {
    grid-template-columns: repeat(3, 1fr);
  }
  .rc-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .rc-frame iframe {
    height: 560px;
  }
}
@media (max-width: 899px) {
  /* terminal first, preview second: already the DOM order; keep the copy above both */
  .rc-hero-visual {
    order: 2;
  }
}
@media (prefers-reduced-motion: reduce) {
  .rc-caret {
    animation: none;
  }
  .rc-card,
  .rc-btn {
    transition: none;
  }
}
</style>
