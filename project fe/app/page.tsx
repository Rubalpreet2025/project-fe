'use client';

import { useEffect, useState } from 'react';
import { Zap, LineChart, Lightbulb, Thermometer } from 'lucide-react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import StatCard from '@/components/stat-card';
import ApplianceCard from '@/components/appliance-card';
import RecommendationCard from '@/components/recommendation-card';
import EnergyChart from '@/components/energy-chart';
import ApplianceBreakdown from '@/components/appliance-breakdown';
import { applianceService, energyService, recommendationService } from '@/services/api';

export default function Home() {
  const [appliances, setAppliances] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [energyData, setEnergyData] = useState<any>(null);
  const [applianceBreakdown, setApplianceBreakdown] = useState<any>(null);
  const [historicalData, setHistoricalData] = useState<any>(null);
  const [historyInterval, setHistoryInterval] = useState<string>('daily');
  const [breakdownPeriod, setBreakdownPeriod] = useState<string>('day');
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get real-time energy data
        const realTimeResponse = await energyService.getRealTimeEnergyData();
        setEnergyData(realTimeResponse.data);
        
        // Get appliances
        const appliancesResponse = await applianceService.getAllAppliances();
        setAppliances(appliancesResponse.data);
        
        // Get recommendations
        const recommendationsResponse = await recommendationService.getAllRecommendations();
        setRecommendations(recommendationsResponse.data);
        
        // Get energy breakdown by appliance
        const breakdownResponse = await energyService.getEnergyBreakdown(breakdownPeriod);
        setApplianceBreakdown(breakdownResponse.data);
        
        // Get historical energy data
        const historicalResponse = await energyService.getHistoricalEnergyData(historyInterval);
        setHistoricalData(historicalResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [breakdownPeriod, historyInterval]);
  
  const handleToggleAppliance = async (id: string) => {
    try {
      const response = await applianceService.toggleApplianceStatus(id);
      
      if (response.success) {
        // Update with the data from the response
        setAppliances(appliances.map(appliance => 
          appliance._id === id 
            ? response.data
            : appliance
        ));
      } else {
        console.error('API Error:', response.error);
      }
    } catch (error) {
      console.error('Error toggling appliance:', error);
    }
  };
  
  const handleRecommendationImplemented = async (id: string, implemented: boolean) => {
    try {
      const response = await recommendationService.updateRecommendationStatus(id, implemented);
      
      if (response.success) {
        setRecommendations(recommendations.map(recommendation => 
          recommendation._id === id 
            ? response.data
            : recommendation
        ));
      } else {
        console.error('API Error:', response.error);
      }
    } catch (error) {
      console.error('Error updating recommendation:', error);
    }
  };
  
  const handleHistoryIntervalChange = (interval: string) => {
    setHistoryInterval(interval);
  };
  
  const handleBreakdownPeriodChange = (period: string) => {
    setBreakdownPeriod(period);
  };
  
  // Prepare chart data
  const energyChartData = {
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
    ],
  };
  
  // Prepare donut chart data
  const donutChartData = {
    labels: applianceBreakdown?.map((item: any) => item.name) || [],
    datasets: [
      {
        data: applianceBreakdown?.map((item: any) => parseFloat(item.percentage)) || [],
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
          
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mb-4"></div>
                <p className="text-lg">Loading dashboard data...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard 
              title="Current Usage" 
              value={`${energyData?.totalConsumption || 0} kWh`}
              icon={<Zap className="h-4 w-4 text-blue-600" />}
              trend={{ value: '12% vs. yesterday', direction: 'down' }}
            />
            <StatCard 
              title="Estimated Cost" 
              value={`$${energyData?.costEstimate || 0}`}
              icon={<LineChart className="h-4 w-4 text-green-600" />}
              trend={{ value: '5% vs. last week', direction: 'down' }}
            />
            <StatCard 
              title="Active Appliances" 
              value={appliances?.filter(a => a.status === 'on').length || 0}
              icon={<Lightbulb className="h-4 w-4 text-yellow-600" />}
            />
            <StatCard 
              title="Avg. Temperature" 
              value="72°F"
              icon={<Thermometer className="h-4 w-4 text-red-600" />}
              trend={{ value: '1° lower than usual', direction: 'neutral' }}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="col-span-1 lg:col-span-2">
              <EnergyChart
                title="Energy Consumption History"
                type="line"
                data={energyChartData}
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
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Active Appliances</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {appliances
                  ?.filter(appliance => appliance.status === 'on')
                  .slice(0, 6)
                  .map(appliance => (
                    <ApplianceCard
                      key={appliance._id}
                      id={appliance._id}
                      name={appliance.name}
                      location={appliance.location}
                      type={appliance.type}
                      status={appliance.status}
                      powerRating={appliance.powerRating}
                      onToggle={handleToggleAppliance}
                    />
                  ))}
              </div>
            </div>
            <div className="lg:col-span-1">
              <h2 className="text-xl font-semibold mb-4">Energy Saving Tips</h2>
              <div className="space-y-4">
                {recommendations
                  ?.filter(rec => rec.priority === 'high')
                  .slice(0, 3)
                  .map(rec => (
                    <RecommendationCard
                      key={rec._id}
                      id={rec._id}
                      title={rec.title}
                      description={rec.description}
                      potentialSavings={rec.potentialSavings}
                      category={rec.category}
                      priority={rec.priority}
                      implemented={rec.implemented}
                      onImplemented={handleRecommendationImplemented}
                    />
                  ))}
                      </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
