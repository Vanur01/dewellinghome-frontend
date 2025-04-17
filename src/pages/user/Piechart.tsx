import { useState } from 'react';
import { PieChart, Pie, Cell, Sector, ResponsiveContainer } from 'recharts';

export default function EnhancedPieChart3D() {
  const [activeIndex, setActiveIndex] = useState(0);

  const data = [
    { 
      name: 'Consultation', 
      value: 15, 
      color: '#4EB5A2', 
      gradient: ['#4EB5A2', '#3D9082'], 
      label: '01',
      title: 'Initial Consultation',
      description: 'Client Brief & Site Visit'
    },
    { 
      name: 'Planning', 
      value: 25, 
      color: '#F0CA64', 
      gradient: ['#F0CA64', '#D9B44E'], 
      label: '02',
      title: 'Space Planning',
      description: 'Layout & Flow Design'
    },
    { 
      name: 'Design', 
      value: 30, 
      color: '#E99D63', 
      gradient: ['#E99D63', '#D28950'], 
      label: '03',
      title: 'Design Development',
      description: 'Colors, Materials & Furniture'
    },
    { 
      name: 'Construction', 
      value: 20, 
      color: '#E67D60', 
      gradient: ['#E67D60', '#D06A4E'], 
      label: '04',
      title: 'Construction Phase',
      description: 'Renovation & Installation'
    },
    { 
      name: 'Styling', 
      value: 10, 
      color: '#A64B3D', 
      gradient: ['#A64B3D', '#8F3F33'], 
      label: '05',
      title: 'Final Styling',
      description: 'Decor & Finishing Touches'
    },
  ];

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  // Define custom defs for gradients and filters
  const renderDefs = () => {
    return (
      <defs>
        {/* Shadow filter for 3D effect */}
        <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
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

        {/* Enhanced inner shadow for 3D effect */}
        <filter id="inner-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
          <feOffset dx="1" dy="1" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.5" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Gradients for each pie slice */}
        {data.map((entry, index) => (
          <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={entry.gradient[0]} />
            <stop offset="100%" stopColor={entry.gradient[1]} />
          </linearGradient>
        ))}

        {/* Gradients for outer ring */}
        {data.map((entry, index) => (
          <linearGradient key={`gradient-outer-${index}`} id={`gradient-outer-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={entry.gradient[0]} stopOpacity="0.9" />
            <stop offset="100%" stopColor={entry.gradient[1]} stopOpacity="0.7" />
          </linearGradient>
        ))}
      </defs>
    );
  };

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, index } = props;
    const sin = Math.sin(-((startAngle + (endAngle - startAngle) / 2) * Math.PI) / 180);
    const cos = Math.cos(-((startAngle + (endAngle - startAngle) / 2) * Math.PI) / 180);
    const mx = cx + (outerRadius + 7) * cos;
    const my = cy + (outerRadius + 7) * sin;
    const textX = cx + (outerRadius + 50) * cos;
    const textY = cy + (outerRadius + 50) * sin;
    
    return (
      <g>
        {/* Inner active segment with 3D effect */}
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={`url(#gradient-${index})`}
          filter="url(#drop-shadow)"
        />
        {/* Outer ring with gradient */}
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 10}
          outerRadius={outerRadius + 24}
          fill={`url(#gradient-outer-${index})`}
          filter="url(#drop-shadow)"
        />
        {/* White connector dot */}
        <circle
          cx={mx}
          cy={my}
          r={4}
          fill="white"
          filter="url(#drop-shadow)"
        />
        {/* Line from dot to text */}
        <line
          x1={mx}
          y1={my}
          x2={textX}
          y2={textY}
          stroke="#D0D0D0"
          strokeWidth={1}
        />
        {/* White dot at end of line */}
        <circle
          cx={textX}
          cy={textY}
          r={4}
          fill="white"
          filter="url(#drop-shadow)"
        />
        {/* Label box */}
        <foreignObject
          x={textX - (cos > 0 ? 0 : 150)}
          y={textY - 40}
          width="150"
          height="100"
        >
          <div className="flex flex-col" style={{ fontFamily: 'sans-serif' }}>
            <div className="flex items-center mb-1">
              <span className="text-xl text-gray-500 font-light">{data[index].label}</span>
            </div>
            <div>
              <h3 className="text-gray-700 font-medium text-sm whitespace-normal">{data[index].title}</h3>
              <p className="text-gray-500 text-xs whitespace-normal leading-tight mt-1">{data[index].description}</p>
            </div>
          </div>
        </foreignObject>
      </g>
    );
  };

  // Custom label for the inner pie
  const renderInnerLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="#333" 
        fontWeight="bold"
        fontSize="8"
        textAnchor="middle" 
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg w-full max-w-5xl mx-auto">
      
      <div className="flex justify-center items-center w-full h-[500px] relative">
        {/* Base shadow for the entire chart */}
        {/* <div className="absolute rounded-full bg-white shadow-xl opacity-50 mx-auto my-auto w-64 h-64 top-0 bottom-0 left-0 right-0 m-auto"></div> */}
        
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {renderDefs()}
            
            {/* Added inner filled circle WITH PERCENTAGES */}
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={60}
              dataKey="value"
              labelLine={false}
              label={renderInnerLabel}
              paddingAngle={0}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-inner-${index}`} 
                  fill={`url(#gradient-${index})`}
                  filter="url(#inner-shadow)"
                  strokeWidth={0}
                />
              ))}
            </Pie>
            
            
            {/* Original pie chart - removed labels */}
            <Pie
              activeIndex={activeIndex}
              activeShape={props => renderActiveShape({...props, index: activeIndex})}
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              dataKey="value"
              onMouseEnter={onPieEnter}
              paddingAngle={1}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`url(#gradient-${index})`}
                  filter="url(#drop-shadow)"
                  strokeWidth={0}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}