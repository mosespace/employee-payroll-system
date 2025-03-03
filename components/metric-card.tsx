import { Card, CardContent } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: string;
  type: string;
  image: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  type,
  image,
}) => {
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
};
