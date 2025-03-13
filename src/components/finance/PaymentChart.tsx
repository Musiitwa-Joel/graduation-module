import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Jan',
    completed: 4200,
    pending: 1800,
    failed: 400,
  },
  {
    name: 'Feb',
    completed: 3800,
    pending: 1200,
    failed: 300,
  },
  {
    name: 'Mar',
    completed: 5000,
    pending: 2000,
    failed: 500,
  },
  {
    name: 'Apr',
    completed: 6500,
    pending: 1500,
    failed: 200,
  },
  {
    name: 'May',
    completed: 7800,
    pending: 1000,
    failed: 100,
  },
  {
    name: 'Jun',
    completed: 9000,
    pending: 800,
    failed: 50,
  },
];

export default function PaymentChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => `$${value}`} />
        <Legend />
        <Bar dataKey="completed" fill="#22c55e" name="Completed" />
        <Bar dataKey="pending" fill="#f97316" name="Pending" />
        <Bar dataKey="failed" fill="#ef4444" name="Failed" />
      </BarChart>
    </ResponsiveContainer>
  );
}