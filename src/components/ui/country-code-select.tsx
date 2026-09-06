"use client";

import * as React from "react";
import { Globe, ChevronDown, Search, Check } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { getAllCountries, type CountryPhoneInfo } from "@/lib/utils/phone.utils";

interface CountryCodeSelectProps {
  label?: string | undefined;
  value?: string | undefined;
  onChange?: ((callingCode: string) => void) | undefined;
  error?: string | undefined;
  disabled?: boolean | undefined;
  className?: string | undefined;
}

export function CountryCodeSelect({
  label,
  value = "+1",
  onChange,
  error,
  disabled = false,
  className,
}: CountryCodeSelectProps): React.JSX.Element {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);

  const allCountries = React.useMemo(() => getAllCountries(), []);

  // Selected country match
  const selectedCountry = React.useMemo(() => {
    return (
      allCountries.find((c) => c.callingCode === value) ??
      allCountries.find((c) => c.iso === "US") ??
      allCountries[0]
    );
  }, [allCountries, value]);

  // Filter countries by search query
  const filteredCountries = React.useMemo(() => {
    if (!search.trim()) return allCountries;
    const query = search.toLowerCase().trim();
    return allCountries.filter(
      (c) =>
        c.countryName.toLowerCase().includes(query) ||
        c.callingCode.includes(query) ||
        c.iso.toLowerCase().includes(query)
    );
  }, [allCountries, search]);

  // Close popover when clicking outside
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (country: CountryPhoneInfo): void => {
    onChange?.(country.callingCode);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div
      className={cn("flex flex-col gap-1.5 w-full relative", className)}
      ref={containerRef}
    >
      {label && (
        <label className="text-xs font-semibold tracking-wider text-app-muted uppercase font-label-caps">
          {label}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
        className={cn(
          "w-full px-3 py-3 bg-app-surface-variant border border-app-border/80 rounded-xl text-app-fg text-sm flex items-center justify-between transition-all duration-200 outline-none focus:border-app-brand focus:ring-2 focus:ring-app-brand/20 cursor-pointer",
          error && "border-app-error focus:border-app-error focus:ring-app-error/20",
          disabled && "opacity-60 cursor-not-allowed"
        )}
      >
        <span className="flex items-center gap-2 truncate">
          <Globe className="w-4 h-4 text-app-muted shrink-0" />
          <span className="font-semibold">{selectedCountry?.callingCode ?? value}</span>
          <span className="text-xs text-app-muted truncate hidden sm:inline">
            ({selectedCountry?.iso})
          </span>
        </span>
        <ChevronDown className="w-4 h-4 text-app-muted shrink-0 ml-1" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-72 max-h-72 bg-app-surface border border-app-border/80 rounded-2xl shadow-2xl z-50 p-2 flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-150">
          <div className="relative">
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              placeholder="Search country or code..."
              className="w-full pl-8 pr-3 py-2 bg-app-surface-variant border border-app-border/60 rounded-xl text-xs text-app-fg placeholder:text-app-muted/60 outline-none focus:border-app-brand"
            />
            <Search className="w-3.5 h-3.5 text-app-muted absolute left-2.5 top-2.5 pointer-events-none" />
          </div>

          <div className="overflow-y-auto max-h-56 pr-1 space-y-0.5 custom-scrollbar">
            {filteredCountries.length === 0 ? (
              <div className="p-3 text-center text-xs text-app-muted">
                No matching country found
              </div>
            ) : (
              filteredCountries.map((c) => {
                const isSelected = c.callingCode === value;
                return (
                  <button
                    key={`${c.iso}-${c.callingCode}`}
                    type="button"
                    onClick={() => {
                      handleSelect(c);
                    }}
                    className={cn(
                      "w-full px-2.5 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-app-surface-variant/80 transition-colors text-left cursor-pointer",
                      isSelected && "bg-app-brand/10 font-bold text-app-brand"
                    )}
                  >
                    <span className="truncate flex items-center gap-2">
                      <span className="font-mono text-[10px] bg-app-surface-variant px-1.5 py-0.5 rounded text-app-muted shrink-0">
                        {c.iso}
                      </span>
                      <span className="truncate">{c.countryName}</span>
                    </span>
                    <span className="font-mono text-app-muted shrink-0 ml-2 flex items-center gap-1">
                      <span>{c.callingCode}</span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-app-brand ml-1" />
                      )}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {error && <span className="text-xs font-medium text-app-error">{error}</span>}
    </div>
  );
}
