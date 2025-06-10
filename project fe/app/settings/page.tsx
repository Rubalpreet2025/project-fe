'use client';

import React, { useEffect, useState } from 'react';
import { Save, Plus } from 'lucide-react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { userSettingService } from '@/services/api';

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await userSettingService.getUserSettings();
      
      if (response.success) {
        setSettings(response.data);
      } else {
        console.error('API Error:', response.error);
        setError('Failed to load settings');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setError('Failed to load settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = (section: string, field: string, value: any) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value
      }
    });
  };

  const handleNestedSettingChange = (section: string, nestedSection: string, field: string, value: any) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [nestedSection]: {
          ...settings[section][nestedSection],
          [field]: value
        }
      }
    });
  };

  const handleToggleAutomationRule = (index: number) => {
    if (!settings || !settings.automationRules) return;
    
    const updatedRules = [...settings.automationRules];
    updatedRules[index] = {
      ...updatedRules[index],
      active: !updatedRules[index].active
    };
    
    setSettings({
      ...settings,
      automationRules: updatedRules
    });
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const response = await userSettingService.updateUserSettings(settings);
      
      if (response.success) {
        setError(null);
        // Use a more subtle notification instead of an alert
        // You could implement a toast notification system here
        const successMessage = 'Settings saved successfully!';
        console.log(successMessage);
        setError(`✅ ${successMessage}`); // Using error state for success message
        setTimeout(() => setError(null), 3000);
      } else {
        console.error('API Error:', response.error);
        setError('Failed to save settings. Please try again.');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mb-4"></div>
                <p className="text-lg">Loading settings...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className={`border px-4 py-3 rounded mb-6 flex justify-between ${
              error.startsWith('✅') ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'
            }`}>
              <p>{error}</p>
              <button onClick={() => setError(null)} className="font-bold">×</button>
            </div>
          )}
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">Settings</h1>
              <p className="text-slate-600 dark:text-slate-400">
                Customize your energy management preferences
              </p>
            </div>
            <Button 
              variant="primary" 
              className="mt-4 md:mt-0 flex items-center"
              onClick={handleSaveSettings}
              disabled={isSaving}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Energy Cost Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Energy Price per kWh ($)
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800"
                      value={settings.energyPricePerKWh}
                      onChange={(e) => handleSettingChange('energyPricePerKWh', '', parseFloat(e.target.value))}
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Email Notifications</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={settings.notificationPreferences.email.enabled}
                        onChange={(e) => handleNestedSettingChange('notificationPreferences', 'email', 'enabled', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-600 dark:peer-focus:ring-green-500 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                  
                  {settings.notificationPreferences.email.enabled && (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800"
                        value={settings.notificationPreferences.email.address}
                        onChange={(e) => handleNestedSettingChange('notificationPreferences', 'email', 'address', e.target.value)}
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Push Notifications</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={settings.notificationPreferences.push.enabled}
                        onChange={(e) => handleNestedSettingChange('notificationPreferences', 'push', 'enabled', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-600 dark:peer-focus:ring-green-500 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">High Consumption Alerts</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={settings.notificationPreferences.notifyOnHighConsumption}
                        onChange={(e) => handleNestedSettingChange('notificationPreferences', 'notifyOnHighConsumption', '', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-600 dark:peer-focus:ring-green-500 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">New Recommendations</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={settings.notificationPreferences.notifyOnRecommendations}
                        onChange={(e) => handleNestedSettingChange('notificationPreferences', 'notifyOnRecommendations', '', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-600 dark:peer-focus:ring-green-500 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Automation Rules</CardTitle>
              <Button variant="outline" size="sm" className="flex items-center">
                <Plus className="mr-1 h-4 w-4" /> Add Rule
              </Button>
            </CardHeader>
            <CardContent>
              {settings.automationRules.length > 0 ? (
                <div className="space-y-4">
                  {settings.automationRules.map((rule: any, index: number) => (
                    <div key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                      <div>
                        <h4 className="font-medium">{rule.name}</h4>
                        <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          <p><span className="font-medium">When:</span> {rule.condition}</p>
                          <p><span className="font-medium">Then:</span> {rule.action}</p>
                        </div>
                      </div>
                      <div className="flex items-center mt-3 sm:mt-0">
                        <label className="relative inline-flex items-center cursor-pointer mr-2">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={rule.active}
                            onChange={() => handleToggleAutomationRule(index)}
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-600 dark:peer-focus:ring-green-500 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-green-600"></div>
                        </label>
                        <span className="text-xs">{rule.active ? 'Active' : 'Inactive'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-500 dark:text-slate-400 py-4">
                  No automation rules configured. Add a rule to automate energy saving actions.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dashboard Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Show Energy Graph</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={settings.dashboardLayout.showEnergyGraph}
                      onChange={(e) => handleNestedSettingChange('dashboardLayout', 'showEnergyGraph', '', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-600 dark:peer-focus:ring-green-500 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-green-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Show Appliance Breakdown</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={settings.dashboardLayout.showApplianceBreakdown}
                      onChange={(e) => handleNestedSettingChange('dashboardLayout', 'showApplianceBreakdown', '', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-600 dark:peer-focus:ring-green-500 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-green-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Show Cost Estimates</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={settings.dashboardLayout.showCostEstimates}
                      onChange={(e) => handleNestedSettingChange('dashboardLayout', 'showCostEstimates', '', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-600 dark:peer-focus:ring-green-500 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-green-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Show Recommendations</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={settings.dashboardLayout.showRecommendations}
                      onChange={(e) => handleNestedSettingChange('dashboardLayout', 'showRecommendations', '', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-600 dark:peer-focus:ring-green-500 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-green-600"></div>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
