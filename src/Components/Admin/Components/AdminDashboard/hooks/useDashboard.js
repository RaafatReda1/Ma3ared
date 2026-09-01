import { useState, useEffect, useCallback } from "react";
import { getDashboardData } from "@/utils/dashboardActions";
import { getAdminProfile, logActivity } from "@/utils/activityLogger";
import supabase from "@/utils/supabaseClient";

export const useDashboard = () => {
  const [data, setData] = useState({
    kpis: {
      total: 0,
      approved: 0,
      pending: 0,
      rejected: 0,
      firstTime: 0,
      returning: 0,
      verified: 0,
      approvedRate: 0,
      firstTimeRate: 0,
    },
    timelineData: [],
    approvalStatusData: [],
    attendanceTypeData: [],
    pendingStudents: [],
    recentStudents: [],
    recentLogs: [],
    linkClicksData: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSudoAdmin, setIsSudoAdmin] = useState(false);
  const [adminProfile, setAdminProfile] = useState(null);

  // Check sudo privilege on mount
  useEffect(() => {
    getAdminProfile(true).then((profile) => {
      setAdminProfile(profile);
      setIsSudoAdmin(Boolean(profile?.sudo));
    });
  }, []);

  const loadData = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setIsRefreshing(true);
      else setLoading(true);
      setError(null);

      const res = await getDashboardData();
      setData(res);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err?.message || "خطأ في تحميل بيانات لوحة التحكم");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Quick approval action for PendingStudents widget
  const handleApprovalChange = useCallback(
    async (studentId, newStatus) => {
      try {
        const { error: updateErr } = await supabase
          .from("students")
          .update({ isApproved: newStatus })
          .eq("id", studentId);

        if (updateErr) throw updateErr;

        // Log the activity
        if (adminProfile) {
          const actionType =
            newStatus === true
              ? "approve_student"
              : newStatus === false
              ? "reject_student"
              : "reset_student_pending";
          await logActivity({
            action_type: actionType,
            action_category: "student_management",
            description: `تغيير حالة الطالب #${studentId} إلى ${
              newStatus === true ? "معتمد" : newStatus === false ? "مرفوض" : "معلق"
            } (من لوحة التحكم السريعة)`,
            target_id: studentId,
            actorOverride: {
              id: adminProfile.user_id,
              email: adminProfile.email,
              name: adminProfile.name,
              role: adminProfile.sudo ? "sudo_admin" : "admin",
            },
          });
        }

        // Optimistically update local state
        setData((prev) => ({
          ...prev,
          pendingStudents: prev.pendingStudents.filter((s) => s.id !== studentId),
          kpis: {
            ...prev.kpis,
            pending: Math.max(0, prev.kpis.pending - 1),
            approved: newStatus === true ? prev.kpis.approved + 1 : prev.kpis.approved,
            rejected: newStatus === false ? prev.kpis.rejected + 1 : prev.kpis.rejected,
          },
        }));
      } catch (err) {
        console.error("Approval change error:", err);
        // Refresh to get accurate state
        loadData(true);
      }
    },
    [adminProfile, loadData]
  );

  const refresh = () => loadData(true);

  return {
    data,
    loading,
    error,
    refresh,
    isRefreshing,
    isSudoAdmin,
    handleApprovalChange,
  };
};
