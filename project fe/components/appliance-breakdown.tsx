'use client';

import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ApplianceBreakdownProps {
  data: ChartData<'doughnut'>;
  options?: ChartOptions<'doughnut'>;
  period?: string;
  onPeriodChange?: (period: string) => void;
  className?: string;
}

const ApplianceBreakdown: React.FC<ApplianceBreakdownProps> = ({
  data,
  options,
  period,
  onPeriodChange,
  className,
}) => {
  const defaultOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 15,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ${value}%`;
          },
        },
      },
    },
    cutout: '70%',
  };

  const finalOptions = { ...defaultOptions, ...options };

  return (
    <Card className={`h-full ${className}`}>
      <CardHeader className="pb-0 flex flex-row justify-between items-center">
        <CardTitle>Appliance Energy Breakdown</CardTitle>
        {period && onPeriodChange && (
          <div className="flex space-x-2">
            <Button
              variant={period === 'day' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onPeriodChange('day')}
            >
              Day
            </Button>
            <Button
              variant={period === 'week' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onPeriodChange('week')}
            >
              Week
            </Button>
            <Button
              variant={period === 'month' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onPeriodChange('month')}
            >
              Month
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-4 flex justify-center items-center h-[300px]">
        <Doughnut data={data} options={finalOptions} />
      </CardContent>
    </Card>
  );
};

export default ApplianceBreakdown;
