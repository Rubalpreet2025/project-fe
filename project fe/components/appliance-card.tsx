import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Power } from 'lucide-react';

interface ApplianceProps {
  id: string;
  name: string;
  location: string;
  type: string;
  status: 'on' | 'off' | 'standby';
  powerRating: number;
  onToggle: (id: string) => void;
}

const Appliance: React.FC<ApplianceProps> = ({ 
  id, 
  name, 
  location, 
  type, 
  status, 
  powerRating,
  onToggle
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on':
        return 'bg-green-500';
      case 'off':
        return 'bg-slate-400';
      case 'standby':
        return 'bg-yellow-500';
      default:
        return 'bg-slate-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lighting':
        return '💡';
      case 'heating':
        return '🔥';
      case 'cooling':
        return '❄️';
      case 'kitchen':
        return '🍳';
      case 'entertainment':
        return '📺';
      default:
        return '🔌';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-slate-50 dark:bg-slate-900 py-4 flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <CardTitle className="flex items-center">
            <span className="mr-2 text-xl">{getTypeIcon(type)}</span>
            <span>{name}</span>
          </CardTitle>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {location} • {powerRating}W
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`inline-block h-3 w-3 rounded-full ${getStatusColor(status)}`}></span>
          <span className="text-sm capitalize">{status}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex justify-end">
        <Button 
          variant={status === 'on' ? 'danger' : 'primary'} 
          size="sm"
          onClick={() => onToggle(id)}
          className="flex items-center"
        >
          <Power size={16} className="mr-1" />
          {status === 'on' ? 'Turn Off' : 'Turn On'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default Appliance;
