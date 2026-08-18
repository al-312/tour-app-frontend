"use client";

import Image from "next/image";
import { toast } from "sonner";
import * as React from "react";
import {
  Clock,
  ArrowUp,
  PlusCircle,
  TrendingUp,
  MoreHorizontal,
  ShieldCheck,
  Compass,
  Sparkles,
} from "lucide-react";

import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { useAppSelector } from "@/redux/hooks";

interface CurationRequest {
  id: string;
  name: string;
  avatar: string;
  details: string;
}

const RECENT_REQUESTS: CurationRequest[] = [
  {
    id: "1",
    name: "Eleanor V.",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDdirazj5ohkZfGjtfP2a4LA-HuasGV-prPeKGyFqpJzhFz7em43OXg4BJ2WTSIqdvScvuNIpYylgdMicNI7oVVZNQrwap630CYLMxHCj5OKOJ5x97M6tv3TQKRreA5hHyIb_fvGnho_iz4MC97p500-k16W1Y9Ftpj0iJW0tFSKeR1WV0lsdBaQ9a4UyFcm7IjPUnTKKBIDExckQElCLNTQLkuocPPuhSPfKBsxBvKeuOpnL1n1bpQSQ",
    details:
      "Requesting a bespoke 10-day itinerary focusing on contemporary art galleries in Kyoto.",
  },
  {
    id: "2",
    name: "Marcus T.",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDB8ZcgbTaKs8j7XxCHNxdJgfz9YXxxJenYfst8WAPRYF0aYEDhItnCF02eDT5QP3EzLDOBtVh5iFZ0_Jw33V3aDC-b06nOz9kjMjfX8kExT_3iV_dR2uoOQqyGMDI87mr_38LETjE8I793ZYEjNXU2HSyaSu6grVYs21rHp9zCjXOgACstZM-9z80K1wkK2xkQQrEe0mrE4blRmsY4Ywcf8uLq0l5-2eQpAyDQNXKBPZO4PRjE64i8VA",
    details:
      "Seeking private helicopter transfers and exclusive access to remote Patagonian lodges.",
  },
];

interface DashboardHeaderProps {
  userName?: string | undefined;
  userRole?: string | undefined;
}

function DashboardHeader({
  userName,
  userRole,
}: DashboardHeaderProps): React.JSX.Element {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <Heading
        level={1}
        variant="display-lg"
        subheading="Your curated portfolio of exclusive experiences and active client itineraries."
      >
        Welcome back, {userName ?? "Consultant"}.
      </Heading>
      <div className="flex items-center gap-3">
        <div className="bg-app-surface/80 border border-app-card-border backdrop-blur-md rounded-full px-5 py-2 flex items-center gap-2 shadow-sm">
          <TrendingUp className="w-4 h-4 text-app-brand" />
          <span className="text-[11px] font-bold text-app-fg uppercase tracking-wider font-label-caps">
            +12.4% Revenue Growth
          </span>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-1.5 text-emerald-500 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>{userRole ?? "ADMIN"} Verified</span>
        </div>
      </div>
    </div>
  );
}

function DashboardHeroCard(): React.JSX.Element {
  return (
    <Card className="p-0 overflow-hidden md:col-span-8 relative group flex flex-col min-h-[360px] shadow-lg">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAy73dQlcYQrLHRblEWuhhqjjU747LP6J8HTrIew51-rAQa8P3rleAbZUNdVqEQmk6qKfirrPhDAbz440EJbfYFy-jOwYkNyLDUaO6KeO_aWV4CR7eO0HoRslqp5fwMJhHh68P08KVE8yzgaFxQoLorZ2FromTgo_VoGy3BbfM--rK0WzrKsw3LUlkJqFbEMAPPARY2P1FpqC6-nLAfgzFOmR4l228RrE_F0W3OXc4_0DvQybCLgBDZcQ"
          alt="Nordic Nocturne Journey"
          fill
          priority
          className="object-cover opacity-85 dark:opacity-60 group-hover:scale-103 transition-transform duration-700 ease-out"
          sizes="(max-width: 768px) 100vw, 66vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-app-surface/95 via-app-surface/40 to-transparent dark:from-black/95 dark:via-black/40" />
      </div>

      <div className="relative z-10 flex flex-col h-full justify-end p-8 mt-auto gap-4">
        <div className="flex items-center flex-wrap gap-2">
          <Badge variant="brand">Upcoming Departure</Badge>
          <span className="text-xs font-semibold text-app-fg flex items-center gap-1.5 bg-app-surface/80 backdrop-blur-md px-3 py-1 rounded-full border border-app-border">
            <Clock className="w-3.5 h-3.5 text-app-brand" />
            In 3 Days
          </span>
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-app-fg font-headline-md mb-1.5">
            The Nordic Nocturne Expedition
          </h3>
          <p className="text-sm text-app-muted max-w-md font-body-md leading-relaxed">
            An exclusive private super-yacht voyage navigating northern fjords beneath the
            magical aurora borealis.
          </p>
        </div>
      </div>
    </Card>
  );
}

function DashboardStatsCard(): React.JSX.Element {
  return (
    <Card className="md:col-span-4 flex flex-col justify-between p-8 shadow-lg">
      <div>
        <h4 className="text-[11px] font-bold text-app-muted uppercase tracking-wider font-label-caps mb-6 flex items-center justify-between">
          <span>Total Bookings Value</span>
          <Sparkles className="w-4 h-4 text-app-brand" />
        </h4>
        <div className="text-4xl font-extrabold text-app-fg font-display-lg mb-2">
          $142,500
        </div>
        <div className="flex items-center gap-1.5 text-app-brand font-semibold text-sm">
          <ArrowUp className="w-4 h-4" />
          <span>+$24,000 vs previous month</span>
        </div>
      </div>

      <div className="mt-8 h-28 relative w-full">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 30">
          <path
            d="M0 30 L10 25 L20 28 L30 15 L40 18 L50 5 L60 12 L70 8 L80 2 L90 5 L100 0 L100 30 Z"
            fill="var(--color-app-brand-bg)"
            className="opacity-25"
          />
          <path
            d="M0 30 L10 25 L20 28 L30 15 L40 18 L50 5 L60 12 L70 8 L80 2 L90 5 L100 0"
            fill="none"
            stroke="var(--color-app-brand)"
            strokeWidth="2"
          />
        </svg>
      </div>
    </Card>
  );
}

function CurationCard({ item }: { item: CurationRequest }): React.JSX.Element {
  return (
    <Card className="flex flex-col justify-between p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-app-border relative bg-app-bg">
            <Image
              src={item.avatar}
              alt={item.name}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
          <button
            aria-label="More Options"
            onClick={(): void => {
              toast.info(`Options menu for ${item.name}`);
            }}
            className="p-1 hover:bg-app-border/30 rounded-lg text-app-muted cursor-pointer transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
        <div>
          <h4 className="text-base font-bold text-app-fg font-body-lg mb-1">
            {item.name}
          </h4>
          <p className="text-sm text-app-muted font-body-md line-clamp-2 leading-relaxed">
            {item.details}
          </p>
        </div>
      </div>
      <Button
        variant="secondary"
        className="w-full mt-6 text-xs font-semibold py-2.5 cursor-pointer"
        onClick={(): void => {
          toast.info(`Opening curation review panel for ${item.name}...`);
        }}
      >
        Review Request
      </Button>
    </Card>
  );
}

export default function DashboardPage(): React.JSX.Element {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="animate-slide-up flex flex-col gap-10">
      <DashboardHeader userName={user?.name} userRole={user?.role} />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <DashboardHeroCard />
        <DashboardStatsCard />
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold tracking-tight text-app-fg font-headline-md flex items-center gap-2">
            <Compass className="w-5 h-5 text-app-brand" />
            <span>Active Curation Requests</span>
          </h3>
          <span className="text-xs font-semibold text-app-muted">
            2 Pending Approvals
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {RECENT_REQUESTS.map((item) => (
            <CurationCard key={item.id} item={item} />
          ))}

          <button
            onClick={(): void => {
              toast.success("Drafting a new premium experience...");
            }}
            className="glass-panel hover:bg-app-surface-variant/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer border border-dashed border-app-border transition-all duration-300 min-h-[230px] group"
          >
            <PlusCircle className="w-10 h-10 text-app-brand mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="text-base font-bold text-app-fg font-body-lg mb-1">
              Draft New Itinerary
            </h4>
            <p className="text-xs text-app-muted font-body-md max-w-[200px]">
              Start building a customized travel experience from scratch
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
