import React from 'react';

interface ChartData {
    label: string;
    value: number;
}

interface BarChartProps {
    data: ChartData[];
    title: string;
}

export const BarChart: React.FC<BarChartProps> = ({ data, title }) => {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-slate-200">{title}</h3>
                <p className="text-gray-500 dark:text-slate-400">Pas de données à afficher.</p>
            </div>
        );
    }
    
    const maxValue = Math.max(...data.map(d => d.value), 0);
    const chartHeight = 250;
    const barWidth = 40;
    const barMargin = 15;
    const chartWidth = data.length * (barWidth + barMargin);

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md overflow-x-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-slate-200">{title}</h3>
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`} className="min-w-full">
                <g>
                    {data.map((item, index) => {
                        const barHeight = maxValue > 0 ? (item.value / maxValue) * chartHeight : 0;
                        const x = index * (barWidth + barMargin);
                        const y = chartHeight - barHeight;
                        return (
                            <g key={index}>
                                <rect
                                    x={x}
                                    y={y}
                                    width={barWidth}
                                    height={barHeight}
                                    className="fill-primary"
                                >
                                    <title>{`${item.label}: ${item.value}`}</title>
                                </rect>
                                <text
                                    x={x + barWidth / 2}
                                    y={chartHeight + 20}
                                    textAnchor="middle"
                                    className="text-xs fill-current text-gray-600 dark:text-slate-400"
                                >
                                    {item.label}
                                </text>
                                <text
                                    x={x + barWidth / 2}
                                    y={y - 5}
                                    textAnchor="middle"
                                    className="text-xs font-bold fill-current text-gray-800 dark:text-slate-200"
                                >
                                    {item.value}
                                </text>
                            </g>
                        );
                    })}
                </g>
            </svg>
        </div>
    );
};

interface LineChartProps {
    data: ChartData[];
    title: string;
}

export const LineChart: React.FC<LineChartProps> = ({ data, title }) => {
    if (!data || data.length < 2) {
        return (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-slate-200">{title}</h3>
                <p className="text-gray-500 dark:text-slate-400">Données insuffisantes pour afficher le graphique.</p>
            </div>
        );
    }
    
    const maxValue = Math.max(...data.map(d => d.value), 0);
    const chartHeight = 250;
    const padding = 20;
    const chartWidth = 500;

    const getX = (index: number) => padding + (index / (data.length - 1)) * (chartWidth - 2 * padding);
    const getY = (value: number) => chartHeight - padding - (maxValue > 0 ? (value / maxValue) * (chartHeight - 2 * padding) : 0);

    const linePath = data.map((point, i) => `${getX(i)},${getY(point.value)}`).join(' ');

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md overflow-x-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-slate-200">{title}</h3>
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`} className="min-w-full">
                <polyline
                    fill="none"
                    strokeWidth="2"
                    points={linePath}
                    className="stroke-accent"
                />
                {data.map((point, i) => (
                    <g key={i}>
                        <circle
                            cx={getX(i)}
                            cy={getY(point.value)}
                            r="4"
                            className="fill-accent"
                        >
                            <title>{`${point.label}: ${point.value}`}</title>
                        </circle>
                         <text
                            x={getX(i)}
                            y={chartHeight + 20}
                            textAnchor="middle"
                            className="text-xs fill-current text-gray-600 dark:text-slate-400"
                        >
                            {point.label}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
};
