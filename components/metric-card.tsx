import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Users, Clock, DollarSign } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  image: string;
  type: 'date' | 'employees' | 'hours' | 'money';
}

const icons = {
  date: Calendar,
  employees: Users,
  hours: Clock,
  money: DollarSign,
};

export function MetricCard({ title, value, image, type }: MetricCardProps) {
  // const Icon = icons[type];

  return (
    <Card>
      <CardContent className="flex flex-col gap-2 pt-6">
        <div className="flex items-center  gap-2">
          <img
            src={image}
            alt={title}
            className="h-1w-14 w-14 text-muted-foreground"
          />
          {/* <Icon className="h-5 w-5 text-muted-foreground" /> */}
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
        <p className="text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}
