import {
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';

interface SumChartProps {
  dataSource: any[];
}

const SumChart: React.FC<SumChartProps> = (props) => {
  const data = [
    { name: '2021年08月', sum: 1000, s0: 8, s1: 800, s2: 6, s3: 1 },
    { name: '2021年09月', sum: 1234, s0: 6, s1: 800, s2: 28, s3: 1 },
    { name: '2021年10月', sum: 1345, s0: 5, s1: 1200, s2: 52, s3: 2 },
    { name: '2021年11月', sum: 1565, s0: 3, s1: 1200, s2: 70, s3: 3 },
    { name: '2021年12月', sum: 2353, s0: 7, s1: 1800, s2: 30, s3: 4 },
    { name: '2022年01月', sum: 2346, s0: 2, s1: 2000, s2: 300, s3: 3 },
  ];

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <ComposedChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="name" scale="band" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="sum" fill="#8884d8" stroke="#8884d8" />
          <Bar dataKey="s0" barSize={10} fill="#FF8042" />
          <Bar dataKey="s1" barSize={10} fill="#00C49F" />
          <Bar dataKey="s2" barSize={10} fill="#0088FE" />
          <Bar dataKey="s3" barSize={10} fill="#FFBB28" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SumChart;
