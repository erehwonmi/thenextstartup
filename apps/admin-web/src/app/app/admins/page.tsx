'use client';

import { useState } from 'react';
import { UpdateAdmin, UpdateAdminSchema } from '@admin-web/core/schemas';
import { AdminProfiles, adminProfilesTypesEnum } from '@db/schema';
import { useDebouncedCallback } from 'use-debounce';
import { zodResolver } from '@hookform/resolvers/zod';
import { ColumnDef } from '@tanstack/react-table';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
  LoadingButton,
  LoadingSpinner,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  usePagination,
  useToast,
} from '@ts/uikit';
import { MoreHorizontal } from 'lucide-react';
import { DateTimeFormatOptions } from 'next-intl';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { useFetchAdmins, useUpdateAdmin } from '@admin-web/core/api/admins';
import { useSession } from '@admin-web/core/contexts/session';

const LOCALDATE_OPTS: DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
};

const searchKeys = ['id', 'email'];

type SearchKeyEnum = 'id' | 'email';
type AdminWithEmail = Omit<AdminProfiles & { email: string }, 'password'>;

export default function Admins() {
  const session = useSession();
  const isSuperAdmin =
    session && session.adminProfiles.adminType === 'superadmin';

  const queryClient = useQueryClient();

  const { toast } = useToast();
  const { limit, onPaginationChange, skip, pagination } = usePagination();
  const [searchKey, setSearchKey] = useState<SearchKeyEnum>('email');
  const [searchInput, setSearchInput] = useState<string>('');

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchInput(value);
  }, 1000);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<AdminWithEmail | null>(null);

  const variables = { skip, limit, qk: searchKey, q: searchInput };
  const { data: response, isLoading } = useFetchAdmins({
    variables,
  });

  const form = useForm<UpdateAdmin>({
    resolver: zodResolver(UpdateAdminSchema),
  });

  const { mutate: updateAdmin, isPending } = useUpdateAdmin();

  const adminList = response?.data.list ?? [];
  const pageCount = response?.data.pageCount ?? 0;

  const onSubmit = (values: UpdateAdmin) => {
    updateAdmin(values, {
      onSuccess: (result) => {
        form.reset();

        const key = [useFetchAdmins.getKey()[0], variables];

        queryClient.setQueryData(key, (old: typeof response) => {
          const updatedAdmins = old?.data.list.map((admin) =>
            admin.id === values.id ? { ...admin, ...values } : admin
          );

          const newData = { ...old?.data, list: updatedAdmins };
          return {
            ...old,
            data: newData,
          };
        });

        toast({
          title: 'Updated Admin',
          description: result.message,
        });

        setIsSheetOpen(false);
      },
      onError: (result) => {
        toast({
          variant: 'destructive',
          title: 'Update Admin failed?',
          description: result.response?.data?.message,
        });
      },
    });
  };

  const columns: ColumnDef<AdminWithEmail>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'userId',
      header: 'User ID',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'adminType',
      header: 'Admin Type',
      cell: ({ row }) => {
        const admin = row.original;
        return <p className="capitalize">{admin.adminType}</p>;
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
        const customer = row.original;
        const date = new Date(customer.createdAt).toLocaleDateString(
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
      id: 'actions',
      header: () => <div className="sr-only">Actions</div>,
      cell: ({ row }) => {
        const admin = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Button
                variant="ghost"
                onClick={() => {
                  form.setValue('id', admin.id);
                  form.setValue('adminType', admin.adminType);
                  setCurrentAdmin(admin);
                  setIsSheetOpen(true);
                }}
              >
                Show Full Information
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const createdAt =
    currentAdmin &&
    new Date(currentAdmin.createdAt).toLocaleDateString(
      'en-US',
      LOCALDATE_OPTS
    );

  const updatedAt =
    currentAdmin && currentAdmin.updatedAt
      ? new Date(currentAdmin.updatedAt).toLocaleDateString(
          'en-US',
          LOCALDATE_OPTS
        )
      : 'None';

  const lastActiveAt =
    currentAdmin &&
    new Date(currentAdmin.lastActiveAt).toLocaleDateString(
      'en-US',
      LOCALDATE_OPTS
    );

  return (
    <>
      {currentAdmin && (
        <Sheet
          open={isSheetOpen}
          defaultOpen={false}
          onOpenChange={setIsSheetOpen}
        >
          <SheetContent side={'right'}>
            <SheetHeader>
              <SheetTitle>Full Information</SheetTitle>
              <SheetDescription></SheetDescription>
            </SheetHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4 py-4">
                  <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">ID</FormLabel>
                        <p className="text-sm">{field.value}</p>
                      </FormItem>
                    )}
                  ></FormField>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="userId" className="text-right">
                      User ID
                    </Label>
                    <p className="text-sm">{currentAdmin.userId}</p>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <p className="text-sm">{currentAdmin.email}</p>
                  </div>

                  <FormField
                    control={form.control}
                    name="adminType"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Admin Type</FormLabel>
                        <Select
                          defaultValue={field.value}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <FormControl>
                            <SelectTrigger className="capitalize col-span-3">
                              <SelectValue placeholder="Select account status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="capitalize">
                            {adminProfilesTypesEnum.map((status) => (
                              <SelectItem
                                className="capitalize"
                                key={status}
                                value={status}
                              >
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="createdAt" className="text-right">
                      Created At
                    </Label>
                    <p className="text-sm col-span-3">{createdAt}</p>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="updatedAt" className="text-right">
                      Updated At
                    </Label>
                    <p className="text-sm col-span-3">{updatedAt}</p>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lastActiveAt" className="text-right">
                      Last Active At
                    </Label>
                    <p className="text-sm col-span-3">{lastActiveAt}</p>
                  </div>
                </div>

                <SheetFooter>
                  <LoadingButton
                    isLoading={isPending}
                    className="w-full mt-4"
                    type="submit"
                    disabled={!isSuperAdmin}
                  >
                    Save Changes
                  </LoadingButton>
                </SheetFooter>
              </form>
            </Form>
          </SheetContent>
        </Sheet>
      )}

      <div className="w-full flex flex-col">
        <Card>
          <CardHeader>
            <CardTitle>Admins</CardTitle>
            <div className="flex flex-row py-4 gap-4">
              <div className="w-1/5">
                <Select
                  defaultValue={searchKey}
                  onValueChange={(value: SearchKeyEnum) => setSearchKey(value)}
                >
                  <SelectTrigger className="capitalize col-span-3">
                    <SelectValue placeholder="Select search key" />
                  </SelectTrigger>
                  <SelectContent className="capitalize">
                    {searchKeys.map((searchKey) => (
                      <SelectItem
                        className="capitalize"
                        key={searchKey}
                        value={searchKey}
                      >
                        {searchKey}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Input
                className="w-full"
                defaultValue={searchInput}
                onChange={(e) => debouncedSearch(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="w-full flex justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={adminList}
                pagination={pagination}
                onPaginationChange={onPaginationChange}
                pageCount={pageCount}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
