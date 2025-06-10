'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import RecommendationCard from '@/components/recommendation-card';
import { recommendationService } from '@/services/api';

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const [error, setError] = useState<string | null>(null);
  
  const fetchRecommendations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await recommendationService.getAllRecommendations();
      
      if (response.success) {
        setRecommendations(response.data);
      } else {
        console.error('API Error:', response.error);
        setError('Failed to load recommendations');
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError('Failed to load recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateRecommendations = async () => {
    setIsLoading(true);
    try {
      const response = await recommendationService.generateRecommendations();
      
      if (response.success) {
        await fetchRecommendations();
      } else {
        console.error('API Error:', response.error);
        setError('Failed to generate recommendations');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setError('Failed to generate recommendations. Please try again.');
      setIsLoading(false);
    }
  };

  const handleImplemented = async (id: string, implemented: boolean) => {
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
        setError('Failed to update recommendation status');
        setTimeout(() => setError(null), 3000);
      }
    } catch (error) {
      console.error('Error updating recommendation:', error);
      setError('Failed to update recommendation status. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const filteredRecommendations = activeCategory
    ? recommendations.filter(rec => rec.category === activeCategory)
    : recommendations;

  const categories = [
    { value: 'behavior', label: 'Behavior Change' },
    { value: 'appliance', label: 'Appliance Specific' },
    { value: 'scheduling', label: 'Scheduling' },
    { value: 'upgrade', label: 'Upgrades' }
  ];

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
              <h1 className="text-2xl font-bold mb-2">Energy Saving Recommendations</h1>
              <p className="text-slate-600 dark:text-slate-400">
                Personalized tips to help you reduce energy consumption
              </p>
            </div>
            <Button 
              variant="primary" 
              className="mt-4 md:mt-0 flex items-center"
              onClick={handleGenerateRecommendations}
              disabled={isLoading}
            >
              <ArrowUpRight className="mr-2 h-4 w-4" />
              {isLoading ? 'Generating...' : 'Generate New Tips'}
            </Button>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6 pb-6 flex flex-wrap gap-3">
              <Button 
                variant={activeCategory === null ? 'primary' : 'outline'} 
                size="sm"
                onClick={() => setActiveCategory(null)}
              >
                All Recommendations
              </Button>
              {categories.map(category => (
                <Button
                  key={category.value}
                  variant={activeCategory === category.value ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setActiveCategory(category.value)}
                >
                  {category.label}
                </Button>
              ))}
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mb-4"></div>
                <p className="text-lg">Loading recommendations...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredRecommendations.map(recommendation => (
                <RecommendationCard
                  key={recommendation._id}
                  id={recommendation._id}
                  title={recommendation.title}
                  description={recommendation.description}
                  potentialSavings={recommendation.potentialSavings}
                  category={recommendation.category}
                  priority={recommendation.priority}
                  implemented={recommendation.implemented}
                  onImplemented={handleImplemented}
                />
              ))}
              {filteredRecommendations.length === 0 && (
                <Card className="col-span-full p-8 text-center">
                  <p className="text-slate-500 dark:text-slate-400">
                    No recommendations found. Generate new recommendations or change your filters.
                  </p>
                </Card>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
