import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface HoverInfoProps {
  info: string;
  title?: string;
}

export function HoverInfo({ info, title }: HoverInfoProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-4 w-4 hover:bg-gray-100 transition-colors"
        >
          <Info className="h-3 w-3 text-gray-500" />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-lg">
        {title && (
          <h4 className="font-medium text-sm text-gray-900 mb-1">{title}</h4>
        )}
        <p className="text-sm text-gray-600 leading-relaxed">{info}</p>
      </HoverCardContent>
    </HoverCard>
  );
}