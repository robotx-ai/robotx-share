import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import { isRobotxAdminEmail } from "@/lib/robotxAdmin";
import getCurrentUser from "../actions/getCurrentUser";
import getListings from "../actions/getListings";
import PropertiesClient from "./PropertiesClient";

type Props = {};

const PropertiesPage = async (props: Props) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState title="Unauthorized" subtitle="Please login" />
      </ClientOnly>
    );
  }

  if (!isRobotxAdminEmail(currentUser.email)) {
    return (
      <ClientOnly>
        <EmptyState
          title="Admin access required"
          subtitle="Only RobotX admins can manage service publishing."
        />
      </ClientOnly>
    );
  }

  const listings = await getListings({ userId: currentUser.id });

  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No services found"
          subtitle="Looks like you have not published any services."
        />
      </ClientOnly>
    );
  }
  return (
    <ClientOnly>
      <PropertiesClient listings={listings} currentUser={currentUser} />
    </ClientOnly>
  );
};

export default PropertiesPage;
