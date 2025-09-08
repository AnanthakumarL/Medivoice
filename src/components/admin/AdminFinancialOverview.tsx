import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Receipt, Wallet } from 'lucide-react';
import { AdminFinancialData } from '@/lib/adminMockData';

interface AdminFinancialOverviewProps {
  financialData: AdminFinancialData;
}

export const AdminFinancialOverview: React.FC<AdminFinancialOverviewProps> = ({ financialData }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculatePercentageChange = (current: number, previous: number) => {
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const financialCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(financialData.totalRevenue),
      change: '+12.5%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Monthly Revenue',
      value: formatCurrency(financialData.monthlyRevenue),
      change: '+8.2%',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Pending Payments',
      value: formatCurrency(financialData.pendingPayments),
      change: '-5.1%',
      trend: 'down' as const,
      icon: CreditCard,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      title: 'Insurance Claims',
      value: formatCurrency(financialData.insuranceClaims),
      change: '+15.3%',
      trend: 'up' as const,
      icon: Receipt,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Monthly Expenses',
      value: formatCurrency(financialData.expenses),
      change: '+3.7%',
      trend: 'up' as const,
      icon: Wallet,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      title: 'Net Profit',
      value: formatCurrency(financialData.profit),
      change: '+18.9%',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Financial Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {financialCards.map((card, index) => (
          <Card 
            key={index}
            className={`border ${card.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer`}
          >
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className={`p-3 ${card.bgColor} rounded-lg`}>
                    <card.icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-800">
                      {card.value}
                    </p>
                    <p className="text-xs text-slate-600 font-medium">
                      {card.title}
                    </p>
                  </div>
                </div>

                {/* Trend */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    {card.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span 
                      className={`text-sm font-medium ${
                        card.trend === 'up' ? 'text-green-600' : 'text-red-500'
                      }`}
                    >
                      {card.change}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    vs last month
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Financial Summary */}
      <Card className="border border-slate-200/60 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-slate-600" />
            Financial Summary
          </CardTitle>
          <CardDescription>
            Overview of hospital financial performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Revenue Breakdown */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">
                Revenue Sources
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Patient Services</span>
                  <span className="text-sm font-medium text-slate-800">65%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Insurance</span>
                  <span className="text-sm font-medium text-slate-800">25%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Other</span>
                  <span className="text-sm font-medium text-slate-800">10%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>

            {/* Expense Breakdown */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">
                Expense Categories
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Staff Salaries</span>
                  <span className="text-sm font-medium text-slate-800">45%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Equipment</span>
                  <span className="text-sm font-medium text-slate-800">30%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Utilities</span>
                  <span className="text-sm font-medium text-slate-800">25%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">
                Key Metrics
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700 font-medium">
                    Profit Margin
                  </p>
                  <p className="text-xl text-green-800 font-bold">
                    48.6%
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700 font-medium">
                    Collection Rate
                  </p>
                  <p className="text-xl text-blue-800 font-bold">
                    94.2%
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-700 font-medium">
                    Average Revenue/Patient
                  </p>
                  <p className="text-xl text-purple-800 font-bold">
                    ₹1,24,700
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};