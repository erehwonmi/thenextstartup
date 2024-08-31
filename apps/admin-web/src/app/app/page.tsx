'use client';

import { useState } from 'react';
import { useFetchCustomers } from '@admin-web/core/api/customers';
import { UpdateCustomer, UpdateCustomerSchema } from '@admin-web/core/schemas';
import { CustomerProfiles, customerProfileStatusEnum } from '@db/schema';
import { useDebouncedCallback } from 'use-debounce';
import { zodResolver } from '@hookform/resolvers/zod';
import { ColumnDef } from '@tanstack/react-table';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
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
import { useUpdateCustomer } from '@admin-web/core/api/customers/use-update-customer';
import { useBanCustomers } from '@admin-web/core/api/customers/use-ban-customers';

const LOCALDATE_OPTS: DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
};

const searchKeys = ['stripeId', 'id', 'email'];

type SearchKeyEnum = 'stripeId' | 'id' | 'email';
type CustomerWithEmail = Omit<CustomerProfiles & { email: string }, 'password'>;

export default function Customers() {
  const queryClient = useQueryClient();

  const { toast } = useToast();
  const { limit, onPaginationChange, skip, pagination } = usePagination();
  const [searchKey, setSearchKey] = useState<SearchKeyEnum>('email');
  const [searchInput, setSearchInput] = useState<string>('');
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchInput(value);
  }, 1000);
  const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({});
  const selectedRows = Object.keys(rowSelection);
  const selectedRowsLength = selectedRows.length;

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] =
    useState<CustomerWithEmail | null>(null);
  const variables = { skip, limit, qk: searchKey, q: searchInput };
  const { data: response, isLoading } = useFetchCustomers({
    variables,
  });

  const form = useForm<UpdateCustomer>({
    resolver: zodResolver(UpdateCustomerSchema),
  });

  const { mutate: updateCustomer, isPending } = useUpdateCustomer();
  const { mutate: banCustomers, isPending: isBanPending } = useBanCustomers();

  const customerList = response?.data.list ?? [];
  const pageCount = response?.data.pageCount ?? 0;

  const onSubmit = (values: UpdateCustomer) => {
    updateCustomer(values, {
      onSuccess: (result) => {
        form.reset();

        const key = [useFetchCustomers.getKey()[0], variables];

        queryClient.setQueryData(key, (old: typeof response) => {
          const updatedCustomers = old?.data.list.map((customer) =>
            customer.id === values.id ? { ...customer, ...values } : customer
          );

          const newData = { ...old?.data, list: updatedCustomers };
          return {
            ...old,
            data: newData,
          };
        });

        toast({
          title: 'Updated Customer',
          description: result.message,
        });

        setIsSheetOpen(false);
      },
      onError: (result) => {
        toast({
          variant: 'destructive',
          title: 'Update Customer failed?',
          description: result.response?.data?.message,
        });
      },
    });
  };

  const onBanCustomers = () => {
    const bannedUserIds: string[] = [];

    selectedRows.forEach((_idx) => {
      const idx = parseInt(_idx);
      const userId = customerList[idx].userId as string;
      bannedUserIds.push(userId);
    });

    banCustomers(
      { userIds: bannedUserIds },
      {
        onSuccess: (result) => {
          const key = [useFetchCustomers.getKey()[0], variables];

          queryClient.setQueryData(key, (old: typeof response) => {
            const updatedCustomers = old?.data.list.map((customer, idx) =>
              rowSelection[idx]
                ? { ...customer, accountStatus: 'disabled' }
                : customer
            );

            const newData = { ...old?.data, list: updatedCustomers };
            return {
              ...old,
              data: newData,
            };
          });

          toast({
            title: 'Banned customers',
            description: result.message,
          });
        },
        onError: (result) => {
          toast({
            variant: 'destructive',
            title: 'Ban customers failed?',
            description: result.response?.data?.message,
          });
        },
      }
    );
  };

  const columns: ColumnDef<CustomerWithEmail>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => {
        
        return (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
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
      accessorKey: 'accountStatus',
      header: 'Account Status',
      cell: ({ row }) => {
        const customer = row.original;
        return <p className="capitalize">{customer.accountStatus}</p>;
      },
      meta: {
        headerClassName: 'hidden md:table-cell',
        cellClassName: 'hidden md:table-cell',
      },
    },
    {
      accessorKey: 'subscriptionTier',
      header: 'Tier',
      cell: ({ row }) => {
        const customer = row.original;
        return <p className="capitalize">{customer.subscriptionTier}</p>;
      },
      meta: {
        headerClassName: 'hidden md:table-cell',
        cellClassName: 'hidden md:table-cell',
      },
    },
    {
      accessorKey: 'stripeId',
      header: 'Stripe ID',
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
        const customer = row.original;

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
                  form.setValue('id', customer.id);
                  form.setValue('accountStatus', customer.accountStatus);
                  setCurrentCustomer(customer);
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
    currentCustomer &&
    new Date(currentCustomer.createdAt).toLocaleDateString(
      'en-US',
      LOCALDATE_OPTS
    );

  const updatedAt =
    currentCustomer && currentCustomer.updatedAt
      ? new Date(currentCustomer.updatedAt).toLocaleDateString(
          'en-US',
          LOCALDATE_OPTS
        )
      : 'None';

  const lastActiveAt =
    currentCustomer &&
    new Date(currentCustomer.lastActiveAt).toLocaleDateString(
      'en-US',
      LOCALDATE_OPTS
    );

  return (
    <>
      {currentCustomer && (
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
                    <p className="text-sm">{currentCustomer.userId}</p>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <p className="text-sm">{currentCustomer.email}</p>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="accountType" className="text-right">
                      Account Type
                    </Label>
                    <p className="text-sm capitalize">
                      {currentCustomer.accountType}
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="accountStatus"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">
                          Account Status
                        </FormLabel>
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
                            {customerProfileStatusEnum.map((status) => (
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
                    <Label htmlFor="subscriptionStatus" className="text-right">
                      Subscription Status
                    </Label>
                    <p className="text-sm capitalize col-span-3">
                      {currentCustomer.subscriptionStatus || 'None'}
                    </p>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="stripeId" className="text-right">
                      Stripe ID
                    </Label>
                    <p className="text-sm col-span-3">
                      {currentCustomer.stripeId || 'None'}
                    </p>
                  </div>
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
            <CardTitle>Customers</CardTitle>
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
                className={`${selectedRowsLength > 0 ? 'w-3/5' : 'w-full'}`}
                defaultValue={searchInput}
                onChange={(e) => debouncedSearch(e.target.value)}
              />
              {selectedRowsLength > 0 && (
                <LoadingButton
                  isLoading={isBanPending}
                  className="w-1/5"
                  onClick={onBanCustomers}
                >{`Ban ${selectedRowsLength} customers`}</LoadingButton>
              )}
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
                data={customerList}
                pagination={pagination}
                onPaginationChange={onPaginationChange}
                pageCount={pageCount}
                onRowSelectionChange={setRowSelection}
                rowSelection={rowSelection}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
