import React from "react";
import ControlsTopBar from "./header/ControlsTopBar";
import PresetFilterCards from "./header/PresetFilterCards";
import FilterBar from "./header/FilterBar";

const ControlsHeader = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  firstTimeFilter,
  onFirstTimeFilterChange,
  dayFilter,
  onDayFilterChange,
  uniqueRegistrationDays = [],
  presetFilter,
  onSelectPreset,
  presetCounts = {},
  onResetFilters,
  onOpenCreate,
  onOpenWhatsAppSettings,
  onRefresh,
  loading,
  studentsToExport = [],
}) => {
  const hasActiveFilters =
    Boolean(search) ||
    status !== "all" ||
    firstTimeFilter !== "all" ||
    dayFilter !== "all" ||
    presetFilter !== "all";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* 1. Header Title & Export / Action Buttons */}
      <ControlsTopBar
        onOpenCreate={onOpenCreate}
        onOpenWhatsAppSettings={onOpenWhatsAppSettings}
        onRefresh={onRefresh}
        loading={loading}
        studentsToExport={studentsToExport}
      />

      {/* 2. Quick Preset Filter Cards with live counts */}
      <PresetFilterCards
        presetFilter={presetFilter}
        onSelectPreset={onSelectPreset}
        presetCounts={presetCounts}
      />

      {/* 3. Smart Search & Multi-Criteria Filter Bar */}
      <FilterBar
        search={search}
        onSearchChange={onSearchChange}
        status={status}
        onStatusChange={onStatusChange}
        firstTimeFilter={firstTimeFilter}
        onFirstTimeFilterChange={onFirstTimeFilterChange}
        dayFilter={dayFilter}
        onDayFilterChange={onDayFilterChange}
        uniqueRegistrationDays={uniqueRegistrationDays}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={onResetFilters}
      />
    </div>
  );
};

export default ControlsHeader;
