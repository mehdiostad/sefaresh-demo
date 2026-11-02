"use client";

import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import NewMenuForm from "../Form/NewMenuForm";
import { useDashboardData } from "@/stores/useDashboardData";

const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters!" })
    .max(50),
  email: z.string().email({ message: "Invalid email address!" }),
  phone: z.string().min(10).max(15),
  location: z.string().min(2),
  role: z.enum(["admin", "user"]),
});

const additionalFields = {
  phone: {
    name: "phone",
    formLable: "تلفن همراه",
    type: "tel",
  },
  address: {
    name: "address",
    formLable: "آدرس",
  },
  description: {
    name: "description",
    formLable: "توضیحات",
    textarea: true,
  },
};
const EditUser = ({ id }: { id: string | undefined }) => {
  const user = useDashboardData((s) => s.user);
  return (
    <SheetContent side="left" dir="ltr">
      <SheetHeader>
        <SheetTitle className="mb-4">ویرایش اطلاعات</SheetTitle>
        <SheetDescription asChild>
          {new Date(user?.planExpiresAt || "") < new Date() ? (
            <div dir="rtl">اشتراک شما به اتمام رسیده، لطفا اشتراک جدیدی تهیه کنید.</div>
          ) : (
            <NewMenuForm
              userId={id}
              additionalFields={additionalFields}
              formType="update"
            />
          )}
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  );
};

export default EditUser;
