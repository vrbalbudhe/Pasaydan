"use client";
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { parseISO, isWithinInterval, eachDayOfInterval } from "date-fns";
import SkeletonTab from "../skeletonTab";
import { TbInfoSquareRounded } from "react-icons/tb";
import { BsCalendar2Event } from "react-icons/bs";
import { Button } from "../ui/button";

// Define the product type
type Product = {
  id: string;
  title: string;
  location: string;
  startDate: string;
  EndDate: string;
  status: "pending" | "approved";
  dtype: "blood" | "food" | "clothes" | "blanket" | "cycle";
};

export default function CalendarComponent() {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date()
  );
  const [products, setProducts] = React.useState<Product[] | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchDrives = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/drive`);
        if (!response.ok) throw new Error("Failed to fetch drives");
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching drives");
      } finally {
        setLoading(false);
      }
    };

    fetchDrives();
  }, []);

  const modifiers = React.useMemo(() => {
    if (!products) return {};

    const dateModifiers: Record<string, Date[]> = {};

    products.forEach((product) => {
      const startDate = parseISO(product.startDate);
      const endDate = parseISO(product.EndDate);

      eachDayOfInterval({ start: startDate, end: endDate }).forEach((date) => {
        const key =
          product.dtype.toLowerCase() as keyof typeof modifiersClassNames;
        if (!dateModifiers[key]) dateModifiers[key] = [];
        dateModifiers[key].push(date);
      });
    });

    return dateModifiers;
  }, [products]);

  const modifiersClassNames = {
    blood:
      "bg-red-500 text-white text-red-800 border border-red-600 rounded-full",
    cycle: "bg-green-500 text-white border-2 border-green-600 text-green-800",
    blanket: "bg-blue-500 border-2 text-white border-blue-600 text-blue-800 ",
    food: "bg-orange-400 text-blue-800 rounded-full",
    default: "bg-gray-200 text-gray-800 rounded-full",
  };

  return (
    <div className="w-full">
      {loading ? (
        <div className="text-center text-gray-500 flex flex-wrap justify-start items-center gap-5 mb-10 w-full">
          <SkeletonTab />
          <SkeletonTab />
          <SkeletonTab />
          <SkeletonTab />
        </div>
      ) : error ? (
        <div className="text-center flex flex-wrap justify-start items-center gap-5 mb-10 w-full text-red-500">
          <SkeletonTab />
          <SkeletonTab />
          <SkeletonTab />
          <SkeletonTab />
        </div>
      ) : (
        <div className="w-full h-full">
          <div className="w-full h-full flex flex-col justify-start items-start gap-1">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border-2 shadow-sm flex justify-center items-center w-full"
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
            />
            <div className="w-full rounded-md py-1 border-2 h-full flex justify-center items-start gap-2">
              <p className=" px-2 text-black -tracking-tight text-sm rounded-md py-1 ">
                <span className="bg-green-400 px-2 py-0.2 mr-1 rounded-full"></span>
                Cycle
              </p>
              <p className=" px-2 text-black -tracking-tight text-sm rounded-md py-1 ">
                <span className="bg-red-400 px-2 py-0.2 mr-1 rounded-full"></span>
                Blood
              </p>
              <p className=" px-2 text-black -tracking-tight text-sm rounded-md py-1 ">
                <span className="bg-blue-400 px-2 py-0.2 mr-1 rounded-full"></span>
                Blanket
              </p>
              <p className=" px-2 text-black -tracking-tight text-sm rounded-md py-1 ">
                <span className="bg-orange-400 px-2 py-0.2 mr-1 rounded-full"></span>
                Food
              </p>
            </div>
          </div>
          <div className="mt-4">
            <h1 className="p-2 text-3xl mb-2 md:text-sm flex justify-start items-center gap-1 text-slate-800">
              <span className="text-slate-900 text-xl -tracking-tight">
                <BsCalendar2Event />
              </span>
              Upcoming Drives
            </h1>
            {products
              ?.filter((product) => product.status === "pending")
              .map((product) => (
                <div
                  key={product.id}
                  className={`p-4 mb-2 border-2 rounded-md flex justify-between items-center `}
                >
                  <div className="">
                    <h3 className="text-xl text-slate-800 font-semibold">
                      {product.title}
                    </h3>
                    <p className="text-xs text-slate-600 -tracking-tight">
                      {product.location}
                    </p>
                    <p className="text-xs mt-2">
                      {product.startDate} <span className="text-black">-</span>{" "}
                      {product.EndDate}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}