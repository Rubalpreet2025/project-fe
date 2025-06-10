import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle, Circle } from 'lucide-react';

interface RecommendationProps {
  id: string;
  title: string;
  description: string;
  potentialSavings: number;
  category: string;
  priority: 'low' | 'medium' | 'high';
  implemented: boolean;
  onImplemented: (id: string, implemented: boolean) => void;
}

const RecommendationCard: React.FC<RecommendationProps> = ({
  id,
  title,
  description,
  potentialSavings,
  category,
  priority,
  implemented,
  onImplemented
}) => {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">High</span>;
      case 'medium':
        return <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">Medium</span>;
      case 'low':
        return <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">Low</span>;
      default:
        return null;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'appliance':
        return <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">Appliance</span>;
      case 'behavior':
        return <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">Behavior</span>;
      case 'scheduling':
        return <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">Scheduling</span>;
      case 'upgrade':
        return <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">Upgrade</span>;
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden border-l-4 border-l-green-500">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <div className="flex items-center space-x-2">
            {getPriorityBadge(priority)}
          </div>
        </div>
        <div className="mt-2 flex space-x-2">
          {getCategoryBadge(category)}
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            Save up to {potentialSavings}%
          </span>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{description}</p>
        <div className="flex justify-between items-center">
          <Button
            variant={implemented ? "outline" : "primary"}
            size="sm"
            onClick={() => onImplemented(id, !implemented)}
            className="flex items-center"
          >
            {implemented ? (
              <>
                <CheckCircle size={16} className="mr-1 text-green-600" />
                Implemented
              </>
            ) : (
              <>
                <Circle size={16} className="mr-1" />
                Mark as Implemented
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
