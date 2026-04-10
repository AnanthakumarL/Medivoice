import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface StatCard {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<any>;
  target?: number;
  color?: string;
}

interface AdminStatsCardsProps {
  stats: StatCard[];
}

export const AdminStatsCards: React.FC<AdminStatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className="border border-slate-200/60 shadow-lg bg-gradient-to-br from-white/95 to-slate-50/95 hover:shadow-xl hover:shadow-slate-500/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
        >
          <CardContent className="p-4 relative">
            <div className="space-y-4">
              {/* Icon and Value */}
              <div className="flex justify-between items-start">
                <div className={`p-2 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg ${stat.color || ''}`}>
                  <stat.icon className="h-5 w-5 text-slate-600" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-800">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-600 font-medium">
                    {stat.label}
                  </p>
                </div>
              </div>

              {/* Progress Bar (if target exists) */}
              {stat.target && (
                <div className="space-y-1">
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-slate-500 to-slate-600 h-1.5 rounded-full transition-all duration-1000"
                      style={{ width: `${(parseInt(stat.value.replace(/,/g, '')) / stat.target) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    Target: {stat.target.toLocaleString()}
                  </p>
                </div>
              )}

              {/* Trend Indicator */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  {stat.trend === "up" && <TrendingUp className="h-3 w-3 text-green-600" />}
                  {stat.trend === "down" && <TrendingDown className="h-3 w-3 text-red-500" />}
                  {stat.trend === "stable" && <Activity className="h-3 w-3 text-slate-600" />}
                  <span 
                    className={`text-xs font-medium ${
                      stat.trend === "up" ? "text-green-600" :
                      stat.trend === "down" ? "text-red-500" : "text-slate-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
                <span className="text-xs text-slate-500">
                  vs yesterday
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};