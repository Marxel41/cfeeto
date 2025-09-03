import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // WICHTIG: Ersetze 'DEIN-REPO-NAME' mit dem Namen deines GitHub-Repositorys!
  // Beispiel: base: '/brettspiel-palast/',
  base: 'cfeeto',
})
