"use client";

import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Eye, EyeClosed, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email("ایمیل معتبر وارد کنید").toLowerCase(),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

type FormData = z.infer<typeof schema>;

const LoginForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    const res = await signIn("admin-login", {
      email: data.email,
      password: data.password,
      redirect: false,
      callbackUrl: "/dashboard",
    });
    if (res?.error) {
      toast({
        title: "ایمیل یا رمز عبور به درستی وارد نشده است",
        variant: "destructive",
      });
    } else {
      toast({
        title: "با موفقیت وارد شدید",
        color: "green",
      });
      router.push("/dashboard");
    }
  };
  const [isPassVisible, setIsPassVisible] = useState(false);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ایمیل</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  dir="ltr"
                  placeholder="example@email.com"
                  {...field}
                  className="border-0 border-b border-white/10 placeholder:text-white/50 rounded-none focus:outline-none focus:border-b-yellow-600 focus:shadow-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>رمز عبور</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <Input
                    type={isPassVisible ? "text" : "password"}
                    placeholder="******"
                    dir="ltr"
                    {...field}
                    className="border-0 border-b border-white/10 placeholder:text-white/50 rounded-none focus:outline-none focus:border-b-yellow-600 focus:shadow-none"
                  />
                  <Button
                    variant={"ghost"}
                    type="button"
                    onClick={() => setIsPassVisible((prev) => !prev)}
                  >
                    {isPassVisible ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
          variant={"secondary"}
        >
          {form.formState.isSubmitting ? "در حال ورود..." : "ورود"}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
