"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowRightIcon, DocsIcon, GroupIcon, BoxIcon } from "@/icons";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Loader } from "../ui/loader/Loader";
import Link from "next/link";
import { toast } from "sonner";

export const DashboardMetrics = () => {
  const { data, error, isLoading } = useDashboardStats();
  if (isLoading) return <Loader />;
  if(error){
    toast.error(error.message);
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Dealers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data?.data.dealerCount}
            </h4>
          </div>
          <Link href="/dealer">
          <Badge color="success">
            View All
            <ArrowRightIcon />
          </Badge>
          </Link>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIcon className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Products
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data?.data.productCount}
            </h4>
          </div>

          <Link href="/product">
            <Badge color="success">
              View All
              <ArrowRightIcon />
            </Badge>
          </Link>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <DocsIcon className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Enquires
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data?.data.enquiryCount}
            </h4>
          </div>

          <Link href="/enquiry">
            <Badge color="success">
              View All
              <ArrowRightIcon />
            </Badge>
          </Link>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Internal Users
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data?.data.internalCount}
            </h4>
          </div>
          <Link href="/internal-user">
          <Badge color="success">
            View All
            <ArrowRightIcon />
          </Badge>
          </Link>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};