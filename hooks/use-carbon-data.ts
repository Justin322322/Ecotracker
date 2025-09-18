'use client';

import { useQuery } from '@tanstack/react-query';

// Types for our carbon data
interface CarbonEmission {
  date: string;
  transportation: number;
  energy: number;
  total: number;
}

interface EnergyUsage {
  month: string;
  usage: number;
  cost: number;
  emissions: number;
}

interface TransportationData {
  mode: string;
  distance: number;
  emissions: number;
  frequency: string;
}

// Custom hook for carbon emissions data
export function useCarbonEmissions(timeRange: string = '30d') {
  return useQuery({
    queryKey: ['carbon-emissions', timeRange],
    queryFn: async (): Promise<CarbonEmission[]> => {
      // Deterministic mock series for 90d/30d/7d
      const end = new Date("2024-05-30");
      const range = timeRange === '90d' ? 90 : timeRange === '7d' ? 7 : 30;
      const series: CarbonEmission[] = [];
      for (let i = range - 1; i >= 0; i--) {
        const d = new Date(end);
        d.setDate(end.getDate() - i);
        const day = d.getDate();
        // Simple wave to keep charts non-flat
        const transportation = Number((1 + (Math.sin(day / 3) + 1) * 1.2).toFixed(2));
        const energy = Number((0.8 + (Math.cos(day / 4) + 1) * 0.9).toFixed(2));
        const total = Number((transportation + energy).toFixed(2));
        series.push({ date: d.toISOString().slice(0, 10), transportation, energy, total });
      }
      return series;
    },
  });
}

// Custom hook for energy usage data
function useEnergyUsage() {
  return useQuery({
    queryKey: ['energy-usage'],
    queryFn: async (): Promise<EnergyUsage[]> => {
      // Simulate API call
      const mockData: EnergyUsage[] = [
        { month: 'January', usage: 850, cost: 120, emissions: 1.2 },
        { month: 'February', usage: 890, cost: 125, emissions: 1.3 },
        { month: 'March', usage: 820, cost: 115, emissions: 1.1 },
        { month: 'April', usage: 890, cost: 118, emissions: 1.25 },
      ];

      return mockData;
    },
  });
}

// Custom hook for transportation data
function useTransportationData() {
  return useQuery({
    queryKey: ['transportation-data'],
    queryFn: async (): Promise<TransportationData[]> => {
      // Simulate API call
      const mockData: TransportationData[] = [
        { mode: 'Car', distance: 45, emissions: 2.1, frequency: 'Daily' },
        { mode: 'Public Transport', distance: 20, emissions: 0.8, frequency: 'Daily' },
        { mode: 'Walking', distance: 5, emissions: 0, frequency: 'Daily' },
        { mode: 'Bicycle', distance: 10, emissions: 0, frequency: 'Weekly' },
      ];

      return mockData;
    },
  });
}

// Removed unused mutation hook useUpdateCarbonData

// Dashboard summary type
interface DashboardSummary {
  totalEmissions: number;
  monthlyReduction: number;
  transportationEmissions: number;
  transportationReduction: number;
  energyUsage: number;
  energyReduction: number;
  carbonOffset: number;
  offsetIncrease: number;
}

// Hook for dashboard summary data
export function useDashboardSummary() {
  const carbonQuery = useCarbonEmissions();
  const energyQuery = useEnergyUsage();
  const transportQuery = useTransportationData();

  return useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: async (): Promise<DashboardSummary> => {
      // Calculate summary data
      const summary: DashboardSummary = {
        totalEmissions: 2.8,
        monthlyReduction: -15.2,
        transportationEmissions: 1.2,
        transportationReduction: -8.3,
        energyUsage: 890,
        energyReduction: -5.1,
        carbonOffset: 73,
        offsetIncrease: 23,
      };

      return summary;
    },
    enabled: carbonQuery.isSuccess && energyQuery.isSuccess && transportQuery.isSuccess,
  });
}
