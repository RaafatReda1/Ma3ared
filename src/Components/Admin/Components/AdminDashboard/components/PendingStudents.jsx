import React from "react";
import { Clock, Check, X, User, Phone } from "lucide-react";
import { formatRelativeTime } from "@/utils/dashboardActions";
import SectionCard from "./SectionCard";
import styles from "../AdminDashboard.module.css";

const PendingStudents = ({ students = [], loading, onApprovalChange }) => {
  return (
    <SectionCard
      icon={Clock}
      iconBg="rgba(245, 158, 11, 0.12)"
      iconColor="#f59e0b"
      title="طلبات في انتظار المراجعة"
      subtitle="أحدث المشاركين الذين لم يتم اعتماد قبولهم بعد"
    >
      <div className={styles.tableResponsive}>
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "8px 0" }}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`${styles.skeleton} ${styles.skeletonText}`}
                style={{ height: "45px" }}
              />
            ))}
          </div>
        ) : !students || students.length === 0 ? (
          <div className={styles.emptyState}>
            <Check size={28} style={{ color: "#10b981", marginBottom: 8 }} />
            <p className={styles.emptyStateText}>لا توجد طلبات معلقة حالياً</p>
            <p style={{ fontSize: "0.78rem", color: "#94a3b8", margin: 0 }}>
              جميع المشاركين تم البت في طلباتهم
            </p>
          </div>
        ) : (
          <table className={styles.customTable}>
            <thead>
              <tr>
                <th>المشارك</th>
                <th>رقم الهاتف</th>
                <th>نوع الحضور</th>
                <th>تاريخ الإرسال</th>
                <th style={{ textAlign: "center" }}>الإجراء السريع</th>
              </tr>
            </thead>
            <tbody>
              {students.map((st) => (
                <tr key={st.id}>
                  <td>
                    <div className={styles.studentAvatarCell}>
                      <div
                        className={styles.studentThumb}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#f1f5f9",
                          color: "#64748b",
                          fontWeight: 700,
                          fontSize: "1rem",
                          borderRadius: "50%",
                        }}
                      >
                        {st.name ? st.name.charAt(0).toUpperCase() : <User size={16} />}
                      </div>
                      <div className={styles.studentNameBlock}>
                        <span className={styles.studentName}>{st.name || "بدون اسم"}</span>
                        <span className={styles.studentEmail}>{st.email}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontFamily: "monospace", fontSize: "0.82rem", color: "#475569" }}>
                    {st.phone ? (
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Phone size={12} />
                        {st.phone}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        color: st.isFirstTime ? "#7c3aed" : "#0284c7",
                        background: st.isFirstTime ? "#ede9fe" : "#dbeafe",
                        padding: "2px 8px",
                        borderRadius: 8,
                      }}
                    >
                      {st.isFirstTime ? "أول مرة ✦" : "حضور سابق"}
                    </span>
                  </td>
                  <td
                    style={{ color: "#64748b", fontSize: "0.78rem", fontWeight: 600, whiteSpace: "nowrap" }}
                    title={st.created_at}
                  >
                    {formatRelativeTime(st.created_at)}
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                      }}
                    >
                      {/* Quick Approve */}
                      <button
                        type="button"
                        onClick={() => onApprovalChange && onApprovalChange(st.id, true)}
                        title="اعتماد المشارك"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "5px 10px",
                          borderRadius: 8,
                          border: "none",
                          cursor: "pointer",
                          background: "#dcfce7",
                          color: "#15803d",
                          fontWeight: 700,
                          fontSize: "0.78rem",
                        }}
                      >
                        <Check size={13} />
                        <span>قبول</span>
                      </button>

                      {/* Quick Reject */}
                      <button
                        type="button"
                        onClick={() => onApprovalChange && onApprovalChange(st.id, false)}
                        title="رفض الطلب"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "5px 10px",
                          borderRadius: 8,
                          border: "none",
                          cursor: "pointer",
                          background: "#fee2e2",
                          color: "#b91c1c",
                          fontWeight: 700,
                          fontSize: "0.78rem",
                        }}
                      >
                        <X size={13} />
                        <span>رفض</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </SectionCard>
  );
};

export default PendingStudents;
