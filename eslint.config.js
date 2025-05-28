import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  extends: [
    // Type-aware TypeScript rules
    ...tseslint.configs.recommendedTypeChecked,
    // Or use strictTypeChecked for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optional: stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  plugins: {
    // React-specific plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './frontend/tsconfig.app.json'],
      tsconfigRootDir: dirname(fileURLToPath(import.meta.url)),
    },
  },
  rules: {
    // React-specific rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
});
