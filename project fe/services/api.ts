import axios from 'axios';

const API_URL = 'https://project-be-t627.onrender.com/api/';


const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const applianceService = {
  getAllAppliances: async () => {
    const response = await api.get('/appliances');
    return response.data;
  },
  getAppliance: async (id: string) => {
    const response = await api.get(`/appliances/${id}`);
    return response.data;
  },
  toggleApplianceStatus: async (id: string) => {
    const response = await api.put(`/appliances/${id}/toggle`);
    return response.data;
  },
  updateAppliance: async (id: string, data: any) => {
    const response = await api.put(`/appliances/${id}`, data);
    return response.data;
  },
};

export const energyService = {
  getRealTimeEnergyData: async () => {
    const response = await api.get('/energy/realtime');
    return response.data;
  },
  getEnergyBreakdown: async (period = 'day') => {
    const response = await api.get(`/energy/breakdown?period=${period}`);
    return response.data;
  },
  getHistoricalEnergyData: async (interval = 'daily', startDate?: string, endDate?: string) => {
    let url = `/energy/historical?interval=${interval}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;
    
    const response = await api.get(url);
    return response.data;
  },
};

export const recommendationService = {
  getAllRecommendations: async () => {
    const response = await api.get('/recommendations');
    return response.data;
  },
  updateRecommendationStatus: async (id: string, implemented: boolean) => {
    const response = await api.put(`/recommendations/${id}/status`, { implemented });
    return response.data;
  },
  generateRecommendations: async () => {
    const response = await api.post('/recommendations/generate');
    return response.data;
  },
};

export const userSettingService = {
  getUserSettings: async () => {
    const response = await api.get('/settings');
    return response.data;
  },
  updateUserSettings: async (settings: any) => {
    const response = await api.put('/settings', settings);
    return response.data;
  },
  addAutomationRule: async (rule: any) => {
    const response = await api.post('/settings/automation', rule);
    return response.data;
  },
  updateAutomationRule: async (ruleId: string, rule: any) => {
    const response = await api.put(`/settings/automation/${ruleId}`, rule);
    return response.data;
  },
  deleteAutomationRule: async (ruleId: string) => {
    const response = await api.delete(`/settings/automation/${ruleId}`);
    return response.data;
  },
};
