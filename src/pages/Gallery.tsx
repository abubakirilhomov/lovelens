import { Heart, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Gallery = () => {
  // Placeholder data - will be replaced with actual saved photos
  const placeholderPhotos = [
    {
      id: 1,
      date: "2025-10-31",
      username: "LoveUser",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-romantic bg-clip-text text-transparent">
            My Gallery
          </h1>
          <p className="text-muted-foreground">
            Your captured romantic moments
          </p>
        </header>

        {/* Empty state */}
        <div className="max-w-4xl mx-auto">
          <Card className="p-12 text-center shadow-soft border-primary/20 bg-card/80 backdrop-blur-sm">
            <Heart className="mx-auto mb-4 text-primary animate-pulse-soft" size={64} />
            <h2 className="text-2xl font-semibold mb-2">No photos yet</h2>
            <p className="text-muted-foreground mb-6">
              Start capturing beautiful moments with the camera!
            </p>
            <Button
              onClick={() => window.location.href = "/camera"}
              className="bg-gradient-romantic hover:opacity-90"
            >
              Open Camera
            </Button>
          </Card>

          {/* Grid layout for future photos */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 opacity-50">
            {[...Array(6)].map((_, i) => (
              <Card
                key={i}
                className="aspect-square bg-muted/50 border-primary/10 p-4 flex items-center justify-center"
              >
                <Heart className="text-muted-foreground/30" size={48} />
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
