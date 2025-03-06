import { Loader } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface IProps {
  title?: string;
  className?: string;
  loadingTitle?: string;
  loading?: boolean | undefined;
  cancelButton?: boolean | undefined;
}
export default function Submit({
  loading,
  title = 'Save Changes',
  loadingTitle = 'Updating changes...',
  cancelButton = true,
  className,
}: IProps) {
  return (
    <div className="flex w-full justify-end gap-4">
      {cancelButton && (
        <Button className={cn(className)} type="button" variant="outline">
          Cancel
        </Button>
      )}
      <Button className={cn(className)} disabled={loading} type="submit">
        {loading ? (
          <span className="items-center inline-flex gap-1">
            <Loader className="animate-spin size-4" /> {loadingTitle}
          </span>
        ) : (
          <span>{title}</span>
        )}
      </Button>
    </div>
  );
}
