"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronDown, Search, X } from "lucide-react";
import * as React from "react";

const SEPARATOR = " > ";

export interface NestedSelectOption {
  value: string;
  label: string;
  children?: NestedSelectOption[];
}

export interface NestedSelectProps {
  options: NestedSelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  triggerClassName?: string;
  disabled?: boolean;
}

function getPathParts(value: string): string[] {
  if (!value.trim()) return [];
  return value.split(SEPARATOR).map((s) => s.trim()).filter(Boolean);
}

function getCurrentLevelOptions(
  options: NestedSelectOption[],
  pathLabels: string[]
): NestedSelectOption[] {
  if (pathLabels.length === 0) return options;
  let current: NestedSelectOption[] = options;
  for (const label of pathLabels) {
    const next = current.find(
      (opt) => opt.label.toLowerCase() === label.toLowerCase()
    );
    if (!next?.children?.length) return current;
    current = next.children;
  }
  return current;
}

function findPathToLabel(
  options: NestedSelectOption[],
  pathLabels: string[]
): string[] {
  if (pathLabels.length === 0) return [];
  const [head, ...rest] = pathLabels;
  const node = options.find(
    (opt) => opt.label.toLowerCase() === head.toLowerCase()
  );
  if (!node) return [];
  if (rest.length === 0) return [node.label];
  if (!node.children?.length) return [node.label];
  const childPath = findPathToLabel(node.children, rest);
  if (childPath.length !== rest.length) return [node.label];
  return [node.label, ...childPath];
}

export function NestedSelect({
  options,
  value = "",
  onValueChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyMessage = "No options found.",
  className,
  triggerClassName,
  disabled = false,
}: NestedSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [pathLabels, setPathLabels] = React.useState<string[]>(() =>
    getPathParts(value)
  );

  const pathFromValue = getPathParts(value);
  const pathResolved = findPathToLabel(options, pathFromValue);

  React.useEffect(() => {
    if (open) {
      setPathLabels(pathResolved.slice(0, -1));
      setSearch("");
    }
  }, [open, value]);

  const currentLevel = getCurrentLevelOptions(
    options,
    pathLabels
  );
  const filteredOptions = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return currentLevel;
    return currentLevel.filter((opt) =>
      opt.label.toLowerCase().includes(q)
    );
  }, [currentLevel, search]);

  const handleSelect = React.useCallback(
    (option: NestedSelectOption) => {
      if (option.children?.length) {
        setPathLabels((prev) => [...prev, option.label]);
        setSearch("");
        return;
      }
      const fullPath = pathLabels.length
        ? [...pathLabels, option.label].join(SEPARATOR)
        : option.label;
      onValueChange?.(fullPath);
      setOpen(false);
    },
    [pathLabels, onValueChange]
  );

  const handleGoUp = React.useCallback((index: number) => {
    setPathLabels((prev) => prev.slice(0, index));
    setSearch("");
  }, []);

  const handleClear = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onValueChange?.("");
    },
    [onValueChange]
  );

  const displayValue = pathResolved.length > 0 ? pathResolved.join(SEPARATOR) : value || "";
  const hasValue = Boolean(displayValue);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className={cn("w-full max-w-full", className)}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              "border-input data-placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              !displayValue && "text-muted-foreground",
              triggerClassName
            )}
          >
            <span className={cn("min-w-0 flex-1 truncate text-left", !displayValue && "placeholder")}>
              {displayValue || placeholder}
            </span>
            <div className="flex shrink-0 items-center gap-0.5">
              {hasValue && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={handleClear}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleClear(e as unknown as React.MouseEvent);
                    }
                  }}
                  className="text-muted-foreground hover:text-foreground rounded p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Clear selection"
                >
                  <X className="size-4" />
                </span>
              )}
              <ChevronDown
                className={cn("size-4 opacity-50 transition-transform", open && "rotate-180")}
              />
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-(--radix-popover-trigger-width) min-w-[200px] max-w-[400px] p-0"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="flex flex-col">
            <div className="flex items-center border-b border-border px-2">
              <Search className="text-muted-foreground mx-2 size-4 shrink-0" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="placeholder:text-muted-foreground flex h-9 w-full rounded-md bg-transparent py-2 text-sm outline-none"
                autoComplete="off"
              />
            </div>
            {pathLabels.length > 0 && (
              <div className="border-b border-border px-3 py-2 text-sm text-muted-foreground">
                {pathLabels.map((label, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className="mx-1.5">{SEPARATOR.trim()}</span>}
                    <button
                      type="button"
                      onClick={() => handleGoUp(i)}
                      className="hover:text-foreground focus:text-foreground focus:outline-none focus-visible:underline"
                    >
                      {label}
                    </button>
                  </React.Fragment>
                ))}
              </div>
            )}
            <div
              className="min-h-0 max-h-64 overflow-y-auto overscroll-contain p-1"
              onWheel={(e) => e.stopPropagation()}
            >
              {filteredOptions.length === 0 ? (
                <div className="text-muted-foreground px-3 py-2 text-sm">
                  {emptyMessage}
                </div>
              ) : (
                <ul className="flex flex-col gap-0.5">
                  {filteredOptions.map((option) => (
                    <li key={option.value}>
                      <button
                        type="button"
                        onClick={() => handleSelect(option)}
                        className="focus:bg-accent focus:text-accent-foreground hover:bg-accent/80 flex w-full cursor-default items-center justify-between gap-2 rounded-sm py-1.5 pl-2 pr-2 text-left text-sm outline-none"
                      >
                        <span className="line-clamp-1 flex-1">{option.label}</span>
                        {option.children?.length ? (
                          <ChevronDown className="size-4 shrink-0 -rotate-90 opacity-50" />
                        ) : null}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </PopoverContent>
      </div>
    </Popover>
  );
}
