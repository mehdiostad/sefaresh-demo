"use client";
import { imageUrl } from "@/demo/seed";
import { ItemProps } from "@/components/Menu/Menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { useDashboardData } from "@/stores/useDashboardData";
import separate from "@/utils/number";
import Image from "next/image";
import React from "react";

// const popularContent = [
//   {
//     id: 1,
//     title: "JavaScript Tutorial",
//     badge: "Coding",
//     image:
//       "https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=800",
//     count: 4300,
//   },
//   {
//     id: 2,
//     title: "Tech Trends 2025",
//     badge: "Tech",
//     image:
//       "https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=800",
//     count: 3200,
//   },
//   {
//     id: 3,
//     title: "The Future of AI",
//     badge: "AI",
//     image:
//       "https://images.pexels.com/photos/2007647/pexels-photo-2007647.jpeg?auto=compress&cs=tinysrgb&w=800",
//     count: 2400,
//   },
//   {
//     id: 4,
//     title: "React Hooks Explained",
//     badge: "Coding",
//     image:
//       "https://images.pexels.com/photos/943096/pexels-photo-943096.jpeg?auto=compress&cs=tinysrgb&w=800",
//     count: 1500,
//   },
//   {
//     id: 5,
//     title: "Image Generation with AI",
//     badge: "AI",
//     image:
//       "https://images.pexels.com/photos/3094799/pexels-photo-3094799.jpeg?auto=compress&cs=tinysrgb&w=800",
//     count: 1200,
//   },
// ];

// const latestTransactions = [
//   {
//     id: 1,
//     title: "Subscription Renewal",
//     badge: "John Doe",
//     image:
//       "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=800",
//     count: 1400,
//   },
//   {
//     id: 2,
//     title: "Payment for Services",
//     badge: "Jane Smith",
//     image:
//       "https://images.pexels.com/photos/4969918/pexels-photo-4969918.jpeg?auto=compress&cs=tinysrgb&w=800",
//     count: 2100,
//   },
//   {
//     id: 3,
//     title: "Subscription Renewal",
//     badge: "Michael Johnson",
//     image:
//       "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=800",
//     count: 1300,
//   },
//   {
//     id: 4,
//     title: "Payment for Services",
//     badge: "Lily Adams",
//     image:
//       "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=800",
//     count: 2500,
//   },
//   {
//     id: 5,
//     title: "Subscription Renewal",
//     badge: "Sam Brown",
//     image:
//       "https://images.pexels.com/photos/1680175/pexels-photo-1680175.jpeg?auto=compress&cs=tinysrgb&w=800",
//     count: 1400,
//   },
// ];
type List = "همه صفحات شما" | "همه آیتم های شما";
const CardList = ({ title }: { title: List }) => {
  const fullMenu = useDashboardData((s) => s.fullMenu);
  const userItems = fullMenu
    .map((categories) => {
      return categories?.items || [];
    })
    .flat() as any;
  const userCategories = fullMenu.map((cat, i) => ({
    _id: cat._id,
    itemName: cat.title,
    price: `میانگین قیمت:  ${(cat?.items?.length > 0
      ? cat.items
          ?.map((i) => i?.price)
          .reduce((acc, current) => acc + current, 0) / cat?.items?.length
      : 0
    ).toFixed(0)}`,
    desc: `شماره صفحه : ${i + 1}`,
    img: cat.logo || undefined,
  }));
  const items = title === "همه صفحات شما" ? userCategories : userItems;
  return (
    <div>
      <h1 className="flex justify-center items-center font-medium  sticky top-0 bg-card-foreground/70 text-card text-sm  py-4 px-2 backdrop-blur-lg  rounded-lg z-20 ">
        {title}
      </h1>
      <div className=" flex flex-col gap-4 z-10 p-2">
        {items.length > 0
          ? items?.map((item: any) => (
              <Card
                className="flex-row items-center justify-between gap-4 p-4"
                key={item?._id}
              >
                {item?.img && (
                  <div className="w-12 h-12 rounded-sm relative overflow-hidden">
                    <Image
                      fill
                      src={
                        imageUrl(item?.img, "items")
                      }
                      alt={item?.itemName}
                      className="object-cover"
                    />
                  </div>
                )}
                <CardContent className="flex-1 p-0">
                  <CardTitle className="text-sm font-medium">
                    {item?.itemName}
                  </CardTitle>
                  {item?.description && (
                    <Badge variant="secondary" className="font-medium">
                      {item?.description}
                    </Badge>
                  )}
                </CardContent>
                <CardFooter className="p-0 truncate">
                  {separate(item?.price)}
                </CardFooter>
              </Card>
            ))
          : null}
      </div>
    </div>
  );
};

export default CardList;
