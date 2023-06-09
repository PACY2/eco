import { ColumnDef, PaginationState } from "@tanstack/react-table";
import Image from "next/image";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IProduct } from "@/interfaces/Product";
import { useDeleteProduct, useGetProducts } from "@/hooks";
import debounce from "@/lib/debounce";
import DataTable from "@/components/custom/data/table";

const columns: ColumnDef<IProduct>[] = [
  {
    header: "#",
    accessorKey: "id",
  },
  {
    header: "Image",
    cell: ({ row }) => (
      <Image
        className="rounded-md w-16 h-16"
        width="100"
        height="100"
        src={`${process.env.API_STORAGE_URL}/${row.original.images[0]?.path}`}
        alt=""
      />
    ),
  },
  {
    header: "Name",
    cell: ({ row }) => <span>{row.original.name.slice(0, 20)}...</span>,
  },
  {
    header: "Price",
    accessorKey: "price",
  },
  {
    header: "Quantity",
    cell: ({ row }) => (
      <span>
        {row.original.quantity} ({row.original.unit.name})
      </span>
    ),
  },
  {
    header: "Created At",
    accessorKey: "createdAt",
    cell: ({ row }) => moment(row.original.createdAt).fromNow(),
  },
];

export default function DashboardProductsPage() {
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageSize: 8,
    pageIndex: 0,
  });

  const { data: products, refetch } = useGetProducts({
    search,
    page: pagination.pageIndex + 1,
  });

  const { mutate: deleteProduct } = useDeleteProduct();

  useEffect(() => {
    refetch();
  }, [pagination, search]);

  // handlers
  const changeSearch = debounce((value: string) => {
    setSearch(value);
  });

  const handleSearch = (value: string) => {
    changeSearch(value);
  };

  const handleEdit = (id: number) => {
    router.push(`/dashboard/products/edit/${id}`);
  };

  const handleDelete = (id: number) =>
    deleteProduct(id, { onSuccess: () => refetch() });

  return (
    <DataTable<IProduct>
      columns={columns}
      data={products?.data.data ?? []}
      pageCount={
        products ? Math.ceil(products.data.count / products.data.limit) : 0
      }
      pagination={pagination}
      setPagination={setPagination}
      handleSearch={handleSearch}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
