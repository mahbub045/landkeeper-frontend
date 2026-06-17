import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FileText, MapPin, Users } from 'lucide-react';

const stats = [
  {
    title: 'Total Parcels',
    value: '12,400+',
    description: 'Active land parcels tracked',
    icon: MapPin,
  },
  {
    title: 'Applications',
    value: '86',
    description: 'Pending review this month',
    icon: FileText,
  },
  {
    title: 'Organisations',
    value: '340+',
    description: 'Connected to Landkeeper',
    icon: Users,
  },
];

export default function AdminDashboardPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>Admin Dashboard</h1>
        <p className='text-sm text-muted-foreground'>
          Complete overview of all land management activity.
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
              <stat.icon className='size-4 text-green-900' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stat.value}</div>
              <CardDescription>{stat.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
