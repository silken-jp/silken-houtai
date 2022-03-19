import { PieChart, Pie, Cell, Label, ResponsiveContainer } from 'recharts';

export interface PieChartProps {
  dataSource: any[];
}

const WXPieChart: React.FC<PieChartProps> = (props) => {
  const sum = props?.dataSource?.reduce((a, b) => a + b.value, 0);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <ResponsiveContainer width="100%" height={400} minHeight={400}>
      <PieChart>
        <Pie
          data={props?.dataSource}
          cx={'50%'}
          cy={200}
          innerRadius={120}
          outerRadius={150}
          fill="#8884d8"
          paddingAngle={0}
          dataKey="value"
          label={(a) =>
            `${a.name}: ${a.value} (${(a.value / sum).toFixed(1)})%`
          }
        >
          {props?.dataSource?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
          <Label position="center">合計：{sum} (100%)</Label>
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default WXPieChart;
