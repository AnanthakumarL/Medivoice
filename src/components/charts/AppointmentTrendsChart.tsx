import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';

interface AppointmentData {
  month: string;
  scheduled: number;
  completed: number;
  cancelled: number;
  upcoming: number;
}

interface AppointmentTrendsChartProps {
  data: AppointmentData[];
  title?: string;
  height?: number;
  type?: 'area' | 'bar';
}

const AppointmentTrendsChart: React.FC<AppointmentTrendsChartProps> = ({
  data,
  title = "Appointment Trends",
  height = 300,
  type = 'area'
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-green-200 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-800 mb-2">{`Month: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const totalAppointments = data.reduce((sum, item) => sum + item.scheduled, 0);
  const completedAppointments = data.reduce((sum, item) => sum + item.completed, 0);
  const completionRate = totalAppointments > 0 ? (completedAppointments / totalAppointments * 100) : 0;

  return (
    <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500">
      <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
        <CardTitle className="flex items-center justify-between text-slate-800">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-600" />
            {title}
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="font-bold text-blue-600">{totalAppointments}</span>
              <span className="text-slate-600">total</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="font-bold text-green-600">{completionRate.toFixed(1)}%</span>
              <span className="text-slate-600">completed</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <ResponsiveContainer width="100%" height={height}>
          {type === 'area' ? (
            <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="scheduledGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142, 69%, 58%)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(142, 69%, 58%)" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="cancelledGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
              <XAxis 
                dataKey="month" 
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
              <Area
                type="monotone"
                dataKey="scheduled"
                stackId="1"
                stroke="hsl(142, 76%, 36%)"
                fill="url(#scheduledGradient)"
                strokeWidth={2}
                name="Scheduled"
              />
              <Area
                type="monotone"
                dataKey="completed"
                stackId="2"
                stroke="hsl(142, 69%, 58%)"
                fill="url(#completedGradient)"
                strokeWidth={2}
                name="Completed"
              />
              <Area
                type="monotone"
                dataKey="cancelled"
                stackId="3"
                stroke="hsl(0, 84%, 60%)"
                fill="url(#cancelledGradient)"
                strokeWidth={2}
                name="Cancelled"
              />
            </AreaChart>
          ) : (
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
              <XAxis 
                dataKey="month" 
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
              <Bar dataKey="scheduled" fill="hsl(142, 76%, 36%)" radius={[2, 2, 0, 0]} name="Scheduled" />
              <Bar dataKey="completed" fill="hsl(142, 69%, 58%)" radius={[2, 2, 0, 0]} name="Completed" />
              <Bar dataKey="cancelled" fill="hsl(0, 84%, 60%)" radius={[2, 2, 0, 0]} name="Cancelled" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AppointmentTrendsChart;
