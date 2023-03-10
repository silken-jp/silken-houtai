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
  dataSource?: API.WaybillDateStat;
}

const SumChart: React.FC<SumChartProps> = (props) => {
  const data = props?.dataSource || [];
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
