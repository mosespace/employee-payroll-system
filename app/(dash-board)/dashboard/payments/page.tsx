import { PaymentStats } from '@/components/back-end/payment-stats';
import { PaymentHistory } from '@/components/back-end/payment-history';

// In a real app, this would come from your auth session
const MOCK_USER_ID = '1';

export default function PaymentsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Payments</h1>
      <p className="text-muted-foreground mb-8">
        View and track your payment history
      </p>

      <div className="grid gap-6">
        <PaymentStats userId={MOCK_USER_ID} />
        <PaymentHistory userId={MOCK_USER_ID} />
      </div>
    </div>
  );
}
