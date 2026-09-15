import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // This flags the standard pattern of seeding editable form state from
      // an async-fetched record (e.g. `useEffect(() => { if (data) setForm(data) }, [data])`),
      // which is the correct approach for edit forms backed by RTK Query and
      // has no simpler equivalent here. Keep it visible as a warning rather
      // than a hard build-breaking error.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
  {
    files: ['vite.config.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
])
