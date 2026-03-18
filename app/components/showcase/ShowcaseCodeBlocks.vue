<template>
  <div class="showcase-code-blocks">
    <h2 class="showcase-section-title">{{ t('components.codeBlocks') }}</h2>

    <p class="text-medium-emphasis mb-6">
      Syntax-highlighted code blocks using PrismJS. Click the copy button to copy the code to your clipboard.
    </p>

    <v-row>
      <v-col v-for="block in codeBlocks" :key="block.language" cols="12" md="6">
        <div class="code-block-wrapper">
          <div class="code-block-header">
            <v-chip size="x-small" variant="tonal" :color="block.color">
              {{ block.label }}
            </v-chip>
            <v-btn
              icon
              size="x-small"
              variant="text"
              :color="copiedIndex === block.language ? 'success' : undefined"
              @click="copyCode(block.language, block.code)"
            >
              <v-icon>{{ copiedIndex === block.language ? 'mdi-check' : 'mdi-content-copy' }}</v-icon>
            </v-btn>
          </div>
          <pre class="code-block" :class="`language-${block.prismLang}`"><code :class="`language-${block.prismLang}`" v-html="highlightCode(block.code, block.prismLang)" /></pre>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markup'

const { t } = useI18n()
const copiedIndex = ref<string | null>(null)

const codeBlocks = [
  {
    language: 'javascript',
    label: 'JavaScript',
    color: 'warning',
    prismLang: 'javascript',
    code: `// Fetch data from an API
async function fetchUsers() {
  const response = await fetch('/api/users');
  const data = await response.json();
  return data.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
  }));
}`,
  },
  {
    language: 'typescript',
    label: 'TypeScript',
    color: 'info',
    prismLang: 'typescript',
    code: `interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

function greet(user: User): string {
  return \`Hello, \${user.name}!\`;
}`,
  },
  {
    language: 'python',
    label: 'Python',
    color: 'success',
    prismLang: 'python',
    code: `# Simple FastAPI endpoint
from fastapi import FastAPI

app = FastAPI()

@app.get("/items/{item_id}")
async def read_item(item_id: int):
    return {"item_id": item_id}`,
  },
  {
    language: 'html',
    label: 'HTML',
    color: 'error',
    prismLang: 'markup',
    code: `<template>
  <div class="card">
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
    <button @click="handleClick">
      Click Me
    </button>
  </div>
</template>`,
  },
  {
    language: 'css',
    label: 'CSS',
    color: 'secondary',
    prismLang: 'css',
    code: `.card {
  display: grid;
  gap: 1rem;
  padding: 2rem;
  border-radius: 12px;
  background: var(--surface);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
}`,
  },
]

function highlightCode(code: string, lang: string): string {
  const grammar = Prism.languages[lang]
  if (!grammar) return code
  return Prism.highlight(code, grammar, lang)
}

async function copyCode(language: string, code: string) {
  try {
    await navigator.clipboard.writeText(code)
    copiedIndex.value = language
    setTimeout(() => {
      copiedIndex.value = null
    }, 2000)
  }
  catch {
    // Clipboard API may not be available
  }
}
</script>

<style scoped>
.showcase-code-blocks {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.showcase-section-title {
  font-size: 1.5rem;
  font-weight: 700;
  font-family: var(--font-heading);
  margin-bottom: 8px;
}

.code-block-wrapper {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgb(var(--v-theme-on-surface), 0.1);
  background: rgb(var(--v-theme-surface));
  margin-bottom: 16px;
}

.code-block-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: rgb(var(--v-theme-on-surface), 0.04);
  border-bottom: 1px solid rgb(var(--v-theme-on-surface), 0.08);
}

.code-block {
  margin: 0;
  padding: 16px;
  overflow-x: auto;
  font-family: 'Fira Code', monospace;
  font-size: 0.8rem;
  line-height: 1.6;
  background: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
}

.code-block code {
  font-family: inherit;
  background: transparent;
}
</style>
