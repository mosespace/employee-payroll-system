import { Loader } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';

interface IProps {
  loading?: boolean | undefined;
}
export default function Submit({ loading }: IProps) {
  return (
    <div className="flex justify-end gap-4">
      <Button type="button" variant="outline">
        Cancel
      </Button>
      <Button disabled={loading} type="submit">
        {loading ? (
          <span className="items-center inline-flex gap-1">
            <Loader className="animate-spin size-4" /> Updating changes...
          </span>
        ) : (
          <span>Save Changes</span>
        )}
      </Button>
    </div>
  );
}
