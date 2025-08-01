import { useState } from "react";
import { HelpCircle, X, Lightbulb } from "lucide-react";
import { Button } from "./button";
import { Dialog, DialogContent } from "./dialog";

interface ContextualHelpProps {
  topic: string;
  title: string;
  content: string;
  tips?: string[];
  className?: string;
}

export function ContextualHelp({ topic, title, content, tips = [], className = "" }: ContextualHelpProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center text-primary hover:text-primary-light transition-colors ${className}`}
        aria-label={`Help about ${topic}`}
      >
        <HelpCircle className="w-4 h-4" />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-sm mx-4">
          <div className="relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-0 top-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="pr-10">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{title}</h3>
              </div>
              
              <p className="text-text-gray mb-4 leading-relaxed">{content}</p>
              
              {tips.length > 0 && (
                <div className="bg-gradient-to-r from-warning/10 to-orange-500/10 border border-warning/20 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-warning" />
                    <span className="font-medium text-sm">Pro Tips</span>
                  </div>
                  <ul className="space-y-1">
                    {tips.map((tip, index) => (
                      <li key={index} className="text-sm text-text-gray flex items-start">
                        <span className="text-warning mr-2">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <Button 
                onClick={() => setIsOpen(false)}
                className="w-full"
              >
                Got it, thanks!
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}