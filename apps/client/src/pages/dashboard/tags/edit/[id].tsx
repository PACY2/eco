import api from "@/api";
import { DashboardLayout } from "@/components/layouts";
import DashboardUpdateTagPage from "@/components/pages/dashboard/tags/update";
import { ITag } from "@/interfaces/Tag";
import { AuthGetServerSidePropsContext, IUser } from "@/interfaces/User";
import { withAuth } from "@/middlewares";

interface EditProps {
  user: IUser;
  tag: ITag;
}

export default function Edit({ user, tag }: EditProps) {
  return (
    <DashboardLayout
      user={user}
      title="Update Tag"
      description="You can update certain tags just from here."
    >
      <DashboardUpdateTagPage tag={tag} />
    </DashboardLayout>
  );
}

export const getServerSideProps = withAuth(
  async (ctx: AuthGetServerSidePropsContext) => {
    try {
      const response = await api({
        url: `/tags/${ctx.params?.id}`,
      });

      return {
        props: {
          tag: response.data,
          user: ctx.auth,
        },
      };
    } catch (err) {
      return {
        redirect: {
          destination: "/404",
          permanent: true,
        },
      };
    }
  }
);
