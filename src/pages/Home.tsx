import { useState } from "react";
import { Heart, Copy, Share2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const loveMessages = [
  "Every love story is beautiful, but ours is my favorite.",
  "You are my today and all of my tomorrows.",
  "In a sea of people, my eyes will always search for you.",
  "You are the reason I believe in love.",
  "Together is a wonderful place to be.",
  "I fell in love with you because of the million things you never knew you were doing.",
  "You are my sunshine on a rainy day.",
  "With you, I am home.",
  "Love is not about how many days, months, or years you have been together. It's about how much you love each other every single day.",
  "You had me at hello.",
];

const Home = () => {
  const [currentMessage, setCurrentMessage] = useState(loveMessages[0]);
  const [liked, setLiked] = useState(false);

  const getRandomMessage = () => {
    const newMessage = loveMessages[Math.floor(Math.random() * loveMessages.length)];
    setCurrentMessage(newMessage);
    setLiked(false);
  };

  const copyMessage = async () => {
    await navigator.clipboard.writeText(currentMessage);
    toast.success("Message copied to clipboard!");
  };

  const shareMessage = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          text: currentMessage,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      toast.info("Sharing not supported on this device");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Floating hearts decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-primary/20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
            }}
            size={30 + i * 10}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-romantic bg-clip-text text-transparent">
            LoveLens
          </h1>
          <p className="text-muted-foreground text-lg">
            Capture love, share moments
          </p>
        </header>

        <div className="max-w-2xl mx-auto">
          <Card className="p-8 shadow-romantic border-primary/20 bg-card/80 backdrop-blur-sm animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="text-primary animate-pulse-soft" size={32} />
            </div>

            <blockquote className="text-center mb-8">
              <p className="text-2xl font-medium text-foreground leading-relaxed">
                "{currentMessage}"
              </p>
            </blockquote>

            <div className="flex items-center justify-center gap-3 mb-6">
              <Button
                variant={liked ? "default" : "outline"}
                size="lg"
                onClick={() => setLiked(!liked)}
                className="gap-2"
              >
                <Heart
                  className={liked ? "fill-current" : ""}
                  size={20}
                />
                {liked ? "Liked" : "Like"}
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={copyMessage}
                className="gap-2"
              >
                <Copy size={20} />
                Copy
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={shareMessage}
                className="gap-2"
              >
                <Share2 size={20} />
                Share
              </Button>
            </div>

            <Button
              onClick={getRandomMessage}
              size="lg"
              className="w-full bg-gradient-romantic hover:opacity-90 transition-opacity"
            >
              <Sparkles size={20} className="mr-2" />
              Get New Message
            </Button>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {loveMessages.slice(0, 4).map((message, i) => (
              <Card
                key={i}
                className="p-4 cursor-pointer hover:shadow-romantic transition-all duration-300 hover:scale-105 bg-card/60 backdrop-blur-sm border-primary/10"
                onClick={() => setCurrentMessage(message)}
              >
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {message}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
