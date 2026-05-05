import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Monitor, 
  Smartphone, 
  Download, 
  CheckCircle, 
  ArrowLeft,
  Shield,
  Wifi,
  Clock,
  HardDrive
} from "lucide-react";

const WINDOWS_DOWNLOAD_URL = "https://github.com/dual-intelligence/smartschool-cbt/releases/latest/download/SmartSchool-CBT-Setup.exe";
const ANDROID_DOWNLOAD_URL = "https://github.com/dual-intelligence/smartschool-cbt/releases/latest/download/SmartSchool-CBT.apk";

const DownloadPage = () => {
  const platforms = [
    {
      name: "Windows PC",
      icon: Monitor,
      description: "For Windows 7, 8, 10 & 11",
      fileSize: "~85 MB",
      fileType: ".exe installer",
      url: WINDOWS_DOWNLOAD_URL,
      features: [
        "Kiosk mode for secure exams",
        "Blocks Alt+Tab, Ctrl+W during exams",
        "Auto-fullscreen exam environment",
        "Exit confirmation dialog",
      ],
      color: "bg-blue-600",
      recommended: true,
    },
    {
      name: "Android",
      icon: Smartphone,
      description: "For Android 8.0 and above",
      fileSize: "~25 MB",
      fileType: ".apk file",
      url: ANDROID_DOWNLOAD_URL,
      features: [
        "Native mobile experience",
        "Offline exam support",
        "Push notifications",
        "Lightweight and fast",
      ],
      color: "bg-green-600",
      recommended: false,
    },
  ];

  const steps = [
    { title: "Download", desc: "Click the download button for your device" },
    { title: "Install", desc: "Run the installer and follow the prompts" },
    { title: "Open", desc: "Launch the app and login with your registration number" },
    { title: "Practice", desc: "Start practicing for JAMB, WAEC & NECO" },
  ];

  return (
    <div className="min-h-screen bg-gradient-surface">
      <header className="bg-gradient-hero text-primary-foreground py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold">SMARTSCHOOL DESKTOP</h1>
              <p className="text-sm opacity-90">Download Center</p>
            </div>
          </div>
          <Link to="/">
            <Button variant="outline" size="sm" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge className="bg-primary/10 text-primary mb-4">
            <Download className="h-3 w-3 mr-1" />
            Free Download
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Download SmartSchool Desktop
          </h2>
          <p className="text-lg text-muted-foreground">
            Get the dedicated desktop or mobile app for the best exam practice experience.
            Secure, fast, and optimized for exam conditions.
          </p>
        </div>

        {/* Platform Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {platforms.map((platform) => (
            <Card key={platform.name} className={`relative border-0 shadow-xl overflow-hidden ${platform.recommended ? "ring-2 ring-primary" : ""}`}>
              {platform.recommended && (
                <div className="absolute -top-0 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-b-lg">
                  Recommended
                </div>
              )}
              <div className={`${platform.color} p-6 text-white text-center`}>
                <platform.icon className="h-16 w-16 mx-auto mb-3" />
                <h3 className="text-2xl font-bold">{platform.name}</h3>
                <p className="text-sm opacity-90 mt-1">{platform.description}</p>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <HardDrive className="h-4 w-4" />
                    {platform.fileSize}
                  </span>
                  <span>{platform.fileType}</span>
                </div>

                <ul className="space-y-2 mb-6">
                  {platform.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a href={platform.url} download>
                  <Button className="w-full h-12 text-lg bg-gradient-hero hover:opacity-90">
                    <Download className="h-5 w-5 mr-2" />
                    Download for {platform.name}
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How to Install */}
        <div className="max-w-4xl mx-auto mb-16">
          <h3 className="text-2xl font-bold text-foreground text-center mb-8">How to Install</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center mx-auto mb-3">
                  {i + 1}
                </div>
                <h4 className="font-semibold text-foreground mb-1">{step.title}</h4>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust indicators */}
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium text-foreground">Safe & Secure</span>
              <span className="text-xs text-muted-foreground">No malware, verified</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Wifi className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium text-foreground">Works Offline</span>
              <span className="text-xs text-muted-foreground">Practice without internet</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Clock className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium text-foreground">Free Updates</span>
              <span className="text-xs text-muted-foreground">Auto-updates included</span>
            </div>
          </div>
        </div>

        {/* Android Note */}
        <div className="max-w-2xl mx-auto mt-12 p-4 bg-muted rounded-xl text-center">
          <p className="text-sm text-muted-foreground">
            <strong>Android users:</strong> You may need to enable "Install from unknown sources" in your phone settings to install the APK.
            Go to Settings → Security → Unknown Sources → Enable.
          </p>
        </div>
      </main>

      <footer className="py-6 text-center text-muted-foreground text-sm border-t bg-background">
        <p>Powered by Dual Intelligence ICT Services Kano</p>
        <p className="text-xs mt-1">Contact: hareesabdulkadir@gmail.com | 09073733790 | 09166358735</p>
      </footer>
    </div>
  );
};

export default DownloadPage;
