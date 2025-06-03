// utils/theme.ts
import { type Theme } from '../types';

export const themeConfig = {
  stone: {
    bg: {
      primary: 'bg-stone-950',
      secondary: 'bg-stone-900',
      tertiary: 'bg-stone-800',
      active: 'bg-stone-700',
    },
    hover: 'hover:bg-stone-800',
    text: {
      primary: 'text-stone-100',
      secondary: 'text-stone-300',
      muted: 'text-stone-500',
    },
    border: 'border-stone-700',
    accent: 'bg-stone-600',
  },
  slate: {
    bg: {
      primary: 'bg-slate-950',
      secondary: 'bg-slate-900',
      tertiary: 'bg-slate-800',
      active: 'bg-slate-700',
    },
    hover: 'hover:bg-slate-800',
    text: {
      primary: 'text-slate-100',
      secondary: 'text-slate-300',
      muted: 'text-slate-500',
    },
    border: 'border-slate-700',
    accent: 'bg-slate-600',
  },
  zinc: {
    bg: {
      primary: 'bg-zinc-950',
      secondary: 'bg-zinc-900',
      tertiary: 'bg-zinc-800',
      active: 'bg-zinc-700',
    },
    hover: 'hover:bg-zinc-800',
    text: {
      primary: 'text-zinc-100',
      secondary: 'text-zinc-300',
      muted: 'text-zinc-500',
    },
    border: 'border-zinc-700',
    accent: 'bg-zinc-600',
  },
  neutral: {
    bg: {
      primary: 'bg-neutral-950',
      secondary: 'bg-neutral-900',
      tertiary: 'bg-neutral-800',
      active: 'bg-neutral-700',
    },
    hover: 'hover:bg-neutral-800',
    text: {
      primary: 'text-neutral-100',
      secondary: 'text-neutral-300',
      muted: 'text-neutral-500',
    },
    border: 'border-neutral-700',
    accent: 'bg-neutral-600',
  },
  gray: {
    bg: {
      primary: 'bg-gray-950',
      secondary: 'bg-gray-900',
      tertiary: 'bg-gray-800',
      active: 'bg-gray-700',
    },
    hover: 'hover:bg-gray-800',
    text: {
      primary: 'text-gray-100',
      secondary: 'text-gray-300',
      muted: 'text-gray-500',
    },
    border: 'border-gray-700',
    accent: 'bg-gray-600',
  },
};

export const getThemeClasses = (theme: Theme) => themeConfig[theme];

export const applyThemeToDocument = (theme: Theme) => {
  const root = document.documentElement;
  const classes = getThemeClasses(theme);
  
  // Remove existing theme classes
  Object.values(themeConfig).forEach(themeClass => {
    root.classList.remove(themeClass.bg.primary.replace('bg-', ''));
  });
  
  // Add new theme class
  root.classList.add(classes.bg.primary.replace('bg-', ''));
};