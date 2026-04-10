import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HealthMetricsChartProps {
  data: Array<{
    date: string;
    heartRate: number;
    bloodPressureSystolic: number;
    bloodPressureDiastolic: number;
    weight: number;
  }>;
  title?: string;
  height?: number;
}

const HealthMetricsChart: React.FC<HealthMetricsChartProps> = ({
  data,
  title = "Health Metrics Trends",
  height = 300
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-green-200 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-800 mb-2">{`Date: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}${entry.name === 'Weight' ? ' lbs' : entry.name === 'Heart Rate' ? ' bpm' : ' mmHg'}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500">
      <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
            <XAxis 
              dataKey="date" 
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="heartRate"
              stroke="hsl(142, 76%, 36%)"
              strokeWidth={3}
              dot={{ fill: "hsl(142, 76%, 36%)", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "hsl(142, 76%, 36%)", strokeWidth: 2 }}
              name="Heart Rate"
            />
            <Line
              type="monotone"
              dataKey="bloodPressureSystolic"
              stroke="hsl(142, 69%, 58%)"
              strokeWidth={3}
              dot={{ fill: "hsl(142, 69%, 58%)", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "hsl(142, 69%, 58%)", strokeWidth: 2 }}
              name="Systolic BP"
            />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="hsl(120, 60%, 50%)"
              strokeWidth={3}
              dot={{ fill: "hsl(120, 60%, 50%)", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "hsl(120, 60%, 50%)", strokeWidth: 2 }}
              name="Weight"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default HealthMetricsChart;
