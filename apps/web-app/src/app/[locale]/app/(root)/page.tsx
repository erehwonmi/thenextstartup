'use client';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  useToast,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  LoadingButton,
  Textarea,
  DataTable,
  LoadingSpinner,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  CardDescription,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@ts/uikit';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import {
  useCreateTodo,
  useDeleteTodo,
  useEditTodo,
} from '@web-app/core/api/todos';
import {
  CreateTodo,
  CreateTodoSchema,
  EditTodo,
  EditTodoSchema,
} from '@web-app/core/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { ColumnDef } from '@tanstack/react-table';
import { Todos, TodoStatus } from '@db/schema';
import { useFetchTodos } from '@web-app/core/api/todos';
import { DateTimeFormatOptions } from 'next-intl';
import { useQueryClient } from '@tanstack/react-query';

const LOCALDATE_OPTS: DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
};

const TodoFormDialog = ({
  onDialogClose,
  isOpen = false,
  form,
}: {
  onDialogClose: () => void;
  isOpen: boolean;
  form: UseFormReturn<EditTodo & CreateTodo>;
}) => {
  const todo = form.getValues();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: createTodo, isPending: isCreatePending } = useCreateTodo();
  const { mutate: editTodo, isPending: isEditPending } = useEditTodo();

  const isPending = isCreatePending || isEditPending;

  const onSubmit = (values: CreateTodo & EditTodo) => {
    if (!todo.id) {
      createTodo(values, {
        onSuccess: (result) => {
          toast({
            title: 'New Todo',
            description: result.message,
          });

          form.reset();
          queryClient.invalidateQueries({
            queryKey: useFetchTodos.getKey(),
          });
          onDialogClose();
        },
        onError: (result) => {
          toast({
            variant: 'destructive',
            title: 'Create Todo failed?',
            description: result.response?.data?.message,
          });
        },
      });

      return;
    }

    editTodo(values, {
      onSuccess: (result) => {
        toast({
          title: 'Edit Todo',
          description: result.message,
        });

        form.reset();
        queryClient.invalidateQueries({
          queryKey: useFetchTodos.getKey(),
        });
        onDialogClose();
      },
      onError: (result) => {
        toast({
          variant: 'destructive',
          title: 'Edit Todo failed?',
          description: result.response?.data?.message,
        });
      },
    });
  };

  return (
    <Dialog
      modal
      onOpenChange={() => {
        form.reset();
        onDialogClose();
      }}
      open={isOpen}
      defaultOpen={isOpen}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <span>{todo.id ? 'Edit' : 'Create'}</span> Todo
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="Clean dishes"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the todo"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {todo.status && (
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select todo status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="ongoing">Ongoing</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              )}

              <LoadingButton
                isLoading={isPending}
                className="w-full mt-4"
                type="submit"
              >
                Submit
              </LoadingButton>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Home = () => {
  const [todoStatus, setTodoStatus] = useState<TodoStatus | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { data: response, isLoading } = useFetchTodos({
    variables: { status: todoStatus },
  });
  const todoList = response?.data ?? [];
  const [todoItem, setTodoItem] = useState<Pick<
    Todos,
    'id' | 'title' | 'description' | 'status'
  > | null>(null);

  const columns: ColumnDef<Todos>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const todo = row.original;
        return <p className="capitalize">{todo.status}</p>;
      },
      meta: {
        headerClassName: 'hidden md:table-cell',
        cellClassName: 'hidden md:table-cell',
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => {
        const todo = row.original;
        const date = new Date(todo.createdAt).toLocaleDateString(
          'en-US',
          LOCALDATE_OPTS
        );
        return <p className="capitalize">{date}</p>;
      },
      meta: {
        headerClassName: 'hidden md:table-cell',
        cellClassName: 'hidden md:table-cell',
      },
    },
    {
      accessorKey: 'updatedAt',
      header: 'Updated At',
      meta: {
        headerClassName: 'hidden md:table-cell',
        cellClassName: 'hidden md:table-cell',
      },
    },
    {
      id: 'actions',
      header: () => <div className="sr-only">Actions</div>,
      cell: ({ row }) => {
        const todo = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setTodoItem({
                    title: todo?.title,
                    description: todo?.description,
                    id: todo?.id,
                    status: todo.status,
                  });
                  setIsDialogOpen(true);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setTodoItem({
                    title: todo?.title,
                    description: todo?.description,
                    id: todo?.id,
                    status: todo.status,
                  });
                  setIsDeleteDialogOpen(true);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: deleteTodo, isPending } = useDeleteTodo();

  const form = useForm<CreateTodo & EditTodo>({
    resolver: zodResolver(todoItem ? EditTodoSchema : CreateTodoSchema),
  });

  useEffect(() => {
    form.reset({
      title: todoItem?.title ?? '',
      description: todoItem?.description ?? '',
      id: todoItem?.id ?? '',
      status: todoItem?.status ?? 'pending',
    });
  }, [form, todoItem]);

  return (
    <>
      <AlertDialog open={isDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              todo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              asChild
              onClick={() => {
                if (!isPending && todoItem) {
                  deleteTodo(
                    { id: todoItem?.id },
                    {
                      onSuccess: (result) => {
                        toast({
                          title: 'Deleted Todo',
                          description: result.message,
                        });
                        queryClient.invalidateQueries({
                          queryKey: useFetchTodos.getKey(),
                        });
                        setIsDeleteDialogOpen(false);
                      },
                      onError: (result) => {
                        toast({
                          variant: 'destructive',
                          title: 'Delete Todo failed?',
                          description: result.response?.data?.message,
                        });
                      },
                    }
                  );
                }
              }}
            >
              <LoadingButton isLoading={isPending}>Delete</LoadingButton>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <TodoFormDialog
        form={form}
        isOpen={isDialogOpen}
        onDialogClose={() => setIsDialogOpen(false)}
      />
      <div className="w-full flex flex-col">
        <div className="grid flex-1 items-start gap-4 xl:p-4 py-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs
            defaultValue="all"
            className="xl:w-full md:w-full sm:w-full w-screen"
            onValueChange={(value) => {
              const v = value === 'all' ? undefined : value;
              setTodoStatus(v as TodoStatus);
            }}
          >
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <Button
                  size="sm"
                  className="h-8 gap-1"
                  onClick={() => {
                    setTodoItem(null);
                    setIsDialogOpen(true);
                  }}
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Todo
                  </span>
                </Button>
              </div>
            </div>
            <TabsContent
              value={!todoStatus ? 'all' : todoStatus}
              className="sm:w-[85vw] xl:w-full md:w-full"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Todos</CardTitle>
                  <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="w-full flex justify-center">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <DataTable columns={columns} data={todoList} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Home;
