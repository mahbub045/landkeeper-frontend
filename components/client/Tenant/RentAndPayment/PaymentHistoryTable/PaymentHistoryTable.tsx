// "use client";

// import { Download, Receipt } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { PaymentStatus } from '@/types/client/Tenant/TenantTypes';
// import { STATUS_CONFIG } from '@/data/client/Tenant/RentAndPaymentDashboardData/RentAndPaymentDashboardData';
// import { Badge } from '@/components/ui/badge';
// import { cn } from '@/lib/utils';


// function formatCurrency(amount: number) {
//   return new Intl.NumberFormat("en-GB", {
//     style: "currency",
//     currency: "GBP",
//   }).format(amount);
// }

// function formatDate(dateString: string) {
//   return new Intl.DateTimeFormat("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   }).format(new Date(dateString));
// }

// function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
//   const config = STATUS_CONFIG[status];
//   const Icon = config.icon;
 
//   return (
//     <Badge variant="outline" className={cn("gap-1 font-normal", config.className)}>
//       <Icon className={cn("h-3.5 w-3.5", status === "processing" && "animate-spin")} />
//       {config.label}
//     </Badge>
//   );
// }

// interface PaymentHistoryTableProps {
//   payments: PaymentRecord[];
//   onDownloadReceipt: (payment: PaymentRecord) => void;
// }

// export function PaymentHistoryTable({
//   payments,
//   onDownloadReceipt,
// }: PaymentHistoryTableProps) {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Receipt className="h-5 w-5 text-primary" />
//           Payment History & Receipts
//         </CardTitle>
//         <CardDescription>A record of your past rent payments.</CardDescription>
//       </CardHeader>
//       <CardContent>
//         {payments.length === 0 ? (
//           <p className="py-8 text-center text-sm text-muted-foreground">
//             No payments have been recorded yet.
//           </p>
//         ) : (
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Date</TableHead>
//                 <TableHead>Reference</TableHead>
//                 <TableHead>Amount</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead className="text-right">Action</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {payments.map((payment) => (
//                 <TableRow key={payment.id}>
//                   <TableCell>{formatDate(payment.date)}</TableCell>
//                   <TableCell>{payment.reference}</TableCell>
//                   <TableCell>{formatCurrency(payment.amount)}</TableCell>
//                   <TableCell>
//                     <PaymentStatusBadge status={payment.status} />
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       disabled={!payment.receiptUrl}
//                       onClick={() => onDownloadReceipt(payment)}
//                     >
//                       <Download className="h-4 w-4" />
//                       Receipt
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         )}
//       </CardContent>
//     </Card>
//   );
// }