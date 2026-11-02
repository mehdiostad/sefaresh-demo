import { z } from "zod";

export const signUpSchema = z
  .object({
    username: z
      .string()
      .min(3, "نام کاربری باید حداقل ۳ حرف باشد")
      .regex(/^[a-zA-Z0-9_]+$/, "فقط حروف انگلیسی، عدد و آندرلاین مجاز هستند"),
    email: z.string().email({ message: "ایمیل معتبر نیست" }),
    password: z
      .string()
      .min(6, { message: "رمز عبور باید حداقل ۶ کاراکتر باشد" }),
    confirmPassword: z
      .string()
      .min(6, { message: "تکرار رمز الزامی است" }),
    firstname: z.string().min(3, { message: "نام الزامی است." }),
    lastname: z.string().min(3, { message: "نام خانوادگی الزامی است." }),
    phonenumber: z.string().min(3, { message: "شماره همراه الزامی است" }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "رمز عبور و تکرار آن یکسان نیستند",
        path: ["confirmPassword"],
      });
    }
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;
