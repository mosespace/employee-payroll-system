import { PaymentStats } from '@/components/back-end/payment-stats';
import { PaymentHistory } from '@/components/back-end/payment-history';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function PaymentsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const userId = user?.id;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Payments</h1>
      <p className="text-muted-foreground mb-8">
        View and track your payment history
      </p>

      <div className="grid gap-6">
        <PaymentStats userId={userId as string} />
        <PaymentHistory userId={userId as string} />
      </div>
    </div>
  );
}
