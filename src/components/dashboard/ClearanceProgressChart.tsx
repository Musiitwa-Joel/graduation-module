import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Academic Faculty',
    completed: 78,
    pending: 15,
    rejected: 7,
  },
  {
    name: 'Registrar',
    completed: 65,
    pending: 25,
    rejected: 10,
  },
  {
    name: 'Examinations',
    completed: 82,
    pending: 12,
    rejected: 6,
  },
  {
    name: 'Finance',
    completed: 70,
    pending: 20,
    rejected: 10,
  },
  {
    name: 'Alumni',
    completed: 55,
    pending: 40,
    rejected: 5,
  },
];

export default function ClearanceProgressChart() {
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
        <Tooltip />
        <Legend />
        <Bar dataKey="completed" stackId="a" fill="#f97316" name="Completed" />
        <Bar dataKey="pending" stackId="a" fill="#0ea5e9" name="Pending" />
        <Bar dataKey="rejected" stackId="a" fill="#ef4444" name="Rejected" />
      </BarChart>
    </ResponsiveContainer>
  );
}