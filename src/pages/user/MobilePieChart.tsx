import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DataItem {
  name: string;
  value: number;
  color: string;
}

interface MobilePieChartProps {
  data: DataItem[];
  width?: number;
  height?: number;
}

const COLORS = [
  ['#4EB5A2', '#3D9082'], // Teal
  ['#F0CA64', '#D9B44E'], // Gold
  ['#E99D63', '#D28950'], // Orange
  ['#E67D60', '#D06A4E'], // Coral
];

const MobilePieChart: React.FC<MobilePieChartProps> = ({ 
  data: inputData,
}) => {
  // Map input data to our enhanced color scheme
  const data = inputData.map((item, index) => ({
    name: item.name,
    value: item.value,
    gradient: COLORS[index % COLORS.length]
  }));

  const renderDefs = () => (
    <defs>
      <filter id="mobile-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
        <feOffset dx="2" dy="2" result="offsetblur" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.3" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {data.map((entry, index) => (
        <linearGradient
          key={`gradient-${index}`}
          id={`gradient-${index}`}
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0%" stopColor={entry.gradient[0]} />
          <stop offset="100%" stopColor={entry.gradient[1]} />
        </linearGradient>
      ))}
    </defs>
  );

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#fff"
        fontSize="14"
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  return (
    <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] relative">
      <ResponsiveContainer>
        <PieChart>
          {renderDefs()}
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius="100%"
            paddingAngle={0}
            dataKey="value"
            label={renderCustomizedLabel}
            labelLine={false}
          >
            {data.map(( index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={`url(#gradient-${index})`}
                filter="url(#mobile-shadow)"
                strokeWidth={0}
              />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              padding: '8px 12px',
            }}
            formatter={(value) => [`${value}`, '']}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="bottom"
            iconSize={12}
            iconType="circle"
            wrapperStyle={{
              paddingLeft: '',
              fontSize: '14px',
              fontWeight: 500,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MobilePieChart;
