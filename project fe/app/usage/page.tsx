'use client';

import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Download } from 'lucide-react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EnergyChart from '@/components/energy-chart';
import ApplianceBreakdown from '@/components/appliance-breakdown';
import { energyService } from '@/services/api';

export default function UsagePage() {
  const [historicalData, setHistoricalData] = useState<any>(null);
  const [breakdownData, setBreakdownData] = useState<any>(null);
  const [historyInterval, setHistoryInterval] = useState<string>('daily');
  const [breakdownPeriod, setBreakdownPeriod] = useState<string>('day');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEnergyData();
  }, [historyInterval, breakdownPeriod, startDate, endDate]);

  const fetchEnergyData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get historical data
      const historicalResponse = await energyService.getHistoricalEnergyData(
        historyInterval, 
        startDate || undefined, 
        endDate || undefined
      );
      
      if (historicalResponse.success) {
        setHistoricalData(historicalResponse);
      } else {
        console.error('API Error:', historicalResponse.error);
      }
      
      // Get breakdown data
      const breakdownResponse = await energyService.getEnergyBreakdown(breakdownPeriod);
      
      if (breakdownResponse.success) {
        setBreakdownData(breakdownResponse);
      } else {
        console.error('API Error:', breakdownResponse.error);
      }
    } catch (error) {
      console.error('Error fetching energy data:', error);
      setError('Failed to load energy usage data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistoryIntervalChange = (interval: string) => {
    setHistoryInterval(interval);
  };
  
  const handleBreakdownPeriodChange = (period: string) => {
    setBreakdownPeriod(period);
  };
  
  // Prepare chart data
  const lineChartData = {
    labels: historicalData?.data?.map((item: any) => {
      if (historyInterval === 'hourly') {
        return `${item.period.hour}:00`;
      } else if (historyInterval === 'daily') {
        return `${item.period.day}/${item.period.month}`;
      } else if (historyInterval === 'weekly') {
        return `Week ${item.period.week}`;
      } else {
        return `${item.period.month}/${item.period.year}`;
      }
    }) || [],
    datasets: [
      {
        label: 'Energy Usage (kWh)',
        data: historicalData?.data?.map((item: any) => item.totalConsumption) || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Cost Estimate ($)',
        data: historicalData?.data?.map((item: any) => item.averageCost) || [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.3,
      },
    ],
  };
  
  // Prepare donut chart data
  const donutChartData = {
    labels: breakdownData?.data?.map((item: any) => item.name) || [],
    datasets: [
      {
        data: breakdownData?.data?.map((item: any) => parseFloat(item.percentage)) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(199, 199, 199, 0.7)',
          'rgba(83, 102, 255, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
          'rgba(83, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare bar chart data
  const barChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Peak Hours Usage (kWh)',
        data: [4.2, 5.3, 4.9, 5.1, 4.8, 6.2, 5.7],
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
      },
      {
        label: 'Off-Peak Hours Usage (kWh)',
        data: [2.8, 3.1, 2.9, 2.7, 3.2, 3.8, 3.5],
        backgroundColor: 'rgba(53, 162, 235, 0.7)',
      },
    ],
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex justify-between">
              <p>{error}</p>
              <button onClick={() => setError(null)} className="font-bold">×</button>
            </div>
          )}
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">Energy Usage Analytics</h1>
              <p className="text-slate-600 dark:text-slate-400">
                Track and analyze your energy consumption patterns
              </p>
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Date Range
                </Button>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mb-4"></div>
                <p className="text-lg">Loading energy data...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="col-span-1 lg:col-span-2">
                  <EnergyChart
                    title="Energy Consumption History"
                    type="line"
                    data={lineChartData}
                    interval={historyInterval}
                    onIntervalChange={handleHistoryIntervalChange}
                  />
                </div>
                <div className="col-span-1">
                  <ApplianceBreakdown
                    data={donutChartData}
                    period={breakdownPeriod}
                    onPeriodChange={handleBreakdownPeriodChange}
                    className="h-full"
                  />
                </div>
              </div>
            </>
          )}

          {!isLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle>Peak vs Off-Peak Usage</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 h-[350px]">
                  <EnergyChart
                    title=""
                    type="bar"
                    data={barChartData}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Usage Statistics</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {breakdownData?.data?.slice(0, 5).map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-slate-500 dark:text-slate-400 text-sm">
                            {item.type} • {item.totalConsumption.toFixed(2)} kWh
                          </p>
                        </div>
                        <div className="w-24 text-right">
                          <p className="font-medium">{item.percentage}%</p>
                          <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full mt-1">
                            <div 
                              className="h-full bg-green-500 rounded-full" 
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!breakdownData?.data || breakdownData.data.length === 0) && (
                      <p className="text-center text-slate-500 dark:text-slate-400">
                        No usage statistics available.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
