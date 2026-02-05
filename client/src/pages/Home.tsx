import { useState, useEffect, useRef } from "react";
import { VisualizerCanvas } from "@/components/VisualizerCanvas";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Pause, RotateCcw, Shuffle, Info, Settings2 } from "lucide-react";
import { 
  type AlgorithmName, 
  type Step, 
  ALGORITHM_INFO,
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  linearSearch,
  binarySearch,
  sleep 
} from "@/lib/algorithms";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const generateArray = (size: number, sorted = false) => {
  const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5);
  return sorted ? arr.sort((a, b) => a - b) : arr;
};

export default function Home() {
  const [arraySize, setArraySize] = useState(30);
  const [speed, setSpeed] = useState(50);
  const [algorithm, setAlgorithm] = useState<AlgorithmName>('bubble');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step | null>(null);
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0 });
  const [searchTarget, setSearchTarget] = useState<string>("");
  const [customInput, setCustomInput] = useState<string>("");

  const stopRef = useRef(false);
  const generatorRef = useRef<Generator<Step> | null>(null);
  const initialArrayRef = useRef<number[]>([]);

  const { toast } = useToast();
  const algInfo = ALGORITHM_INFO[algorithm];

  useEffect(() => {
    reset();
  }, [arraySize, algorithm]);

  const reset = () => {
    stopRef.current = true;
    setIsPlaying(false);
    setIsFinished(false);
    setStats({ comparisons: 0, swaps: 0 });
    generatorRef.current = null;
    
    const isBinary = algorithm === 'binary';
    const newArray = generateArray(arraySize, isBinary);
    initialArrayRef.current = newArray;
    
    if (algInfo.type === 'searching') {
      const target = newArray[Math.floor(Math.random() * newArray.length)];
      setSearchTarget(target.toString());
    } else {
      setSearchTarget("");
    }

    setCustomInput(newArray.join(", "));
    setCurrentStep({
      array: newArray,
      comparing: [],
      swapping: [],
      sorted: [],
    });
  };

  const handleCustomInput = (val: string) => {
    setCustomInput(val);
    const parsed = val.split(",")
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n));
    
    if (parsed.length > 0) {
      stopRef.current = true;
      setIsPlaying(false);
      setIsFinished(false);
      setStats({ comparisons: 0, swaps: 0 });
      generatorRef.current = null;
      initialArrayRef.current = parsed;
      setCurrentStep({
        array: parsed,
        comparing: [],
        swapping: [],
        sorted: [],
      });
    }
  };

  const getGenerator = (name: AlgorithmName, arr: number[]) => {
    const target = parseInt(searchTarget) || 0;
    switch (name) {
      case 'bubble': return bubbleSort(arr);
      case 'selection': return selectionSort(arr);
      case 'insertion': return insertionSort(arr);
      case 'merge': return mergeSort(arr);
      case 'quick': return quickSort(arr);
      case 'linear': return linearSearch(arr, target);
      case 'binary': return binarySearch([...arr].sort((a,b) => a-b), target);
      default: return bubbleSort(arr);
    }
  };

  const handlePlay = async () => {
    if (isFinished) {
      reset();
      await sleep(50);
    }

    setIsPlaying(true);
    stopRef.current = false;

    if (!generatorRef.current) {
      generatorRef.current = getGenerator(algorithm, initialArrayRef.current);
    }

    let result = generatorRef.current.next();
    let comps = stats.comparisons;
    let swps = stats.swaps;

    while (!result.done && !stopRef.current) {
  const step = result.value;
  setCurrentStep(step);
  
  if (step.comparing.length > 0) comps++;
  if (step.swapping.length > 0) swps++;
  setStats({ comparisons: comps, swaps: swps });

  const baseDelay = 1000 - (speed * 9.5);
  const readabilityMultiplier = step.description ? 1.5 : 1;

  await sleep(baseDelay * readabilityMultiplier);

  //  CRITICAL SAFETY CHECK
  if (!generatorRef.current || stopRef.current) {
    break;
  }

  result = generatorRef.current.next();
}


    if (result.done) {
      setIsFinished(true);
      setIsPlaying(false);
      generatorRef.current = null;
      toast({
        title: "Simulation Complete",
        description: `Visualized ${algInfo.name} successfully.`,
      });
    } else {
      setIsPlaying(false);
    }
  };

  const handlePause = () => {
    stopRef.current = true;
    setIsPlaying(false);
  };

  return (
    <div className="h-screen bg-background text-foreground font-sans flex overflow-hidden">
      {/* Sidebar Controls */}
      <aside className="w-80 border-r border-border bg-card/50 backdrop-blur-sm flex flex-col shrink-0 overflow-y-auto">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            AlgoVisualizer
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Interactive Algorithm Explorer</p>
        </div>

        <div className="flex-1 p-6 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Settings2 className="w-4 h-4" />
              <h2 className="text-sm font-semibold uppercase tracking-wider">Configuration</h2>
            </div>
            
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Algorithm</Label>
                <Select value={algorithm} onValueChange={(v) => setAlgorithm(v as AlgorithmName)} disabled={isPlaying}>
                  <SelectTrigger className="h-10 bg-background/50 transition-colors hover:bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bubble">Bubble Sort</SelectItem>
                    <SelectItem value="selection">Selection Sort</SelectItem>
                    <SelectItem value="insertion">Insertion Sort</SelectItem>
                    <SelectItem value="merge">Merge Sort</SelectItem>
                    <SelectItem value="quick">Quick Sort</SelectItem>
                    <SelectItem value="linear">Linear Search</SelectItem>
                    <SelectItem value="binary">Binary Search</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Custom Input (CSV)</Label>
                <div className="flex gap-2">
                  <Input 
                    value={customInput} 
                    onChange={(e) => handleCustomInput(e.target.value)}
                    placeholder="e.g. 10, 20, 30"
                    className="h-10 font-mono text-sm bg-background/50"
                    disabled={isPlaying}
                  />
                  <Button variant="outline" size="icon" className="shrink-0 h-10 w-10" onClick={reset} disabled={isPlaying} title="Randomize">
                    <Shuffle className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {algInfo.type === 'searching' && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Target Value</Label>
                  <Input 
                    type="number"
                    value={searchTarget}
                    onChange={(e) => setSearchTarget(e.target.value)}
                    className="h-10 font-mono text-center font-bold bg-background/50"
                    disabled={isPlaying}
                  />
                </div>
              )}

              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Animation Speed</Label>
                    <span className="text-[10px] font-mono font-bold text-primary">{speed}%</span>
                  </div>
                  <Slider value={[speed]} onValueChange={(vals) => setSpeed(vals[0])} min={1} max={100} step={1} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Array Size</Label>
                    <span className="text-[10px] font-mono font-bold text-primary">{arraySize}</span>
                  </div>
                  <Slider value={[arraySize]} onValueChange={(vals) => setArraySize(vals[0])} min={5} max={100} step={1} disabled={isPlaying} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border">
            <Button
              className={cn(
                "w-full h-12 rounded-lg font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]",
                isPlaying ? "bg-amber-500 hover:bg-amber-600 text-white" : "bg-primary hover:bg-primary/90"
              )}
              onClick={isPlaying ? handlePause : handlePlay}
            >
              {isPlaying ? <Pause className="mr-2 h-5 w-5 fill-current" /> : <Play className="mr-2 h-5 w-5 fill-current" />}
              {isPlaying ? "Pause Simulation" : (isFinished ? "Restart Simulation" : "Start Simulation")}
            </Button>
            <Button 
              variant="ghost" 
              className="w-full mt-2 h-10 text-muted-foreground hover:text-foreground"
              onClick={reset}
              disabled={isPlaying}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Visualizer
            </Button>
          </div>
        </div>

        <div className="p-6 mt-auto bg-muted/30">
          <div className="flex gap-2 text-xs text-muted-foreground italic leading-relaxed">
            <Info className="w-4 h-4 text-primary shrink-0" />
            <p>{algInfo.desc}</p>
          </div>
        </div>
      </aside>

      {/* Main Visualization Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-50/30 dark:bg-black/20">
        <header className="h-16 border-b border-border bg-background/50 backdrop-blur-sm flex items-center justify-center px-8 shrink-0">
          <div className="flex gap-8">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Comparisons</span>
              <span className="text-xl font-mono font-bold text-primary">{stats.comparisons}</span>
            </div>
            <div className="w-px h-6 bg-border" />
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Swaps</span>
              <span className="text-xl font-mono font-bold text-red-500">{stats.swaps}</span>
            </div>
            <div className="w-px h-6 bg-border" />
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Complexity</span>
              <span className="text-xl font-mono font-bold text-emerald-500">{algInfo.time}</span>
            </div>
          </div>
        </header>

        <div className="flex-1 p-8 flex items-center justify-center">
          {currentStep && (
            <div className="w-full h-full max-w-6xl flex items-center justify-center">
              <VisualizerCanvas 
                step={currentStep} 
                type={algInfo.type} 
                arraySize={currentStep.array.length}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
