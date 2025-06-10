'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ApplianceCard from '@/components/appliance-card';
import { applianceService } from '@/services/api';

export default function AppliancesPage() {
  const [appliances, setAppliances] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppliances = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await applianceService.getAllAppliances();
        if (response.success) {
          setAppliances(response.data);
        } else {
          setError('Failed to load appliance data');
          console.error('API Error:', response.error);
        }
      } catch (error) {
        setError('Failed to load appliance data');
        console.error('Error fetching appliances:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppliances();
  }, []);

  const handleToggleAppliance = async (id: string) => {
    try {
      const response = await applianceService.toggleApplianceStatus(id);
      
      if (response.success) {
        setAppliances(appliances.map(appliance => 
          appliance._id === id 
            ? response.data
            : appliance
        ));
      } else {
        console.error('API Error:', response.error);
        setError('Failed to toggle appliance. Please try again.');
        setTimeout(() => setError(null), 3000);
      }
    } catch (error) {
      console.error('Error toggling appliance:', error);
      setError('Failed to toggle appliance. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const filteredAppliances = appliances.filter(appliance => {
    const matchesSearch = searchQuery === '' || 
      appliance.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appliance.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === null || appliance.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const applianceTypes = [
    { value: 'lighting', label: 'Lighting' },
    { value: 'heating', label: 'Heating' },
    { value: 'cooling', label: 'Cooling' },
    { value: 'kitchen', label: 'Kitchen' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'other', label: 'Other' }
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
              <h1 className="text-2xl font-bold mb-2">Appliances</h1>
              <p className="text-slate-600 dark:text-slate-400">
                Manage and monitor your connected devices
              </p>
            </div>
            <Button variant="primary" className="mt-4 md:mt-0 flex items-center">
              <Plus className="mr-2 h-4 w-4" /> Add New Appliance
            </Button>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="search"
                    placeholder="Search appliances by name or location..."
                    className="pl-10 pr-4 py-2 h-10 w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-green-600 dark:focus:ring-green-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={filterType === null ? 'primary' : 'outline'} 
                    size="sm"
                    onClick={() => setFilterType(null)}
                  >
                    All
                  </Button>
                  {applianceTypes.map(type => (
                    <Button
                      key={type.value}
                      variant={filterType === type.value ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setFilterType(type.value)}
                    >
                      {type.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mb-4"></div>
                <p className="text-lg">Loading appliances...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAppliances.map(appliance => (
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
              {filteredAppliances.length === 0 && (
                <Card className="col-span-full p-8 text-center">
                  <p className="text-slate-500 dark:text-slate-400">
                    No appliances found. Try changing your filters or add a new appliance.
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
