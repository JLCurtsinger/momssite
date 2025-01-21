import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export const PoemGenerator = () => {
  const [input, setInput] = useState("");
  const [poem, setPoem] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a poetic AI that creates beautiful, emotional poems. Keep responses to exactly 4 lines.",
            },
            {
              role: "user",
              content: `Create a beautiful, emotional 4-line poem inspired by the theme of "${input}". Make it personal and inspiring.`,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate poem");
      }

      const data = await response.json();
      const poemText = data.choices[0].message.content;
      const poemLines = poemText.split("\n").filter((line: string) => line.trim());
      
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-8">
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
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
        />
        
        <Button
          onClick={generatePoem}
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/80 animate-breathe"
        >
          {isLoading ? "Creating magic..." : "Inspire"}
        </Button>
      </div>

      {poem.length > 0 && (
        <div className="space-y-2 text-center max-w-md">
          {poem.map((line, index) => (
            <p
              key={index}
              className="poem-line gradient-text text-lg md:text-xl"
              style={{ animationDelay: `${index * 1000}ms` }}
            >
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};