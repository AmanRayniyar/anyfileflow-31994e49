import React from 'react';
import { Shield, Wifi, WifiOff, Lock, Eye, Server, Smartphone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const TrustBadges: React.FC = () => {
  const badges = [
    {
      icon: Lock,
      title: 'No Upload',
      description: 'Files processed locally',
      color: 'text-tool-archive',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Zero data collection',
      color: 'text-primary',
    },
    {
      icon: WifiOff,
      title: 'Works Offline',
      description: 'PWA compatible',
      color: 'text-tool-image',
    },
    {
      icon: Eye,
      title: 'No Tracking',
      description: 'No cookies required',
      color: 'text-tool-audio',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-secondary/50 to-secondary/30 rounded-xl p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Privacy & Security</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {badges.map((badge, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-3 bg-card/50 rounded-lg"
          >
            <badge.icon className={`h-6 w-6 ${badge.color} mb-2`} />
            <span className="text-sm font-medium text-foreground">{badge.title}</span>
            <span className="text-xs text-muted-foreground">{badge.description}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <Badge variant="outline" className="text-xs">
          <Server className="h-3 w-3 mr-1" />
          100% Client-Side
        </Badge>
        <Badge variant="outline" className="text-xs">
          <Wifi className="h-3 w-3 mr-1" />
          No Internet Needed
        </Badge>
        <Badge variant="outline" className="text-xs">
          <Smartphone className="h-3 w-3 mr-1" />
          Mobile Friendly
        </Badge>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4">
        Your files never leave your device. All processing happens in your browser using modern Web APIs.
      </p>
    </div>
  );
};

export default TrustBadges;
