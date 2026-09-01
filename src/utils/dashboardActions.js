import supabase from "./supabaseClient";

/**
 * Formats a timestamp into a relative human-readable Arabic string.
 */
export const formatRelativeTime = (isoString) => {
  if (!isoString) return "—";
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "منذ لحظات";
  if (mins < 60) return `منذ ${mins} دقيقة`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `منذ ${hrs} ساعة`;
  const days = Math.floor(hrs / 24);
  return `منذ ${days} يوم`;
};

/**
 * Fetch all students and compute comprehensive analytics metrics for Ma3ared Dashboard
 */
export async function getDashboardData() {
  try {
    // 1. Fetch all students
    const { data: students, error: studentsErr } = await supabase
      .from("students")
      .select("id, name, phone, email, user_id, isApproved, isFirstTime, created_at")
      .order("created_at", { ascending: false });

    if (studentsErr) throw studentsErr;

    const all = students || [];
    const totalCount = all.length;

    // KPI Counters
    let approvedCount = 0;
    let pendingCount = 0;
    let rejectedCount = 0;
    let firstTimeCount = 0;
    let returningCount = 0;
    let verifiedCount = 0;

    // Timeline Trend aggregation (by YYYY-MM-DD)
    const timelineMap = {};

    all.forEach((s) => {
      // Approval stats
      if (s.isApproved === true) approvedCount++;
      else if (s.isApproved === false) rejectedCount++;
      else pendingCount++;

      // First time stats
      if (s.isFirstTime) firstTimeCount++;
      else returningCount++;

      // Verified with Google Auth
      if (s.user_id) verifiedCount++;

      // Timeline aggregation
      const dateKey = new Date(s.created_at).toISOString().slice(0, 10);
      timelineMap[dateKey] = (timelineMap[dateKey] || 0) + 1;
    });

    // Format Timeline Chart Data
    const timelineData = Object.entries(timelineMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({
        date: new Date(date).toLocaleDateString("ar-EG", {
          month: "short",
          day: "numeric",
        }),
        fullDate: date,
        count,
      }));

    // Approval Status Chart Data (Donut / Pie)
    const approvalStatusData = [
      { name: "معتمد",       value: approvedCount,  color: "#10b981" },
      { name: "قيد المراجعة", value: pendingCount,   color: "#f59e0b" },
      { name: "مرفوض",       value: rejectedCount,  color: "#ef4444" },
    ];

    // First Time vs Returning Chart Data
    const attendanceTypeData = [
      { name: "حضور لأول مرة", value: firstTimeCount, color: "#df9c4c" },
      { name: "حضور سابق",    value: returningCount,  color: "#38bdf8" },
    ];

    // Pending students (isApproved === null) sorted by newest — for quick-review widget
    const pendingStudents = all.filter((s) => s.isApproved === null).slice(0, 10);

    // Recent 6 Registrations
    const recentStudents = all.slice(0, 6);

    // Fetch recent 8 activity logs
    const { data: recentLogs } = await supabase
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(8);

    // Link clicks data from activity_logs (action_category = 'link_click')
    const { data: linkClickRows } = await supabase
      .from("activity_logs")
      .select("action_type, metadata, created_at")
      .eq("action_category", "link_click");

    // Aggregate link clicks by action_type
    const linkClickMap = {};
    (linkClickRows || []).forEach((row) => {
      const key = row.action_type;
      if (!linkClickMap[key]) {
        linkClickMap[key] = {
          actionType: key,
          label: row.metadata?.label || key,
          href: row.metadata?.href || "#",
          count: 0,
          lastClickedAt: null,
        };
      }
      linkClickMap[key].count++;
      const ts = row.created_at;
      if (!linkClickMap[key].lastClickedAt || ts > linkClickMap[key].lastClickedAt) {
        linkClickMap[key].lastClickedAt = ts;
      }
    });
    const linkClicksData = Object.values(linkClickMap).sort((a, b) => b.count - a.count);

    return {
      kpis: {
        total: totalCount,
        approved: approvedCount,
        pending: pendingCount,
        rejected: rejectedCount,
        firstTime: firstTimeCount,
        returning: returningCount,
        verified: verifiedCount,
        approvedRate: totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0,
        firstTimeRate: totalCount > 0 ? Math.round((firstTimeCount / totalCount) * 100) : 0,
      },
      timelineData,
      approvalStatusData,
      attendanceTypeData,
      pendingStudents,
      recentStudents,
      recentLogs: recentLogs || [],
      linkClicksData,
    };
  } catch (err) {
    console.error("getDashboardData error:", err);
    throw err;
  }
}
