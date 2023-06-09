import { ColumnDef, PaginationState } from "@tanstack/react-table";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DataTable from "@/components/custom/data/table";
import { useDeleteOrder, useGetOrders } from "@/hooks";
import { IItem, IOrder } from "@/interfaces/Order";
import debounce from "@/lib/debounce";

const columns: ColumnDef<IOrder>[] = [
  {
    header: "#",
    accessorKey: "id",
  },
  {
    header: "User",
    cell: ({ row }) => (
      <span>
        {row.original.user.firstName} {row.original.user.lastName}
      </span>
    ),
  },
  {
    header: "Items",
    cell: ({ row }) => <span>{row.original.items.length}</span>,
  },
  {
    header: "Total Items",
    cell: ({ row }) => (
      <span>
        {
          row.original.items.reduce((acc, cur) => {
            return {
              quantity: acc.quantity + cur.quantity,
            } as IItem;
          }).quantity
        }
      </span>
    ),
  },
  {
    header: "Total Profit",
    cell: ({ row }) => (
      <span>
        {row.original.items
          .map((item) => item.quantity * item.price)
          .reduce((acc, cur) => acc + cur)}
      </span>
    ),
  },
  {
    header: "Created At",
    accessorKey: "createdAt",
    cell: ({ row }) => moment(row.original.createdAt).fromNow(),
  },
];

export default function DashboardOrdersPage() {
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageSize: 8,
    pageIndex: 0,
  });

  const { data: orders, refetch } = useGetOrders({
    search,
    page: pagination.pageIndex + 1,
  });

  const { mutate: deleteOrder } = useDeleteOrder();

  // useEffect
  useEffect(() => {
    refetch();
  }, [search, pagination]);

  // handlers
  const changeSearch = debounce((value: string) => {
    setSearch(value);
  });

  const handleSearch = (value: string) => {
    changeSearch(value);
  };

  const handleEdit = (id: number) => {
    router.push(`/dashboard/orders/edit/${id}`);
  };

  const handleDelete = (id: number) =>
    deleteOrder(id, { onSuccess: () => refetch() });

  return (
    <DataTable<IOrder>
      pageCount={orders ? Math.ceil(orders.data.count / orders.data.limit) : 0}
      columns={columns}
      data={orders?.data.data ?? []}
      pagination={pagination}
      setPagination={setPagination}
      handleSearch={handleSearch}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
