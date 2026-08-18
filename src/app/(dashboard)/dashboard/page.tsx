"use client";

import Image from "next/image";
import * as React from "react";
import { Sparkles, TrendingUp, Compass, ShieldCheck } from "lucide-react";

import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Heading from "@/components/ui/heading";
import { useAppSelector } from "@/store/hooks";

function CurationCard(): React.JSX.Element {
  return (
    <Card className="p-0 overflow-hidden relative group border-app-border/40">
      <div className="relative h-64 sm:h-72 w-full">
        <Image
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop"
          alt="Nordic Nocturne Expedition"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge variant="emerald" className="bg-emerald-900/80 text-emerald-200">
            Upcoming Departure
          </Badge>
          <Badge variant="muted" className="bg-black/60 text-white backdrop-blur-md">
            In 3 Days
          </Badge>
        </div>
        <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col gap-1">
          <h3 className="text-2xl font-extrabold tracking-tight font-display-lg">
            The Nordic Nocturne Expedition
          </h3>
          <p className="text-xs text-gray-300 font-medium line-clamp-2">
            An exclusive private super-yacht voyage navigating northern fjords beneath the
            magical aurora borealis.
          </p>
        </div>
      </div>
    </Card>
  );
}

function DashboardHeader({
  userName = "Admin User",
  userRole = "ADMIN",
}: {
  userName?: string | undefined;
  userRole?: string | undefined;
}): React.JSX.Element {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <Heading level={1} size="2xl">
          Welcome back, {userName}.
        </Heading>
        <p className="text-app-muted text-sm font-medium mt-1">
          Your curated portfolio of exclusive experiences and active client itineraries.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="brand" className="px-3 py-1.5 text-xs font-bold gap-1.5">
          <TrendingUp className="w-4 h-4" />
          <span>+12.4% Revenue Growth</span>
        </Badge>
        <Badge variant="emerald" className="px-3 py-1.5 text-xs font-bold gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          <span>{userRole} Verified</span>
        </Badge>
      </div>
    </div>
  );
}

function BookingsValueCard(): React.JSX.Element {
  return (
    <Card className="flex flex-col justify-between gap-6 bg-linear-to-br from-app-surface to-app-surface-variant/50">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-app-muted">
          <span className="text-xs font-bold uppercase tracking-wider font-label-caps">
            Total Bookings Value
          </span>
          <Sparkles className="w-4 h-4 text-app-brand" />
        </div>
        <p className="text-4xl font-extrabold text-app-fg tracking-tight font-display-lg">
          $142,500
        </p>
        <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
          <span>↑</span>
          <span>+$24,000 vs previous month</span>
        </p>
      </div>

      <div className="h-32 w-full flex items-end gap-1.5 pt-4">
        {[40, 25, 55, 35, 70, 60, 90, 80, 100].map((h, idx) => (
          <div
            key={idx}
            className="flex-1 bg-app-surface-variant rounded-t-sm h-full flex items-end"
          >
            <div
              style={{ height: `${String(h)}%` }}
              className="w-full bg-app-brand/80 rounded-t-sm hover:bg-app-brand transition-colors"
            />
          </div>
        ))}
      </div>
    </Card>
  );
}

function ActiveRequestsSection(): React.JSX.Element {
  const requests = [
    {
      title: "Amalfi Coast Helicopter Transfer",
      client: "Lord Harrison",
      status: "Pending VIP Clearance",
      tag: "amber" as const,
    },
    {
      title: "Kyoto Private Tea Master Session",
      client: "Dr. Evelyn Vance",
      status: "Confirmed",
      tag: "emerald" as const,
    },
    {
      title: "Patagonia Glacier Heli-Skiing",
      client: "Marcus Sterling",
      status: "Itinerary Drafting",
      tag: "sky" as const,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Heading level={2} size="md" className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-app-brand" />
          <span>Active Curation Requests</span>
        </Heading>
        <span className="text-xs font-semibold text-app-muted">2 Pending Approvals</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {requests.map((req, i) => (
          <Card key={i} variant="interactive" className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Badge variant={req.tag} className="text-[10px]">
                {req.status}
              </Badge>
              <span className="text-xs font-bold text-app-muted">
                #REQ-0{String(i + 1)}
              </span>
            </div>
            <div>
              <h4 className="font-bold text-app-fg text-sm">{req.title}</h4>
              <p className="text-xs text-app-muted mt-0.5">{req.client}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage(): React.JSX.Element {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader userName={user?.name} userRole={user?.role} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CurationCard />
        </div>
        <BookingsValueCard />
      </div>

      <ActiveRequestsSection />
    </div>
  );
}
