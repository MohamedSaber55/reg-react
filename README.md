# Real State Group (R.E.G) — Vite + React

Converted from Next.js to Vite + React with React Router DOM.

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set environment variables
Copy `.env.example` to `.env` and set your API URL:
```env
VITE_API_BASE_URL=https://your-api-domain.com
```

### 3. Run development server
```bash
npm run dev
```

### 4. Build for production
```bash
npm run build
```
The output will be in the `dist/` folder — deploy its contents to any static host.

## Deployment

### Hostinger / Apache
Upload contents of `dist/` to `public_html/`. The `.htaccess` in `public/` handles SPA routing automatically.

### Netlify
Drop the `dist/` folder into Netlify. The `_redirects` file handles routing.

### Vercel
Connect your repo — `vercel.json` handles routing.

## Project Structure
```
src/
  layouts/        # MainLayout, DashboardLayout, AuthLayout
  pages/
    main/         # Public pages (Home, About, Properties, Projects...)
    auth/         # Login, ForgotPassword, VerifyOtp, ResetPassword
    dashboard/    # Admin dashboard pages
  components/     # Reusable UI components
  dashboard/      # Dashboard-specific components (forms, sidebar...)
  store/          # Redux store + slices
  hooks/          # Custom hooks
  utils/          # Utilities (apiClient, i18n, helpers...)
  locales/        # Translation files (en.json, ar.json)
```
