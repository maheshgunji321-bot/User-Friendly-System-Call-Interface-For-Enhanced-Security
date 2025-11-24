# 🚀 Mahi OS Project

A modern, high‑performance React + Vite application designed for analytics, system monitoring, and interactive UI experiences.

This project integrates cutting‑edge frontend technologies including React 18, Vite, Redux Toolkit, Tailwind CSS, Framer Motion, and advanced data visualization tools.

---

## ✨ Features

* **⚛ React 18** – Fast, modern UI rendering
* **⚡ Vite** – Ultra‑fast dev server & bundler
* **🗂 Redux Toolkit** – Simplified global state management
* **🎨 Tailwind CSS** – Utility‑first styling with custom themes
* **🔀 React Router v6** – Efficient and declarative routing
* **📊 Data Visualization** – Powered by **D3.js** and **Recharts**
* **📝 React Hook Form** – Lightweight and performant form handling
* **🎞 Framer Motion** – Smooth animations & transitions
* **🧪 Testing Ready** – React Testing Library & Jest setup

---

## 📦 Prerequisites

Make sure you have the following installed:

* **Node.js 14+**
* **npm** or **yarn**

---

## 🛠️ Installation & Setup

1. **Install dependencies:**

```bash
npm install
# or
yarn install
```

2. **Start development server:**

```bash
npm start
# or
yarn start
```

3. **Build for production:**

```bash
npm run build
```

---

## 📁 Project Structure

```
mahi_os_project/
├── public/                   # Static assets
├── src/
│   ├── components/           # Reusable UI components
│   ├── pages/                # Application pages
│   ├── utils/                # Helper functions
│   ├── styles/               # Tailwind & global CSS
│   ├── App.jsx               # Root component
│   ├── Routes.jsx            # App routing configuration
│   └── index.jsx             # Entry point
├── .env                      # Environment variables
├── index.html                # Base HTML template
├── package.json              # Dependencies & scripts
├── tailwind.config.js        # Tailwind configuration
└── vite.config.js            # Vite config
```

---

## 🧭 Routing

To add new routes, edit **Routes.jsx**:

```jsx
import { useRoutes } from "react-router-dom";
import Dashboard from "pages/Dashboard";
import SystemCallMonitor from "pages/system-call-monitor";

const ProjectRoutes = () => {
  return useRoutes([
    { path: "/", element: <Dashboard /> },
    { path: "/monitor", element: <SystemCallMonitor /> },
  ]);
};
```

---

## 🎨 Styling with TailwindCSS

This project uses a fully customized Tailwind setup featuring:

* Forms plugin
* Typography plugin
* Aspect Ratio
* Container Queries
* Fluid Typography
* Custom Themes
* Animations

Global styles and theme variables are located in:

```
src/styles/tailwind.css
```

---

## 📱 Responsive Design

The UI is optimized using Tailwind's responsive breakpoints to ensure seamless performance across:

* Desktop
* Tablet
* Mobile

---

## 🚀 Deployment

To build for production:

```bash
npm run build
```

Deploy the generated `dist/` folder to any static hosting provider such as:

* Vercel
* Netlify
* GitHub Pages
* Cloudflare Pages

---

## 🙏 Acknowledgments

* Powered by **React** and **Vite**
* Styled using **Tailwind CSS**
