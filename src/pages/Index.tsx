
import { PoemGenerator } from "@/components/PoemGenerator";
import { Signature } from "@/components/Signature";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <PoemGenerator />
      </div>
      
      <div className="flex justify-center mb-8">
        <Link to="/daily-inspiration">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-primary border-primary/30 hover:bg-primary/10"
          >
            <Sparkles size={16} className="mr-2" />
            Daily Inspiration
          </Button>
        </Link>
      </div>
      
      <Signature />
    </div>
  );
};

export default Index;
