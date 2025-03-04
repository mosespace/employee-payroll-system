import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { ClockCard } from '@/components/back-end/clock-card';

export default async function PayrollDashboard() {
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role;
  const userId = session?.user?.id;
  // console.log(`User Role:`, session?.user);

  if (userRole === 'ADMIN' || userRole === 'MANAGER') {
    return (
      <div className="flex-1 p-8">
        <span>Admin Dashboard</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Welcome {session?.user.name}{' '}
        <span className="text-5xl animate-bounce">👋</span>
      </h1>
      <ClockCard userId={userId as string} />
    </div>
  );
}
