
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Share, Sparkles } from "lucide-react";
import ShareModal from "./ShareModal";

export const PoemGenerator = () => {
  const [input, setInput] = useState("");
  const [poem, setPoem] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { toast } = useToast();

  const inspirationalPhrases = [
    "Golden sunrise",
    "A fresh start",
    "Joyful heart",
    "Kindness in bloom",
    "A day of light",
    "Hope on the horizon",
    "A heart full of love"
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generatePoem = async () => {
    if (!input.trim()) {
      toast({
        title: "Please enter a word or phrase",
        description: "We need some inspiration to create your poem!",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/.netlify/functions/generate-poem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: input.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate poem");
      }

      const data = await response.json();
      const poemLines = data.poem;
      
      setPoem([]);
      let currentLine = 0;
      
      const interval = setInterval(() => {
        if (currentLine < poemLines.length) {
          setPoem(prev => [...prev, poemLines[currentLine]]);
          currentLine++;
        } else {
          clearInterval(interval);
        }
      }, 1000);

    } catch (error) {
      console.error("Error generating poem:", error);
      toast({
        title: "Error generating poem",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const surpriseMe = () => {
    const randomIndex = Math.floor(Math.random() * inspirationalPhrases.length);
    setInput(inspirationalPhrases[randomIndex]);
  };

  const getPoemText = () => {
    return poem.join('\n');
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4 space-y-8">
      <a 
        onClick={scrollToTop}
        className="fixed top-4 left-4 text-xl md:text-2xl font-bold gradient-text animate-glow cursor-pointer hover:opacity-80 transition-opacity"
        style={{ zIndex: 50 }}
      >
        TrinaKeen.com
      </a>

      <h1 className="text-4xl md:text-5xl font-bold text-center gradient-text animate-glow">
        Create a Beautiful Poem
      </h1>
      
      <p className="text-lg text-center text-gray-300 max-w-md">
        Enter a word or phrase below to inspire your poem
      </p>

      <div className="w-full max-w-md space-y-4">
        <Input
          type="text"
          placeholder="Enter your inspiration..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 relative before:absolute before:inset-0 before:rounded-md before:p-[1px] before:bg-gradient-to-r before:from-secondary before:to-primary before:animate-border-glow before:content-[''] focus:before:animate-none hover:before:animate-none before:-z-10 focus:outline-none"
        />
        
        <Button
          onClick={generatePoem}
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/80 animate-breathe"
        >
          {isLoading ? "Creating magic..." : "Inspire"}
        </Button>

        <Button
          onClick={surpriseMe}
          className="w-full bg-primary hover:bg-primary/80 animate-breathe"
        >
          Surprise Me
        </Button>
      </div>

      {poem.length > 0 && (
        <div className="space-y-2 text-center max-w-md relative">
          {poem.map((line, index) => (
            <p
              key={index}
              className="poem-line gradient-text text-lg md:text-xl"
              style={{ animationDelay: `${index * 1000}ms` }}
            >
              {line}
            </p>
          ))}
          
          <div className="flex justify-end mt-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary/80 hover:bg-white/5 rounded-full p-2 transition-all hover:shadow-glow"
              onClick={() => setIsShareModalOpen(true)}
            >
              <Share size={20} />
            </Button>
          </div>
        </div>
      )}

      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        poemText={getPoemText()} 
      />
    </div>
  );
};
