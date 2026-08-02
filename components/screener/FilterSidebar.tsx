"use client";

import { X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface FilterSidebarProps {
  filters: Record<string, any>;
  onFilterChange: (filters: Record<string, any>) => void;
  onClose: () => void;
}

export function FilterSidebar({ filters, onFilterChange, onClose }: FilterSidebarProps) {
  
  const updateFilter = (key: string, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex h-[calc(100vh-140px)] flex-col rounded-xl border border-neutral-800 bg-neutral-950/80 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-neutral-800 p-4">
        <h2 className="text-lg font-semibold text-white">Filters</h2>
        <button onClick={onClose} className="rounded-full p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white md:hidden">
          <X className="h-5 w-5" />
        </button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <Accordion defaultValue={["descriptive", "fundamental", "ai"]} className="w-full">
          
          <AccordionItem value="descriptive" className="border-neutral-800">
            <AccordionTrigger className="text-sm hover:no-underline">Descriptive</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 pt-2 pb-4">
              <div className="space-y-2">
                <Label className="text-xs text-neutral-400">Sector</Label>
                <Select value={filters.sector || ""} onValueChange={(val) => updateFilter("sector", val)}>
                  <SelectTrigger className="border-neutral-800 bg-neutral-900 text-white">
                    <SelectValue placeholder="Any Sector" />
                  </SelectTrigger>
                  <SelectContent className="border-neutral-800 bg-neutral-900 text-white">
                    <SelectItem value="Any">Any Sector</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Financial">Financial</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Energy">Energy</SelectItem>
                    <SelectItem value="Consumer">Consumer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-400">Market Cap</Label>
                <Select value={filters.marketCap || ""} onValueChange={(val) => updateFilter("marketCap", val)}>
                  <SelectTrigger className="border-neutral-800 bg-neutral-900 text-white">
                    <SelectValue placeholder="Any Market Cap" />
                  </SelectTrigger>
                  <SelectContent className="border-neutral-800 bg-neutral-900 text-white">
                    <SelectItem value="Any">Any Market Cap</SelectItem>
                    <SelectItem value="mega">Mega (200B+)</SelectItem>
                    <SelectItem value="large">Large (10B-200B)</SelectItem>
                    <SelectItem value="mid">Mid (2B-10B)</SelectItem>
                    <SelectItem value="small">Small (300M-2B)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="fundamental" className="border-neutral-800">
            <AccordionTrigger className="text-sm hover:no-underline">Fundamental</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 pt-2 pb-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs text-neutral-400">P/E Ratio (Max)</Label>
                  <span className="text-xs text-neutral-500">{filters.peRatio || 50}</span>
                </div>
                <Slider 
                  max={100} 
                  step={1} 
                  value={[filters.peRatio || 50]} 
                  onValueChange={(vals) => updateFilter("peRatio", Array.isArray(vals) ? vals[0] : vals)}
                  className="py-2"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs text-neutral-400">Dividend Yield % (Min)</Label>
                  <span className="text-xs text-neutral-500">{filters.dividendYield || 0}%</span>
                </div>
                <Slider 
                  max={15} 
                  step={0.5} 
                  value={[filters.dividendYield || 0]} 
                  onValueChange={(vals) => updateFilter("dividendYield", Array.isArray(vals) ? vals[0] : vals)}
                  className="py-2"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="ai" className="border-neutral-800">
            <AccordionTrigger className="text-sm hover:no-underline text-blue-400">AI & Sentiment</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 pt-2 pb-4">
              <div className="space-y-2">
                <Label className="text-xs text-neutral-400">AI Signal</Label>
                <Select value={filters.aiSignal || ""} onValueChange={(val) => updateFilter("aiSignal", val)}>
                  <SelectTrigger className="border-neutral-800 bg-neutral-900 text-white">
                    <SelectValue placeholder="Any Signal" />
                  </SelectTrigger>
                  <SelectContent className="border-neutral-800 bg-neutral-900 text-white">
                    <SelectItem value="Any">Any Signal</SelectItem>
                    <SelectItem value="Strong Buy">Strong Buy</SelectItem>
                    <SelectItem value="Buy">Buy</SelectItem>
                    <SelectItem value="Hold">Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs text-neutral-400">AI Score (Min)</Label>
                  <span className="text-xs text-neutral-500">{filters.aiScore || 50}</span>
                </div>
                <Slider 
                  max={100} 
                  step={1} 
                  value={[filters.aiScore || 50]} 
                  onValueChange={(vals) => updateFilter("aiScore", Array.isArray(vals) ? vals[0] : vals)}
                  className="py-2"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </ScrollArea>
    </div>
  );
}
