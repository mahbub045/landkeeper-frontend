import { Report } from '@/types/client/Common/ReportsAndAnalytics/ReportsType';
import {
  Building2,
  Calculator,
  FileText,
  Landmark,
  LineChart,
  ShieldCheck,
} from 'lucide-react';

export const reports: Report[] = [
  {
    id: 1,
    title: 'Portfolio Summary',
    description: 'Complete overview of all properties',
    icon: <Building2 className='size-10 text-blue-600' />,
  },
  {
    id: 2,
    title: 'Income Report',
    description: 'Rental income analysis',
    icon: <LineChart className='size-10 text-emerald-600' />,
  },
  {
    id: 3,
    title: 'Expense Report',
    description: 'Track all property expenses',
    icon: <FileText className='size-10 text-red-500' />,
  },
  {
    id: 4,
    title: 'Tax Preparation',
    description: 'HMRC-ready tax summary',
    icon: <Calculator className='size-10 text-amber-500' />,
  },
  {
    id: 5,
    title: 'Compliance Report',
    description: 'Certificate status overview',
    icon: <ShieldCheck className='size-10 text-cyan-500' />,
  },
  {
    id: 6,
    title: 'Mortgage Summary',
    description: 'All mortgage details',
    icon: <Landmark className='size-10 text-purple-500' />,
  },
];
