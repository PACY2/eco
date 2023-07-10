import { GetServerSideProps } from "next";
import Head from "next/head";
import { DashboardLayout } from "@/components/layouts";
import { withAuth } from "@/middlewares";
import { IUser } from "@/interfaces/User";
import DashboardOrdersPage from "@/components/pages/dashboard/orders/index";

interface OrdersProps {
  user: IUser;
}

export default function Orders({ user }: OrdersProps) {
  return (
    <>
      <Head>
        <title>Orders</title>
      </Head>
      <DashboardLayout
        user={user}
        title="Orders"
        description="You can manage your orders from here."
      >
        <DashboardOrdersPage />
      </DashboardLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth();
