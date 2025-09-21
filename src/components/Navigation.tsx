import React from 'react';
import { Home, Target, Calendar, StickyNote, TrendingUp, BarChart3 } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Accueil', icon: Home },
    { id: 'goals', label: 'Objectifs', icon: TrendingUp },
    { id: 'notes', label: 'Notes', icon: StickyNote },
    { id: 'calendar', label: 'Calendrier', icon: Calendar },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
  ];

  return (
    <nav className="bg-white shadow-sm border-t fixed bottom-0 left-0 right-0 z-50">
      <div className="overflow-x-auto">
        <div className="flex min-w-max">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex flex-col items-center py-2 px-3 min-w-0 flex-1 transition-colors ${
                activeTab === id
                  ? 'text-primary-500 bg-primary-50'
                  : 'text-gray-600 hover:text-primary-500 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-xs font-medium truncate">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;