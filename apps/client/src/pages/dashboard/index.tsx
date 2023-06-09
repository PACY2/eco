import { GetServerSideProps } from "next";
import { withAuth } from "@/middlewares";
import { DashboardLayout } from "@/components/layouts";
import { IUser } from "@/interfaces/User";

interface DashboardProps {
  user: IUser;
}

export default function Dashboard({ user }: DashboardProps) {
  return (
    <DashboardLayout
      user={user}
      title="Dashboard"
      description="You can manage your dashboard from here."
    >
      Dashboard
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth();
