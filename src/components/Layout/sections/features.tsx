import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Icon } from "@/components/ui/icon";
import {
  Blocks,
  icons,
  LineChart,
  Sparkle,
  TabletSmartphone,
  Wallet,
} from "lucide-react";

interface FeaturesProps {
  icon: string | JSX.Element;
  title: string;
  description: string;
}

const featureList: FeaturesProps[] = [
  {
    icon: <Blocks />,
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
  // {
  //   icon: <Sparkle />,

  //   description:

  // },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        امکانات
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        چه چیزی ما را منحصر به فرد میکند؟
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        با استفاده از پلتفرم ما، نه تنها منوی آنلاین دریافت میکنید، بلکه ابزار
        هایی در اختیار شما قرار داده میشود تا بتوانید مشتری های بیشتری را به خود
        جذب کنید.
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" dir="rtl">
        {featureList.map(({ icon, title, description }) => (
          <div key={title}>
            <Card className=" flex justify-between h-full bg-background border-0 shadow-none">
              <CardHeader className="flex justify-center items-center">
                <div className="bg-primary/20 p-2 rounded-full ring-8 ring-primary/10 mb-4">
                  {icon}
                </div>

                <CardTitle className="leading-loose">{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground ">
                {description}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
};
