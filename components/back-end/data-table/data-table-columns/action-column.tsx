'use client';

import { Loader, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@mosespace/toast';
import { deleteUser } from '@/actions/users';

// Types
type SupportedModels = 'employee';

interface ActionColumnProps {
  row: {
    original: {
      name?: string;
      [key: string]: any;
    };
  };
  model: SupportedModels;
  editEndpoint?: string;
  id?: string;
  rawDisplay?: boolean;
}

interface ModelState {
  // category?: Category | null;
  // bus?: Bus[] | null;
  // terminal?: Terminal[] | null;
  // schedule?: Schedule[] | null;
  // route?: Route[] | null;
  // categories?: Category[] | null;
}

const MODEL_DELETE_ACTIONS = {
  // bus: deleteBus,
  // terminal: deleteTerminal,
  // routes: deleteRoute,
  // schedules: deleteSchedule,
  employee: deleteUser,
  // payment: deleteSchedule,
} as const;

export default function ActionColumn({
  row,
  model,
  editEndpoint,
  rawDisplay = false,
  id = '',
}: ActionColumnProps) {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [modelState, setModelState] = useState<ModelState>({
    bus: null,
    terminal: null,
    route: null,
    schedule: null,
  });

  // Utilities
  const capitalizeFirstLetter = useCallback(
    (str: string) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : ''),
    [],
  );

  // Handlers
  const handleDelete = useCallback(async () => {
    if (!id) {
      toast.error('Error', 'No ID provided for deletion');
      return;
    }

    try {
      setIsPending(true);
      const deleteAction = MODEL_DELETE_ACTIONS[model as SupportedModels];

      if (!deleteAction) {
        throw new Error(`Unsupported model type: ${model}`);
      }

      await deleteAction({ id });
      toast.success(
        'Success',
        `${capitalizeFirstLetter(model)} deleted successfully`,
      );
      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(
        'Error',
        `Failed to delete ${model.toLowerCase()}: ${errorMessage}`,
      );
    } finally {
      setIsPending(false);
    }
  }, [model, id, capitalizeFirstLetter]);

  const fetchDataForForm = useCallback(async () => {
    try {
      const [
        // categoryData,
        // campusesData,
        // categoriesData,
        // resourcesData,
        // courseData,
      ] = await Promise.all([
        id ? <></> : <></>,
        // getCategoryById(id) : null,
        // getAllCampuses(),
        // getAllCategories(),
        // getAllResources(),
        // id ? getCourseById(id) : null,
        id ? '' : null,
      ]);

      setModelState({
        // category: categoryData?.data || null,
        // campuses: campusesData?.data || null,
        // categories: categoriesData?.data || null,
        // buses: resourcesData?.data || null,
        // course: courseData?.data ?? undefined,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch data';
      toast.error('Error', `Error loading form data: ${errorMessage}`);
    }
  }, [id]);

  // Memoized Components
  const formContent = useMemo(() => {
    const forms = {
      category: () => (
        <></>
        // <CategoryForm
        //   initialData={modelState.category}
        //   campuses={modelState.campuses as any}
        // />
      ),
      course: () => (
        <></>
        // <CourseForm
        //   categories={modelState.categories}
        //   initialData={modelState.course as any}
        //   campuses={modelState.campuses as any}
        // />
      ),
    };

    return forms[model as keyof typeof forms]?.() || null;
  }, [model, modelState]);

  const EditButton = () =>
    editEndpoint ? (
      <Link href={editEndpoint} className="flex pl-3 pt-1 items-center text-sm">
        <Pencil className="mr-2 h-4 w-4 text-muted-foreground" />
        Edit
      </Link>
    ) : (
      <Dialog onOpenChange={fetchDataForForm}>
        <DialogTrigger asChild>
          <button className="flex pl-3 gap-1 items-center text-sm">
            <Pencil className="m-2 h-4 w-4 text-muted-foreground" />
            Edit
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[750px]">
          <ScrollArea className="h-[600px]">
            <DialogHeader>
              <DialogTitle>{row.original.name}</DialogTitle>
            </DialogHeader>
            {formContent}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );

  return (
    <div>
      {rawDisplay ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem asChild>
              <EditButton />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="text-destructive cursor-pointer text-sm"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Delete {capitalizeFirstLetter(model)} {row.original.name}?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isPending}>
                    Cancel
                  </AlertDialogCancel>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader className="animate-spin mr-2" />
                        Deleting...
                      </>
                    ) : (
                      'Delete'
                    )}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center gap-3">
          <Link href={editEndpoint as string} className="text-sm">
            <Pencil className="w-4 h-4" />
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete {capitalizeFirstLetter(model)}?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isPending}
                >
                  {isPending ? 'Deleting...' : 'Delete'}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}
