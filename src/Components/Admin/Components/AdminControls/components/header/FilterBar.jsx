import React from "react";
import { Search, Filter, RotateCcw } from "lucide-react";
import styles from "../../AdminControls.module.css";

const FilterBar = ({
  search = "",
  onSearchChange,
  status = "all",
  onStatusChange,
  firstTimeFilter = "all",
  onFirstTimeFilterChange,
  dayFilter = "all",
  onDayFilterChange,
  uniqueRegistrationDays = [],
  hasActiveFilters = false,
  onResetFilters,
}) => {
  return (
    <div className={styles.filterBarCard}>
      {/* Top Row: Search & Main Dropdowns */}
      <div className={styles.filterTopRow}>
        <div className={styles.searchWrap}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="ابحث بالاسم، البريد الإلكتروني، أو رقم الهاتف..."
            className={styles.searchInput}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Status Dropdown */}
        <select
          className={styles.filterSelect}
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="all">كل حالات القبول</option>
          <option value="pending">⏳ في انتظار المراجعة</option>
          <option value="approved">✅ المقبولين فقط</option>
          <option value="rejected">❌ المرفوضين فقط</option>
        </select>

        {/* First Time Dropdown */}
        <select
          className={styles.filterSelect}
          value={firstTimeFilter}
          onChange={(e) => onFirstTimeFilterChange(e.target.value)}
        >
          <option value="all">نوع الحضور: الكل</option>
          <option value="first_time">✦ حضور لأول مرة</option>
          <option value="returning">🔄 حضور سابق</option>
        </select>
      </div>

      {/* Sub Row: Date Filter & Reset Button */}
      <div className={styles.filterSubRow}>
        <div className={styles.filterLabelWrap}>
          <Filter size={14} />
          <span>تصفية التاريخ:</span>
        </div>

        {/* Day / Date Filter */}
        <select
          className={styles.filterSelect}
          value={dayFilter}
          onChange={(e) => onDayFilterChange(e.target.value)}
        >
          <option value="all">كل الأيام والتواريخ</option>
          <option value="today">📅 اليوم</option>
          <option value="yesterday">📅 أمس</option>
          {uniqueRegistrationDays.map((d) => (
            <option key={d} value={d}>
              {new Date(d).toLocaleDateString("ar-EG", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </option>
          ))}
        </select>

        {/* Custom Date Input */}
        <input
          type="date"
          className={styles.dateInput}
          title="اختيار تاريخ مخصص من التقويم"
          value={
            dayFilter !== "all" &&
            dayFilter !== "today" &&
            dayFilter !== "yesterday"
              ? dayFilter
              : ""
          }
          onChange={(e) => onDayFilterChange(e.target.value || "all")}
        />

        {/* Reset Filters */}
        {hasActiveFilters && (
          <button
            type="button"
            className={styles.clearFilterBtn}
            onClick={onResetFilters}
          >
            <RotateCcw size={12} />
            <span>إعادة ضبط الفلاتر</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
