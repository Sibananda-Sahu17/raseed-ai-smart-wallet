import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Camera, 
  Upload, 
  Video, 
  FileImage, 
  CheckCircle, 
  X,
  RotateCcw,
  Download,
  Eye,
  Trash2,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CapturedFile {
  id: string;
  type: 'image' | 'video';
  url: string;
  name: string;
  size: number;
  timestamp: Date;
}

const CameraCapture = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedFiles, setCapturedFiles] = useState<CapturedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeCamera, setActiveCamera] = useState<'user' | 'environment'>('environment');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: activeCamera === 'environment' ? 'environment' : 'user',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
      setIsCapturing(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCapturing(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const newFile: CapturedFile = {
            id: Date.now().toString(),
            type: 'image',
            url,
            name: `receipt-photo-${Date.now()}.jpg`,
            size: blob.size,
            timestamp: new Date()
          };
          setCapturedFiles(prev => [...prev, newFile]);
          toast({
            title: "Photo Captured!",
            description: "Receipt photo saved successfully.",
          });
        }
      }, 'image/jpeg', 0.9);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const url = URL.createObjectURL(file);
        const newFile: CapturedFile = {
          id: Date.now().toString() + Math.random(),
          type: file.type.startsWith('image/') ? 'image' : 'video',
          url,
          name: file.name,
          size: file.size,
          timestamp: new Date()
        };
        setCapturedFiles(prev => [...prev, newFile]);
      }
    });

    toast({
      title: "Files Uploaded!",
      description: `${files.length} file(s) uploaded successfully.`,
    });
  };

  const removeFile = (id: string) => {
    setCapturedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const processFiles = async () => {
    if (capturedFiles.length === 0) return;

    setIsProcessing(true);
    setUploadProgress(0);

    // Simulate processing
    for (let i = 0; i <= 100; i += 10) {
      setTimeout(() => {
        setUploadProgress(i);
      }, i * 30);
    }

    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Processing Complete!",
        description: "Your receipts have been analyzed successfully.",
      });
      navigate("/analysis");
    }, 3500);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">📸 Capture & Upload Receipts</h1>
          <p className="text-muted-foreground">
            Take photos, record videos, or upload files of your receipts for AI analysis
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Camera Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Live Camera
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {!isCapturing ? (
                    <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
                      <div className="text-center">
                        <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">Camera not active</p>
                        <Button onClick={startCamera} variant="gradient">
                          <Camera className="h-4 w-4 mr-2" />
                          Start Camera
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        autoPlay
                        playsInline
                        muted
                      />
                      <div className="absolute inset-0 border-2 border-primary/50 rounded-lg" />
                      <div className="absolute top-4 left-4">
                        <Badge variant="success" className="flex items-center gap-1">
                          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                          Recording
                        </Badge>
                      </div>
                    </div>
                  )}

                  <canvas ref={canvasRef} className="hidden" />

                  {isCapturing && (
                    <div className="flex gap-2">
                      <Button onClick={capturePhoto} className="flex-1">
                        <Camera className="h-4 w-4 mr-2" />
                        Capture Photo
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setActiveCamera(activeCamera === 'user' ? 'environment' : 'user')}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" onClick={stopCamera}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  File Upload
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="space-y-4">
                    <div className="flex justify-center gap-4">
                      <FileImage className="h-8 w-8 text-primary" />
                      <Video className="h-8 w-8 text-finance" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">Click to upload files</p>
                      <p className="text-sm text-muted-foreground">
                        Supports JPEG, PNG, WebP, MP4, WebM
                      </p>
                    </div>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </CardContent>
            </Card>
          </div>

          {/* Captured Files */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Captured Files ({capturedFiles.length})
                  </span>
                  {capturedFiles.length > 0 && (
                    <Button 
                      onClick={processFiles}
                      disabled={isProcessing}
                      variant="gradient"
                    >
                      {isProcessing ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      {isProcessing ? "Processing..." : "Process All"}
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isProcessing && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Processing receipts...</span>
                      <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="mb-2" />
                    <p className="text-xs text-muted-foreground">
                      Analyzing receipt data with Gemini AI
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {capturedFiles.length === 0 ? (
                    <div className="text-center py-8">
                      <FileImage className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No files captured yet</p>
                      <p className="text-sm text-muted-foreground">
                        Use the camera or upload files to get started
                      </p>
                    </div>
                  ) : (
                    capturedFiles.map((file) => (
                      <Card key={file.id} className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              {file.type === 'image' ? (
                                <img
                                  src={file.url}
                                  alt={file.name}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                              ) : (
                                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                                  <Video className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                              <Badge 
                                variant={file.type === 'image' ? 'success' : 'finance'}
                                className="absolute -top-2 -right-2 text-xs"
                              >
                                {file.type}
                              </Badge>
                            </div>
                            
                            <div className="flex-1">
                              <p className="font-medium text-sm">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(file.size)} • {file.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                            
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => removeFile(file.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-sm">📝 Tips for Best Results</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• Ensure receipts are well-lit and clearly visible</li>
                  <li>• Avoid shadows and glare on the receipt</li>
                  <li>• Include the entire receipt in the frame</li>
                  <li>• Multiple angles can improve accuracy</li>
                  <li>• Videos work great for long receipts</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;