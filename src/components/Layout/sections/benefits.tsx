import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Icon } from "@/components/ui/icon";
import { Blocks, icons, LineChart, Sparkle, Wallet } from "lucide-react";

interface BenefitsProps {
  icon: string | JSX.Element;
  title: string;
  description: string;
}

const benefitList: BenefitsProps[] = [
  {
    icon: <Blocks/>,
    title: "مدیریت آسان",
    description:
      "با استفاده از ابزارهای ما، می‌توانید به راحتی و به سرعت منوهای خود را مدیریت کنید.",
  },
  {
    icon: <LineChart />,
    title: "طراحی خاص",
    description:
      "با طراحی منوهای خاص و جذاب، می‌توانید تجربه کاربری بهتری را برای مشتریان خود فراهم کنید.",
  },
  {
    icon: <Wallet />,
    title: "افزایش فروش",
    description:
      "با استفاده از ابزارهای ما، می‌توانید به راحتی و به سرعت فروش و سود خود را افزایش دهید.",
  },
  {
    icon: <Sparkle />,
    title: "ارتباط با مشتریان",
    description:
      "با استفاده از ابزارهای ما، می‌توانید به راحتی و به سرعت با مشتریان خود ارتباط برقرار کنید.",
  },
];

export const BenefitsSection = () => {
  return (
    <section id="benefits" className="container py-24 sm:py-32">
      <div
        className="grid lg:grid-cols-2 place-items-center lg:gap-24"
        dir="rtl"
      >
        <div>
          <h2 className="text-lg text-primary mb-2 tracking-wider">مزیت ها</h2>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            میان‌بر موفقیت شما
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            سادگی، سرعت و کارایی را در طراحی منوهای خود تجربه کنید. با ابزارهای
            ما، می‌توانید به راحتی منوهای جذاب و کاربرپسند ایجاد کنید که مشتریان
            شما را جذب کند.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 w-full">
          {benefitList.map(({ icon, title, description }, index) => {
            return (
              <div
                key={title}
                className="bg-muted/50 dark:bg-card hover:bg-background transition-all delay-75  flex flex-col w-full rounded-lg border"
              >
                <CardHeader>
                  <div className="flex justify-between w-full">
                
                  <span>{icon}</span>

                    <span className="text-5xl text-muted-foreground/15 hover:text-primary font-medium transition-all delay-75 group-hover/number:text-muted-foreground/30">
                      0{index + 1}
                    </span>
                  </div>

                  <CardTitle>{title}</CardTitle>
                </CardHeader>

                <CardContent className="text-muted-foreground">
                  {description}
                </CardContent>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
