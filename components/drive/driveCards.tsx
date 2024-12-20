"use client";
import * as React from "react";
import { GoLocation } from "react-icons/go";
import { BiDonateHeart } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import { MdOutlineAccessTime } from "react-icons/md";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SkeletonBox from "../skeleton";
import Link from "next/link";

export function DriveCards() {
  const [error, setError] = React.useState<string | null>(null);
  const [products, setProducts] = React.useState<any[] | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [readMore, setReadMore] = React.useState<{ [key: number]: boolean }>(
    {}
  );

  React.useEffect(() => {
    const fetchDrives = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/drive`);
        if (!response.ok) throw new Error("Failed to fetch drives");
        const data = await response.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching drives");
      } finally {
        setLoading(false);
      }
    };

    fetchDrives();
  }, []);

  const toggleReadMore = (index: number) => {
    setReadMore((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="w-full flex flex-wrap justify-start gap-4 items-start py-4">
      {loading ? (
        <div className="w-full flex flex-wrap justify-start items-center gap-5 mb-10 text-center text-slate-200">
          <SkeletonBox />
          <SkeletonBox />
          <SkeletonBox />
        </div>
      ) : error ? (
        <div className="w-full flex flex-wrap justify-start items-center gap-5 mb-10 text-center text-red-500">
          <SkeletonBox />
          <SkeletonBox />
          <SkeletonBox />
        </div>
      ) : products?.length === 0 ? (
        <div className="w-full text-center text-slate-300">No Drives Found</div>
      ) : (
        products?.map((product, index) => (
          <Card key={index} className="md:w-[450px] bg-[#001524] rounded-lg">
            <CardHeader className="h-30">
              <CardTitle className="h-20 font-normal text-2xl text-white">
                {product?.title}
              </CardTitle>
              <CardDescription className="text-sm text-slate-300">
                <div className="flex gap-5">
                  <span>{product?.timeInterval}</span>
                  <div className="text-slate-600 flex font-semibold gap-2 items-center">
                    <MdOutlineAccessTime className="text-white text-lg" />
                    {product?.startDate} - {product?.EndDate}
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-md text-zinc-400">
                {readMore[index]
                  ? product?.description
                  : product?.description.slice(0, 100)}
                {product?.description.length > 100 && (
                  <span
                    className="text-blue-500 text-sm ml-1 hover:text-blue-400 cursor-pointer"
                    onClick={() => toggleReadMore(index)}
                  >
                    {readMore[index] ? "Show Less" : "Read More"}
                  </span>
                )}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Link href={`drive/${product.id}`}>
                <Button className="bg-white text-black hover:bg-gray-200">
                  <GoLocation />
                  {product?.location}
                </Button>
              </Link>
              <div className="text-white flex items-center gap-1">
                <BiDonateHeart />
                <p className="text-sm">{product?.dtype} Donations</p>
              </div>
              <div className="text-sm text-slate-300">
                {product?.status === "pending" ? (
                  <p className="w-2 h-2 bg-green-400 rounded-full"></p>
                ) : (
                  <p className="w-2 h-2 bg-yellow-400 rounded-full"></p>
                )}
              </div>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
}
