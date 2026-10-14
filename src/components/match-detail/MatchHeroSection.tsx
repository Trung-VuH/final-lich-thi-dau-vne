import React from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  User, 
  Calendar, 
  Share2, 
  ChevronRight,
  Flame,
  Radio,
  Tv
} from 'lucide-react';
import { FixtureItem } from '../../types/football';
import { formatKickoffVN } from '../../utils/footballUtils';

interface MatchHeroSectionProps {
  fixture: FixtureItem;
  onBack: () => void;
  onLeagueClick?: (leagueId: number) => void;
}

export const MatchHeroSection: React.FC<MatchHeroSectionProps> = ({
  fixture,
  onBack,
  onLeagueClick
}) => {
  const { time, fullDateVN } = formatKickoffVN(fixture.fixture.date);
  const status = fixture.fixture.status.short;
  const isFinished = ['FT', 'AET', 'PEN'].includes(status) || fixture.fixture.status.long.includes('Finished');
  const isLive = !isFinished && ['1H', '2H', 'HT', 'ET', 'LIVE'].includes(status);
  
  const home = fixture.teams.home;
  const away = fixture.teams.away;
  const homeGoals = fixture.goals.home ?? fixture.score.fulltime.home ?? 0;
  const awayGoals = fixture.goals.away ?? fixture.score.fulltime.away ?? 0;
  const htHome = fixture.score.halftime.home ?? 0;
  const htAway = fixture.score.halftime.away ?? 0;

  // Scorers list for home and away
  const homeScorers = fixture.events?.filter(e => e.type === 'Goal' && e.team.id === home.id) || [];
  const awayScorers = fixture.events?.filter(e => e.type === 'Goal' && e.team.id === away.id) || [];

  const [copied, setCopied] = React.useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden mb-5">
      {/* 1. Breadcrumb & Top bar */}
      <div className="bg-[#fafafa] px-3.5 sm:px-6 py-2.5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
        {/* Left: Breadcrumbs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-1 text-gray-600 hover:text-[#9f224e] font-medium transition py-0.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Lịch thi đấu & KQ</span>
          </button>
          <ChevronRight className="w-3 h-3 text-gray-300" />
          <span className="text-gray-400">Thể thao</span>
          <ChevronRight className="w-3 h-3 text-gray-300" />
          <span className="text-gray-400">Bóng đá</span>
          <ChevronRight className="w-3 h-3 text-gray-300" />
          <button 
            onClick={() => onLeagueClick && onLeagueClick(fixture.league.id)}
            className="font-semibold text-gray-800 hover:text-[#9f224e] transition"
          >
            {fixture.league.vietnameseName || fixture.league.name}
          </button>
          <span className="text-gray-300">•</span>
          <span className="text-gray-600 font-medium">{fixture.league.round || 'Vòng 1'}</span>
        </div>

        {/* Right: Venue & Referee & Share */}
        <div className="flex items-center gap-3 text-[11px] text-gray-500">
          <div className="hidden md:flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            <span>{fixture.fixture.venue?.name || 'Sân Emirates'}{fixture.fixture.venue?.city ? `, ${fixture.fixture.venue.city}` : ''}</span>
          </div>

          {fixture.fixture.referee && (
            <div className="hidden lg:flex items-center gap-1.5">
              <span className="text-gray-300">•</span>
              <User className="w-3.5 h-3.5 text-gray-400" />
              <span>Trọng tài: {fixture.fixture.referee}</span>
            </div>
          )}

          <button
            onClick={handleShare}
            className="p-1 text-gray-400 hover:text-[#9f224e] hover:bg-gray-100 rounded-md transition"
            title="Chia sẻ trận đấu"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Main Scoreboard */}
      <div className="p-4 sm:p-7 bg-gradient-to-b from-gray-50/50 to-white">
        
        {/* DESKTOP LAYOUT (>= 768px) */}
        <div className="hidden md:grid grid-cols-12 items-center gap-4">
          {/* Home Team (Col 5 - 40%) */}
          <div className="col-span-5 flex flex-col items-end text-right">
            <div className="flex items-center gap-3.5">
              <div>
                <h1 className={`text-xl lg:text-2xl font-black uppercase tracking-tight line-clamp-1 ${
                  isFinished && home.winner ? 'text-gray-950 font-black' : 'text-gray-800'
                }`}>
                  {home.name}
                </h1>
                <span className="text-xs text-gray-500 font-medium">Đội chủ nhà</span>
              </div>
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full p-2 bg-white border border-gray-200/80 shadow-xs flex items-center justify-center flex-shrink-0">
                <img 
                  src={home.logo} 
                  alt={home.name} 
                  className="w-10 h-10 lg:w-12 lg:h-12 object-contain" 
                  loading="eager"
                />
              </div>
            </div>

            {/* Home Scorers List */}
            {homeScorers.length > 0 && (
              <div className="mt-3 space-y-1 text-right">
                {homeScorers.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-end gap-1.5 text-xs text-gray-700">
                    <span className="font-semibold">{s.player.name} {s.time.elapsed}'{s.detail === 'Penalty' ? ' (Pen)' : ''}</span>
                    <span className="text-sm">⚽</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Center Score & Status (Col 2 - 20%) */}
          <div className="col-span-2 flex flex-col items-center justify-center text-center">
            {/* Status Badge */}
            {isLive ? (
              <div className="mb-2 inline-flex items-center gap-1.5 bg-red-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-xs animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white"></span>
                <span>LIVE {fixture.fixture.status.elapsed}'</span>
              </div>
            ) : isFinished ? (
              <div className="mb-2 inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-[11px] font-bold px-3 py-0.5 rounded-full border border-gray-200">
                <span>ĐÃ KẾT THÚC</span>
              </div>
            ) : (
              <div className="mb-2 inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-[11px] font-bold px-3 py-0.5 rounded-full border border-amber-200">
                <Calendar className="w-3 h-3 text-amber-600" />
                <span>{time} · {fullDateVN}</span>
              </div>
            )}

            {/* Score Numbers */}
            {isFinished || isLive ? (
              <div className="flex flex-col items-center">
                <div className="text-4xl lg:text-5xl font-black font-mono tracking-wider text-gray-900 select-all">
                  {homeGoals} <span className="text-gray-300 font-light mx-1">-</span> {awayGoals}
                </div>
                {fixture.score.halftime && fixture.score.halftime.home !== null && (
                  <span className="mt-1 text-xs text-gray-500 font-medium">
                    (Hiệp 1: {htHome} - {htAway})
                  </span>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="text-2xl lg:text-3xl font-black font-mono text-[#9f224e]">
                  {time}
                </div>
                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold mt-0.5">
                  Chưa bắt đầu
                </span>
              </div>
            )}

            {/* Broadcasters if available */}
            {fixture.broadcasters && fixture.broadcasters.length > 0 && !isFinished && (
              <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-500">
                <Tv className="w-3 h-3 text-gray-400" />
                <span className="font-medium">{fixture.broadcasters.map(b => b.name).join(', ')}</span>
              </div>
            )}
          </div>

          {/* Away Team (Col 5 - 40%) */}
          <div className="col-span-5 flex flex-col items-start text-left">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full p-2 bg-white border border-gray-200/80 shadow-xs flex items-center justify-center flex-shrink-0">
                <img 
                  src={away.logo} 
                  alt={away.name} 
                  className="w-10 h-10 lg:w-12 lg:h-12 object-contain" 
                  loading="eager"
                />
              </div>
              <div>
                <h2 className={`text-xl lg:text-2xl font-black uppercase tracking-tight line-clamp-1 ${
                  isFinished && away.winner ? 'text-gray-950 font-black' : 'text-gray-800'
                }`}>
                  {away.name}
                </h2>
                <span className="text-xs text-gray-500 font-medium">Đội khách</span>
              </div>
            </div>

            {/* Away Scorers List */}
            {awayScorers.length > 0 && (
              <div className="mt-3 space-y-1 text-left">
                {awayScorers.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-start gap-1.5 text-xs text-gray-700">
                    <span className="text-sm">⚽</span>
                    <span className="font-semibold">{s.player.name} {s.time.elapsed}'{s.detail === 'Penalty' ? ' (Pen)' : ''}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* MOBILE LAYOUT (< 768px) */}
        <div className="md:hidden space-y-4">
          {/* Row 1: Status & Info */}
          <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-100">
            <span className="font-bold text-gray-800">
              {fixture.league.vietnameseName} • {fixture.league.round}
            </span>

            {isLive ? (
              <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full animate-pulse">
                LIVE {fixture.fixture.status.elapsed}'
              </span>
            ) : isFinished ? (
              <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                ĐÃ KẾT THÚC
              </span>
            ) : (
              <span className="text-gray-500 font-medium">
                {time} - {fullDateVN}
              </span>
            )}
          </div>

          {/* Row 2: Logos & Big Score in center */}
          <div className="flex items-center justify-between px-2">
            {/* Home Logo */}
            <div className="flex flex-col items-center text-center w-24">
              <div className="w-13 h-13 rounded-full p-2 bg-white border border-gray-200 shadow-2xs flex items-center justify-center mb-1">
                <img src={home.logo} alt={home.name} className="w-9 h-9 object-contain" />
              </div>
              <span className="text-xs font-bold text-gray-900 line-clamp-1 uppercase">{home.shortName || home.name}</span>
            </div>

            {/* Score Center */}
            <div className="flex flex-col items-center">
              {isFinished || isLive ? (
                <>
                  <div className="text-3xl font-black font-mono tracking-wider text-gray-900">
                    {homeGoals} : {awayGoals}
                  </div>
                  {fixture.score.halftime && fixture.score.halftime.home !== null && (
                    <span className="text-[11px] text-gray-400 font-medium mt-0.5">
                      (HT {htHome} - {htAway})
                    </span>
                  )}
                </>
              ) : (
                <div className="text-xl font-black font-mono text-[#9f224e]">
                  {time}
                </div>
              )}
            </div>

            {/* Away Logo */}
            <div className="flex flex-col items-center text-center w-24">
              <div className="w-13 h-13 rounded-full p-2 bg-white border border-gray-200 shadow-2xs flex items-center justify-center mb-1">
                <img src={away.logo} alt={away.name} className="w-9 h-9 object-contain" />
              </div>
              <span className="text-xs font-bold text-gray-900 line-clamp-1 uppercase">{away.shortName || away.name}</span>
            </div>
          </div>

          {/* Row 4: Scorers columns */}
          {(homeScorers.length > 0 || awayScorers.length > 0) && (
            <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2 text-[11px]">
              <div className="space-y-0.5 text-left">
                {homeScorers.map((s, idx) => (
                  <div key={idx} className="text-gray-700">
                    ⚽ <span className="font-semibold">{s.player.name} {s.time.elapsed}'</span>
                  </div>
                ))}
              </div>
              <div className="space-y-0.5 text-right">
                {awayScorers.map((s, idx) => (
                  <div key={idx} className="text-gray-700">
                    <span className="font-semibold">{s.player.name} {s.time.elapsed}'</span> ⚽
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sân & trọng tài mobile */}
          <div className="text-[11px] text-gray-500 flex items-center justify-between pt-1 text-center">
            <span className="truncate">Sân: {fixture.fixture.venue?.name || 'Sân Emirates'}</span>
            {fixture.fixture.referee && (
              <span className="truncate">TT: {fixture.fixture.referee.split(',')[0]}</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
