
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const DailyInspiration = () => {
  const [dailyPoem, setDailyPoem] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAndUpdateDailyPoem = async () => {
      setLoading(true);
      const storedPoem = localStorage.getItem("dailyPoem");
      const lastUpdate = localStorage.getItem("dailyPoemTimestamp");
      
      const now = new Date();
      const nextUpdateTime = getNextUpdateTime();
      const needsUpdate = !lastUpdate || 
                          (new Date(lastUpdate) < nextUpdateTime && 
                           now >= nextUpdateTime);
      
      if (!storedPoem || needsUpdate) {
        try {
          const response = await fetch("/api/daily-inspiration", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ input: "daily inspiration" })
          });
          
          if (!response.ok) {
            throw new Error("Failed to fetch daily inspiration");
          }
          
          const data = await response.json();
          setDailyPoem(data.poem);
          
          // Store the new poem and update timestamp
          localStorage.setItem("dailyPoem", JSON.stringify(data.poem));
          localStorage.setItem("dailyPoemTimestamp", now.toISOString());
        } catch (error) {
          console.error("Error fetching daily inspiration:", error);
          // If we have a stored poem, use it as fallback
          if (storedPoem) {
            setDailyPoem(JSON.parse(storedPoem));
          }
        }
      } else if (storedPoem) {
        // Use the stored poem if it's still valid
        setDailyPoem(JSON.parse(storedPoem));
      }
      
      setLoading(false);
    };
    
    // Function to calculate the next 4 AM ET
    function getNextUpdateTime() {
      const now = new Date();
      // Convert to ET (UTC-5 or UTC-4 during daylight saving)
      const isDST = isInDaylightSavingTime(now);
      const etOffsetHours = isDST ? -4 : -5;
      
      // Create a new date in ET
      const etNow = new Date(now);
      etNow.setHours(etNow.getHours() + etOffsetHours + now.getTimezoneOffset()/60);
      
      // Set to 4 AM today in ET
      const target = new Date(etNow);
      target.setHours(4, 0, 0, 0);
      
      // If it's already past 4 AM ET, set for next day
      if (etNow > target) {
        target.setDate(target.getDate() + 1);
      }
      
      // Convert back to local time
      const localTarget = new Date(target);
      localTarget.setHours(localTarget.getHours() - etOffsetHours - now.getTimezoneOffset()/60);
      
      return localTarget;
    }
    
    // Helper to check if a date is in DST in ET
    function isInDaylightSavingTime(date) {
      // This is a simplified check and may not be 100% accurate for edge cases
      const jan = new Date(date.getFullYear(), 0, 1);
      const jul = new Date(date.getFullYear(), 6, 1);
      const stdTimezoneOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
      
      return date.getTimezoneOffset() < stdTimezoneOffset;
    }
    
    // Check and update when component mounts
    checkAndUpdateDailyPoem();
    
    // Set up a timer to check for updates
    const timer = setInterval(() => {
      const now = new Date();
      const nextUpdate = getNextUpdateTime();
      // Check if it's time for an update
      if (now >= nextUpdate) {
        checkAndUpdateDailyPoem();
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-full max-w-4xl px-4">
        <div className="flex justify-start w-full mt-6 mb-10">
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>
        
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-cursive mb-8 gradient-text animate-glow">
            Today's Inspiration
          </h1>
          
          <div className="bg-[#1A2142] p-8 rounded-xl w-full max-w-2xl shadow-lg relative overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-pulse text-primary">Loading today's inspiration...</div>
              </div>
            ) : (
              <div className="space-y-4">
                {dailyPoem.map((line, index) => (
                  <p 
                    key={index} 
                    className="poem-line text-lg text-white/90 font-cursive" 
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {line}
                  </p>
                ))}
              </div>
            )}
            
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl"></div>
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-full blur-3xl"></div>
          </div>
          
          <p className="text-sm text-white/60 mt-6">
            Updated daily at 4 AM Eastern Time
          </p>
        </div>
      </div>
    </div>
  );
};

export default DailyInspiration;
