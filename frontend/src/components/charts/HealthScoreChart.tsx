import React from 'react';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Activity, Shield, TrendingUp } from 'lucide-react';

interface HealthScoreData {
  name: string;
  value: number;
  fill: string;
}

interface HealthScoreChartProps {
  overallScore: number;
  categories: HealthScoreData[];
  title?: string;
  height?: number;
}

const HealthScoreChart: React.FC<HealthScoreChartProps> = ({
  overallScore,
  categories,
  title = "Health Score Overview",
  height = 300
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'hsl(142, 76%, 36%)';
    if (score >= 60) return 'hsl(142, 69%, 58%)';
    if (score >= 40) return 'hsl(45, 93%, 47%)';
    return 'hsl(0, 84%, 60%)';
  };

  const getScoreStatus = (score: number) => {
    if (score >= 80) return { text: 'Excellent', icon: Shield, color: 'text-green-600' };
    if (score >= 60) return { text: 'Good', icon: TrendingUp, color: 'text-green-500' };
    if (score >= 40) return { text: 'Fair', icon: Activity, color: 'text-yellow-500' };
    return { text: 'Needs Attention', icon: Heart, color: 'text-red-500' };
  };

  const status = getScoreStatus(overallScore);
  const StatusIcon = status.icon;

  const radialData = [
    {
      name: 'Health Score',
      value: overallScore,
      fill: getScoreColor(overallScore)
    }
  ];

  return (
    <Card className="border border-green-200/60 shadow-xl bg-gradient-to-br from-white/95 to-green-50/95 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500">
      <CardHeader className="bg-gradient-to-r from-green-100/80 to-green-50/80 border-b border-green-200/60">
        <CardTitle className="flex items-center justify-between text-slate-800">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-green-600" />
            {title}
          </div>
          <div className={`flex items-center gap-2 ${status.color}`}>
            <StatusIcon className="h-4 w-4" />
            <span className="font-bold">{status.text}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overall Score Radial Chart */}
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="90%"
                data={radialData}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  dataKey="value"
                  cornerRadius={10}
                  fill={getScoreColor(overallScore)}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            
          </div>

          {/* Category Breakdown */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-800 mb-3">Health Categories</h4>
            {categories.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-100">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.fill }}
                  ></div>
                  <span className="text-sm font-medium text-slate-700">{category.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${category.value}%`,
                        backgroundColor: category.fill
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-slate-800 w-8">{category.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Health Tips */}
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <h5 className="font-semibold text-green-800 mb-2">Health Recommendations</h5>
          <div className="text-sm text-green-700">
            {overallScore >= 80 ? (
              "Excellent health! Keep maintaining your current lifestyle and regular checkups."
            ) : overallScore >= 60 ? (
              "Good health overall. Consider focusing on areas with lower scores for improvement."
            ) : overallScore >= 40 ? (
              "Fair health status. Consult with your healthcare provider for personalized recommendations."
            ) : (
              "Health needs attention. Please schedule an appointment with your healthcare provider."
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthScoreChart;
