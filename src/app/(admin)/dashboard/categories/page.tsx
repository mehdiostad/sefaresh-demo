import CategoryDialog from "@/components/Dashboard/CategoryDialog";
import { getDemoSession as getServerSession } from "@/demo/server";
import { authOptions } from "@/lib/authOptions";
import CategoryTable from "./(CategoryTable)/CategoryTable";
import { GripVertical, InfoIcon } from "lucide-react";

const PaymentsPage = async () => {
  const session = (await getServerSession(authOptions)).user;
  return (
    <div className="flex flex-col gap-4">
     
      <div className="flex">
        <CategoryDialog username={session?.username} userId={session?.id} />
      </div>
      <div className="flex items-center gap-2">
        <InfoIcon color="yellow"/>
        <span>برای جابجایی دسته بندی ها از</span>
        <GripVertical className="w-4 h-4 text-muted-foreground mb-1" />
        <span> استفاده کنید.</span>
      </div>
      <CategoryTable username={session?.username} />
    </div>
  );
};

export default PaymentsPage;
