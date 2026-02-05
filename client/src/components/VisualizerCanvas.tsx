import { motion, AnimatePresence } from "framer-motion";
import { type Step, type AlgorithmType } from "@/lib/algorithms";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowLeft, ArrowRight, Split, Merge, Info } from "lucide-react";

interface VisualizerCanvasProps {
  step: Step;
  type: AlgorithmType;
  arraySize: number;
}

export function VisualizerCanvas({ step, type, arraySize }: VisualizerCanvasProps) {
  const { array, comparing, swapping, sorted, found, range, description } = step;
  const maxValue = Math.max(...array, 1);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-12 relative overflow-hidden p-8">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Main Algorithm Description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={description}
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl px-8 py-4 rounded-2xl border-2 border-primary/20 shadow-2xl text-lg font-bold text-primary flex items-center gap-4 max-w-3xl text-center"
        >
          <div className="p-2 bg-primary/10 rounded-lg">
            {description?.includes("Split") ? <Split className="w-5 h-5" /> : 
             description?.includes("Merge") ? <Merge className="w-5 h-5" /> :
             <Info className="w-5 h-5" />}
          </div>
          {description || "Initializing Visualizer..."}
        </motion.div>
      </AnimatePresence>

      {/* Visualization Canvas */}
      <div className="relative w-full max-w-5xl h-[400px] flex items-end justify-center gap-2 group">
        {array.map((value, idx) => {
          const isComparing = comparing.includes(idx);
          const isSwapping = swapping.includes(idx);
          const isSorted = sorted.includes(idx);
          const isFound = found === idx;
          const isInRange = range ? idx >= range[0] && idx <= range[1] : true;
          const isMid = range && idx === Math.floor(range[0] + (range[1] - range[0]) / 2);

          const height = `${(value / maxValue) * 100}%`;

          return (
            <motion.div
              key={`${idx}-${value}`}
              layout
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height,
                opacity: isInRange ? 1 : 0.15,
                scale: isComparing || isSwapping ? 1.05 : 1,
                z: isComparing || isSwapping ? 50 : 0
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 35,
                mass: 0.8
              }}
              className={cn(
                "relative flex-1 min-w-[12px] rounded-t-xl transition-all duration-300",
                "before:absolute before:inset-0 before:rounded-t-xl before:bg-gradient-to-b",
                isComparing ? [
                  "bg-amber-400 before:from-white/40 before:to-transparent shadow-[0_0_30px_rgba(251,191,36,0.4)]",
                  "ring-2 ring-amber-500 ring-offset-2 ring-offset-background"
                ] :
                isSwapping ? [
                  "bg-rose-500 before:from-white/40 before:to-transparent shadow-[0_0_30px_rgba(244,63,94,0.4)]",
                  "ring-2 ring-rose-600 ring-offset-2 ring-offset-background"
                ] :
                isFound ? [
                  "bg-emerald-500 before:from-white/40 before:to-transparent shadow-[0_0_40px_rgba(16,185,129,0.5)]",
                  "scale-110 z-20 ring-4 ring-emerald-400"
                ] :
                isSorted ? "bg-primary/80 before:from-white/20 before:to-transparent" :
                "bg-slate-300 dark:bg-zinc-800 before:from-white/10 before:to-transparent"
              )}
            >
              {/* Value Label */}
              <AnimatePresence>
                {(arraySize <= 25 || isComparing || isSwapping || isFound) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md text-xs font-black font-mono shadow-sm border",
                      isFound ? "bg-emerald-500 text-white border-emerald-400" :
                      isComparing ? "bg-amber-400 text-amber-950 border-amber-300" :
                      isSwapping ? "bg-rose-500 text-white border-rose-400" :
                      "bg-white dark:bg-zinc-800 text-foreground border-border"
                    )}
                  >
                    {value}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Visual Indicators */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                {isMid && isInRange && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-primary">
                    <ArrowDown className="w-4 h-4" />
                    <span className="text-[8px] font-bold">MID</span>
                  </motion.div>
                )}
                {range && idx === range[0] && (
                  <div className="text-blue-500">
                    <ArrowRight className="w-3 h-3" />
                    <span className="text-[8px] font-bold">START</span>
                  </div>
                )}
                {range && idx === range[1] && (
                  <div className="text-blue-500">
                    <ArrowLeft className="w-3 h-3" />
                    <span className="text-[8px] font-bold">END</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend & Context Panel */}
      <div className="relative z-10 w-full max-w-2xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm p-6 rounded-3xl border border-border shadow-xl grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex flex-col items-center gap-2">
          <div className="w-full h-2 bg-amber-400 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.3)]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Comparing</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-full h-2 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.3)]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Swapping</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-full h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Result</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-full h-2 bg-primary rounded-full" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sorted</span>
        </div>
      </div>
    </div>
  );
}
