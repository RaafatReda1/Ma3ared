import React from "react";
import { RefreshCw, LayoutDashboard, AlertCircle, ShieldAlert } from "lucide-react";
import { useDashboard } from "./hooks/useDashboard";
import KPIGrid from "./components/KPIGrid";
import RegistrationTrend from "./components/RegistrationTrend";
import ApprovalStatusChart from "./components/ApprovalStatusChart";
import AttendanceTypeChart from "./components/AttendanceTypeChart";
import RecentRegistrations from "./components/RecentRegistrations";
import RecentActivityLogs from "./components/RecentActivityLogs";
import PendingStudents from "./components/PendingStudents";
import LinkClicksChart from "./components/LinkClicksChart";
import styles from "./AdminDashboard.module.css";

const AdminDashboard = () => {
  const {
    data,
    loading,
    error,
    refresh,
    isRefreshing,
    isSudoAdmin,
    handleApprovalChange,
  } = useDashboard();

  return (
    <div className={styles.dashboardContainer}>
      {/* ── 1. Header (Title, Subtitle, Refresh Action) ── */}
      <div className={styles.dashHeader}>
        <div className={styles.dashTitleBlock}>
          <h1 className={styles.dashTitle}>
            <LayoutDashboard size={26} className="text-amber-400" />
            <span>لوحة التحكم والإحصائيات</span>
          </h1>
          <p className={styles.dashSubtitle}>
            نظرة لحظية على استمارات التسجيل، معدلات القبول، وإحصائيات المشاركة
          </p>
        </div>

        <div className={styles.headerActions}>
          {/* Sudo badge */}
          {isSudoAdmin && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(109, 40, 217, 0.08)",
                color: "#7c3aed",
                border: "1px solid rgba(109, 40, 217, 0.25)",
                borderRadius: 10,
                padding: "4px 12px",
                fontSize: "0.78rem",
                fontWeight: 800,
              }}
            >
              <ShieldAlert size={14} />
              <span>مسؤول رئيسي</span>
            </span>
          )}

          <button
            onClick={refresh}
            disabled={isRefreshing}
            className={styles.refreshBtn}
            title="تحديث كافة بيانات الإحصائيات"
          >
            <RefreshCw
              size={16}
              className={isRefreshing ? styles.spinIcon : ""}
            />
            <span>{isRefreshing ? "جاري التحديث..." : "تحديث البيانات"}</span>
          </button>
        </div>
      </div>

      {/* ── Error Banner (if any) ── */}
      {error && (
        <div className={styles.errorCard}>
          <div className="flex items-center gap-2">
            <AlertCircle size={20} className="shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={refresh} className={styles.retryBtn}>
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* ── 2. Primary KPI Stat Cards (6 Cards) ── */}
      <KPIGrid kpis={data.kpis} loading={loading} />

      {/* ── 3. Charts Row 1: Registration Trend (2/3) + Donut Status (1/3) ── */}
      <div className={styles.twoColGrid}>
        <RegistrationTrend data={data.timelineData} loading={loading} />
        <ApprovalStatusChart data={data.approvalStatusData} loading={loading} />
      </div>

      {/* ── 4. Pending Students Quick-Review Widget ── */}
      {(data.pendingStudents?.length > 0 || loading) && (
        <div className={styles.fullWidthSection}>
          <PendingStudents
            students={data.pendingStudents}
            loading={loading}
            onApprovalChange={handleApprovalChange}
          />
        </div>
      )}

      {/* ── 5. Charts Row 2: Attendance Type (1/3) + Recent Activity Stream (2/3) ── */}
      <div className={styles.twoColGridReverse}>
        <AttendanceTypeChart data={data.attendanceTypeData} loading={loading} />
        <RecentActivityLogs logs={data.recentLogs} loading={loading} />
      </div>

      {/* ── 6. Tables Row: Recent Registrations ── */}
      <div className={styles.fullWidthSection}>
        <RecentRegistrations students={data.recentStudents} loading={loading} />
      </div>

      {/* ── 7. Sudo Admin Only: Link Clicks Chart ── */}
      {isSudoAdmin && (
        <div className={styles.fullWidthSection}>
          <LinkClicksChart data={data.linkClicksData} loading={loading} />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;