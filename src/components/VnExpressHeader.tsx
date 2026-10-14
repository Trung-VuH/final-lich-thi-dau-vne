import React from 'react';
import { 
  Calendar, 
  Trophy, 
  Filter,
  BarChart2
} from 'lucide-react';

interface VnExpressHeaderProps {
  currentTab: 'schedule' | 'results' | 'live' | 'standings';
  onTabChange: (tab: 'schedule' | 'results' | 'live' | 'standings') => void;
  liveCount: number;
  highlightCount?: number;
  onOpenLeaguesDrawer?: () => void;
  onOpenStandingsDrawer?: () => void;
  hasActiveFilters?: boolean;
  onNavigateHome?: () => void;
}

export const VnExpressHeader: React.FC<VnExpressHeaderProps> = ({
  currentTab,
  onTabChange,
  liveCount,
  onOpenLeaguesDrawer,
  onOpenStandingsDrawer,
  hasActiveFilters,
}) => {
  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-xs">
      <div className="max-w-[1130px] mx-auto px-2.5 sm:px-4 flex items-center justify-between gap-2 h-12">
        {/* Main Tabs: Lịch thi đấu & Kết quả & LIVE */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-1 whitespace-nowrap min-w-0">
          <button
            onClick={() => onTabChange('schedule')}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 transition-all flex-shrink-0 cursor-pointer ${
              currentTab === 'schedule'
                ? 'bg-[#9f224e] text-white shadow-xs'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-gray-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span>Lịch thi đấu</span>
          </button>

          <button
            onClick={() => onTabChange('results')}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 transition-all flex-shrink-0 cursor-pointer ${
              currentTab === 'results'
                ? 'bg-[#9f224e] text-white shadow-xs'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-gray-200'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span>Kết quả</span>
          </button>

          <button 
            onClick={() => onTabChange('live')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all flex-shrink-0 cursor-pointer ${
              currentTab === 'live' 
                ? 'bg-red-600 text-white shadow-xs ring-2 ring-red-300' 
                : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
            <span>LIVE</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              currentTab === 'live' ? 'bg-red-700 text-white' : 'bg-red-100 text-red-700'
            }`}>
              {liveCount}
            </span>
          </button>
        </div>

        {/* Mobile & Tablet Quick Drawer Buttons (visible on screen < 1024px) */}
        <div className="flex items-center gap-1.5 lg:hidden flex-shrink-0 pl-1">
          {onOpenLeaguesDrawer && (
            <button
              onClick={onOpenLeaguesDrawer}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                hasActiveFilters
                  ? 'bg-red-100 text-[#9f224e] border border-red-300 font-bold'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
              title="Mở danh sách giải đấu & đội bóng"
            >
              <Filter className="w-3.5 h-3.5 text-[#9f224e]" />
              <span className="hidden md:inline">Giải &amp; Đội</span>
              {hasActiveFilters && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
              )}
            </button>
          )}

          {onOpenStandingsDrawer && (
            <button
              onClick={onOpenStandingsDrawer}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 flex items-center gap-1 transition cursor-pointer"
              title="Xem Bảng xếp hạng"
            >
              <BarChart2 className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden md:inline">Bảng xếp hạng</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
