import { useState } from 'react';
import type { ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
  badge?: string | number;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultActiveTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
  variant?: 'default' | 'underline' | 'pills' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
}

export default function Tabs({
  tabs,
  defaultActiveTab,
  onTabChange,
  className = '',
  variant = 'default',
  size = 'md',
  orientation = 'horizontal',
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(
    defaultActiveTab || tabs[0]?.id || ''
  );

  const { baseStyles, sizeStyles, variantStyles } = getTabStyles();
  const currentVariant = variantStyles[variant];
  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  function handleTabClick(tabId: string) {
    if (tabs.find((tab) => tab.id === tabId)?.disabled) return;

    setActiveTab(tabId);
    onTabChange?.(tabId);
  }

  function getTabStyles() {
    const baseStyles = 'transition-all duration-200 cursor-pointer select-none';

    const sizeStyles = {
      sm: 'text-xs px-2 py-1',
      md: 'text-sm px-3 py-2',
      lg: 'text-base px-4 py-3',
    };

    const variantStyles = {
      default: {
        container:
          orientation === 'horizontal'
            ? 'flex bg-stone-800 rounded-lg p-1'
            : 'flex flex-col bg-stone-800 rounded-lg p-1 w-fit',
        tab: 'rounded-md font-medium',
        active: 'bg-stone-700 text-white shadow-sm',
        inactive: 'text-stone-400 hover:text-stone-300 hover:bg-stone-750',
      },
      underline: {
        container:
          orientation === 'horizontal'
            ? 'flex border-b border-stone-700'
            : 'flex flex-col border-r border-stone-700 w-fit',
        tab: 'font-medium relative',
        active:
          orientation === 'horizontal'
            ? 'text-white border-b-2 border-white -mb-px'
            : 'text-white border-r-2 border-white -mr-px',
        inactive: 'text-stone-400 hover:text-stone-300',
      },
      pills: {
        container:
          orientation === 'horizontal'
            ? 'flex gap-1'
            : 'flex flex-col gap-1 w-fit',
        tab: 'rounded-full font-medium border',
        active: 'bg-white text-stone-900 border-white',
        inactive:
          'text-stone-400 border-stone-600 hover:text-stone-300 hover:border-stone-500',
      },
      minimal: {
        container:
          orientation === 'horizontal'
            ? 'flex gap-4'
            : 'flex flex-col gap-2 w-fit',
        tab: 'font-medium',
        active: 'text-white',
        inactive: 'text-stone-400 hover:text-stone-300',
      },
    };

    return { baseStyles, sizeStyles, variantStyles };
  }

  return (
    <div className={`${className}`}>
      {/* Tab Headers */}
      <div className={currentVariant.container}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isDisabled = tab.disabled;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              disabled={isDisabled}
              className={`
                ${baseStyles}
                ${sizeStyles[size]}
                ${currentVariant.tab}
                ${isActive ? currentVariant.active : currentVariant.inactive}
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                flex items-center gap-2
              `}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-stone-900 bg-stone-300 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mt-4">{activeTabContent}</div>
    </div>
  );
}
