'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface EnergyChartProps {
  title: string;
  type: 'line' | 'bar';
  data: ChartData<'line'> | ChartData<'bar'>;
  options?: ChartOptions<'line'> | ChartOptions<'bar'>;
  interval?: string;
  onIntervalChange?: (interval: string) => void;
}

const EnergyChart: React.FC<EnergyChartProps> = ({
  title,
  type,
  data,
  options,
  interval,
  onIntervalChange,
}) => {
  const defaultOptions: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
  };

  const finalOptions = { ...defaultOptions, ...options };

  return (
    <Card className="h-full">
      <CardHeader className="pb-0 flex flex-row justify-between items-center">
        <CardTitle>{title}</CardTitle>
        {interval && onIntervalChange && (
          <div className="flex space-x-2">
            <Button
              variant={interval === 'hourly' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onIntervalChange('hourly')}
            >
              Hourly
            </Button>
            <Button
              variant={interval === 'daily' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onIntervalChange('daily')}
            >
              Daily
            </Button>
            <Button
              variant={interval === 'weekly' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onIntervalChange('weekly')}
            >
              Weekly
            </Button>
            <Button
              variant={interval === 'monthly' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onIntervalChange('monthly')}
            >
              Monthly
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-4 h-[300px]">
        {type === 'line' ? (
          <Line data={data as ChartData<'line'>} options={finalOptions as ChartOptions<'line'>} />
        ) : (
          <Bar data={data as ChartData<'bar'>} options={finalOptions as ChartOptions<'bar'>} />
        )}
      </CardContent>
    </Card>
  );
};

export default EnergyChart;
