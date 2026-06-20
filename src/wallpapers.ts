import { WallpaperConfig } from './types';

export const BUILTIN_WALLPAPERS: WallpaperConfig[] = [
  // --- macOS Collection ---
  {
    id: 'sequoia-dynamic',
    name: 'macOS Sequoia Dynamic',
    type: 'image',
    value: 'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2560&q=85")',
    valueDark: 'url("https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=2560&q=85")',
    category: 'macos',
    themeSupport: 'dynamic',
    author: 'Apple Inspired / Unsplash'
  },
  {
    id: 'sequoia-dark',
    name: 'macOS Sequoia Dark Peak',
    type: 'gradient',
    value: 'linear-gradient(135deg, #2b1055 0%, #75225b 40%, #b23a48 100%)',
    valueDark: 'linear-gradient(135deg, #15052e 0%, #441134 50%, #611822 100%)',
    category: 'macos',
    themeSupport: 'dark',
    author: 'Macify Lab'
  },
  {
    id: 'sonoma-light',
    name: 'macOS Sonoma Horizon',
    type: 'image',
    value: 'url("https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=2560&q=85")',
    valueDark: 'url("https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=2560&q=85")',
    category: 'macos',
    themeSupport: 'dynamic',
    author: 'Unsplash Horizon'
  },
  {
    id: 'sonoma-dark',
    name: 'macOS Sonoma Nightside',
    type: 'gradient',
    value: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    category: 'macos',
    themeSupport: 'dark',
    author: 'Macify Lab'
  },
  {
    id: 'ventura-light',
    name: 'macOS Ventura Sunrise',
    type: 'image',
    value: 'url("https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&w=2560&q=85")',
    valueDark: 'url("https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=2560&q=85")',
    category: 'macos',
    themeSupport: 'dynamic',
    author: 'Unsplash Abstract'
  },
  {
    id: 'ventura-dark',
    name: 'macOS Ventura Midnight',
    type: 'gradient',
    value: 'linear-gradient(135deg, #1e0533 0%, #4c0c4c 50%, #8c1c44 100%)',
    category: 'macos',
    themeSupport: 'dark',
    author: 'Macify Lab'
  },
  {
    id: 'monterey-light',
    name: 'macOS Monterey Lavender',
    type: 'image',
    value: 'url("https://images.unsplash.com/photo-1618005198143-e528346d9a59?auto=format&fit=crop&w=2560&q=85")',
    valueDark: 'url("https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=2560&q=85")',
    category: 'macos',
    themeSupport: 'dynamic',
    author: 'Unsplash Lavender Wave'
  },
  {
    id: 'monterey-dark',
    name: 'macOS Monterey Crevasse',
    type: 'gradient',
    value: 'linear-gradient(135deg, #0d0b21 0%, #211138 55%, #46164d 100%)',
    category: 'macos',
    themeSupport: 'dark',
    author: 'Macify Lab'
  },
  {
    id: 'bigsur-light',
    name: 'macOS Big Sur Ocean',
    type: 'image',
    value: 'url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2560&q=85")',
    valueDark: 'url("https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&w=2560&q=85")',
    category: 'macos',
    themeSupport: 'dynamic',
    author: 'Unsplash Big Sur Coast'
  },

  // --- Apple Keynote & Fluid Presentations ---
  {
    id: 'keynote-spring',
    name: 'Cupertino Keynote Neon Waves',
    type: 'image',
    value: 'url("https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=2560&q=85")',
    category: 'keynote',
    themeSupport: 'dark',
    author: 'Apple Event 2026 Style'
  },
  {
    id: 'keynote-glow',
    name: 'Satin Ribbon Glow',
    type: 'image',
    value: 'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2560&q=85")',
    category: 'keynote',
    themeSupport: 'light',
    author: 'Satin Labs'
  },

  // --- Modern Abstract Design ---
  {
    id: 'abstract-fluid',
    name: 'Vibrant Paint Fluidity',
    type: 'image',
    value: 'url("https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=2560&q=85")',
    category: 'abstract',
    themeSupport: 'dark',
    author: 'Unsplash Fine Art'
  },
  {
    id: 'abstract-shapes',
    name: 'Creative Pastel Geometry',
    type: 'image',
    value: 'url("https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=2560&q=85")',
    category: 'abstract',
    themeSupport: 'light',
    author: 'Unsplash Design'
  },

  // --- Aurora / Cosmic Gradients ---
  {
    id: 'aurora-borealis',
    name: 'Nordic Aurora Dream',
    type: 'image',
    value: 'url("https://images.unsplash.com/photo-1531315630201-bb15abeb1653?auto=format&fit=crop&w=2560&q=85")',
    category: 'aurora',
    themeSupport: 'dark',
    author: 'Nordic Photo Guild'
  },
  {
    id: 'aurora-dusk',
    name: 'Warm Magenta Aurora',
    type: 'gradient',
    value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    category: 'aurora',
    themeSupport: 'light',
    author: 'Macify Lab'
  },

  // --- Glassmorphism Art ---
  {
    id: 'glass-sculpture',
    name: 'Frosted Glass Geometry 4K',
    type: 'image',
    value: 'url("https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=2560&q=85")',
    category: 'glassmorphism',
    themeSupport: 'dynamic',
    author: 'Raytracing Studios'
  },

  // --- Minimal Landscapes ---
  {
    id: 'landscape-golden',
    name: 'Coastal Sunset Horizon',
    type: 'image',
    value: 'url("https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&w=2560&q=85")',
    category: 'landscape',
    themeSupport: 'light',
    author: 'Pixel Cove'
  },
  {
    id: 'landscape-mount',
    name: 'Pristine Mountain Ridge',
    type: 'image',
    value: 'url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2560&q=85")',
    category: 'landscape',
    themeSupport: 'dynamic',
    author: 'Alpine Guides'
  },

  // --- Professional Dark Mode Themes ---
  {
    id: 'dark-editorial',
    name: 'Midnight Architectural Slate',
    type: 'gradient',
    value: 'radial-gradient(circle at top left, #ff3b30 0%, transparent 45%), radial-gradient(circle at top right, #5856d6 0%, transparent 45%), radial-gradient(circle at bottom left, #ffcc00 0%, transparent 45%), radial-gradient(circle at bottom right, #007aff 0%, transparent 45%), #151515',
    category: 'minimal',
    themeSupport: 'dark',
    author: 'Cupertino Designers'
  },
  {
    id: 'dark-monolith',
    name: 'Extreme Professional Carbon',
    type: 'image',
    value: 'url("https://images.unsplash.com/photo-1502239608882-93b729c6af43?auto=format&fit=crop&w=2560&q=85")',
    category: 'minimal',
    themeSupport: 'dark',
    author: 'Textured Labs'
  }
];
