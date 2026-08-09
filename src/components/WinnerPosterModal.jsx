import React, { useRef, useState } from 'react';
import { X, Download, Award, Share2, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';
import { MADRASA_INFO, GROUPS } from '../utils/constants';

export default function WinnerPosterModal({ winnerData, onClose }) {
  const posterRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  if (!winnerData) return null;

  const { studentName, chestNo, groupCode, eventTitle, category, place, points, gender } = winnerData;
  const group = GROUPS[groupCode] || GROUPS['GRP-A'];

  const placeLabel = place === 'first' ? '🥇 1st Place' : place === 'second' ? '🥈 2nd Place' : '🥉 3rd Place';
  const placeColor = place === 'first' ? 'from-amber-400 to-yellow-600' : place === 'second' ? 'from-slate-300 to-slate-500' : 'from-amber-600 to-amber-800';

  const handleDownload = async () => {
    if (!posterRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(posterRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0f172a',
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `Winner_Poster_${chestNo}_${studentName.replace(/\s+/g, '_')}.png`;
      link.click();
    } catch (err) {
      console.error("Poster generation error:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-slate-900 rounded-3xl p-4 sm:p-6 text-white border border-slate-700 shadow-2xl space-y-4 my-auto">
        
        {/* Header bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Winner Poster Generator</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Poster Card */}
        <div
          ref={posterRef}
          className="relative overflow-hidden rounded-2xl bg-slate-950 p-6 border-4 border-amber-500/40 text-center space-y-4 shadow-2xl"
          style={{ minHeight: '440px' }}
        >
          {/* Background Decorative Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

          {/* Madrasa Title Header */}
          <div className="space-y-1 relative z-10">
            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
              {MADRASA_INFO.madrasaName}
            </div>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-300">
              {MADRASA_INFO.festName}
            </h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-amber-400 to-emerald-400 mx-auto mt-1 rounded-full"></div>
          </div>

          {/* Rank Badge */}
          <div className="relative z-10 py-1">
            <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r ${placeColor} text-white font-black text-sm uppercase shadow-lg tracking-wider`}>
              <Award className="w-4 h-4" />
              <span>{placeLabel}</span>
            </div>
          </div>

          {/* Winner Name & Details */}
          <div className="relative z-10 space-y-1.5 py-2">
            <div className="text-xs font-extrabold text-amber-400 uppercase tracking-widest">
              OFFICIAL WINNER
            </div>
            <h1 className="text-2xl font-black text-white tracking-wide leading-tight">
              {studentName}
            </h1>
            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="px-3 py-1 bg-slate-800 rounded-lg text-xs font-black text-slate-200 border border-slate-700">
                Chest No: #{chestNo}
              </span>
              <span
                className="px-3 py-1 rounded-lg text-xs font-black text-white border"
                style={{ backgroundColor: group.color + '33', borderColor: group.color, color: group.color }}
              >
                {group.name}
              </span>
            </div>
          </div>

          {/* Event Info */}
          <div className="relative z-10 bg-slate-900/80 rounded-xl p-3 border border-slate-800 space-y-1">
            <div className="text-sm font-black text-emerald-300">
              {eventTitle}
            </div>
            <div className="text-[11px] font-semibold text-slate-400">
              Category: <span className="text-white font-bold">{category} ({gender})</span> • Points: <span className="text-amber-400 font-bold">{points} PTS</span>
            </div>
          </div>

          {/* Footer Branding */}
          <div className="relative z-10 pt-2 text-[9px] text-slate-500 font-semibold uppercase tracking-wider">
            Mahabba Meelad Islamic Arts Fest 2k26 • Official Digital Winner Card
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-sm shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Generating...' : 'Download Poster (PNG)'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
