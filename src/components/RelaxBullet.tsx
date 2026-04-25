import React, { useState, useRef, useEffect } from 'react';
import { Music, X, Play, Pause, GripVertical } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function RelaxBullet() {
  const [isVisible, setIsVisible] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Auto-play might be blocked by browser, so we'll listen for interaction
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else if (audioRef.current && !isPlaying) {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  if (!isVisible) return null;

  return (
    <motion.div 
      drag
      dragMomentum={false}
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-[#0f1721]/90 backdrop-blur-md border border-white/10 p-2 pr-3 rounded-full shadow-2xl group animate-in fade-in slide-in-from-bottom-4 duration-500 cursor-grab active:cursor-grabbing"
    >
      <div className="pl-2 text-white/30 group-hover:text-white/50 transition-colors">
        <GripVertical size={14} />
      </div>

      {/* Hidden audio element */}
      <audio 
        ref={audioRef} 
        src="/Happy_Nation.mp4" 
        loop
        autoPlay={false}
        onError={() => console.error("Erro ao carregar música. Verifique se o arquivo Happy_Nation.mp4 está na pasta public.")}
      />

      <div className={cn(
        "flex items-center justify-center w-8 h-8 rounded-full bg-nexora-neon/20 text-nexora-neon transition-all cursor-pointer hover:bg-nexora-neon/30 cursor-pointer pointer-events-auto",
        isPlaying && "animate-pulse"
      )} 
        onPointerDown={(e) => e.stopPropagation()} // Prevent dragging when clicking play
        onClick={(e) => { e.stopPropagation(); togglePlay(); }} 
        title={isPlaying ? "Pausar música" : "Tocar música"}
      >
        {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
      </div>

      <div className="flex flex-col select-none pointer-events-none px-1">
        <span className="text-[11px] font-medium text-white leading-none whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
          Happy Nation
        </span>
        <span className="text-[9px] text-gray-400 leading-none mt-0.5">
          Ace of Base
        </span>
      </div>

      <div className="w-px h-6 bg-white/10 mx-1"></div>

      <button 
        onPointerDown={(e) => e.stopPropagation()} // Prevent dragging when clicking close
        onClick={(e) => { e.stopPropagation(); setIsVisible(false); }}
        className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors pointer-events-auto"
        title="Fechar"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}
