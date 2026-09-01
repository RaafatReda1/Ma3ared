import React, { useState } from "react";
import { Clock, Check, X, User, Phone, Mail, Sparkles } from "lucide-react";
import { formatRelativeTime } from "@/utils/dashboardActions";
import SectionCard from "./SectionCard";
import styles from "../AdminDashboard.module.css";

const PendingCard = ({ st, onApprovalChange }) => {
  const [acted, setActed] = useState(null);

  const handle = (status) => {
    setActed(status === true ? "approved" : "rejected");
    onApprovalChange && onApprovalChange(st.id, status);
  };

  return (
    <div className={`${styles.pendingCard} ${acted ? styles.pendingCardActed : ""}`}>
      {/* 1. Header: Avatar + Name + Badges */}
      <div className={styles.pendingCardHeader}>
        <div className={styles.pendingCardAvatar}>
          {st.name ? st.name.charAt(0).toUpperCase() : <User size={18} />}
        </div>
        <div className={styles.pendingHeaderInfo}>
          <div className={styles.pendingCardName} title={st.name}>
            {st.name || "بدون اسم"}
          </div>
          <div className={styles.pendingBadgeRow}>
            {st.isFirstTime ? (
              <span className={styles.badgeFirstTime}>
                <Sparkles size={11} /> أول مرة
              </span>
            ) : (
              <span className={styles.badgeReturning}>حضور سابق</span>
            )}
            <span className={styles.pendingTimeAgo}>
              <Clock size={11} />
              {formatRelativeTime(st.created_at)}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Contact details */}
      <div className={styles.pendingContactBox}>
        {st.phone && (
          <div className={styles.pendingContactItem} title={st.phone}>
            <Phone size={12} className="text-emerald-500 shrink-0" />
            <span className={styles.pendingPhoneVal}>{st.phone}</span>
          </div>
        )}
        {st.email && (
          <div className={styles.pendingContactItem} title={st.email}>
            <Mail size={12} className="text-sky-500 shrink-0" />
            <span className={styles.pendingEmailVal}>{st.email}</span>
          </div>
        )}
      </div>

      {/* 3. Action Buttons (Footer Row) */}
      <div className={styles.pendingCardActions}>
        <button
          type="button"
          className={`${styles.pendingBtnApprove} ${acted === "approved" ? styles.acted : ""}`}
          onClick={() => handle(true)}
          disabled={!!acted}
          title="اعتماد وقبول المشارك"
        >
          <Check size={15} />
          <span>قبول الطلب</span>
        </button>
        <button
          type="button"
          className={`${styles.pendingBtnReject} ${acted === "rejected" ? styles.acted : ""}`}
          onClick={() => handle(false)}
          disabled={!!acted}
          title="رفض الطلب"
        >
          <X size={15} />
          <span>رفض</span>
        </button>
      </div>
    </div>
  );
};

const PendingStudents = ({ students = [], loading, onApprovalChange }) => {
  return (
    <SectionCard
      icon={Clock}
      iconBg="rgba(245, 158, 11, 0.12)"
      iconColor="#f59e0b"
      title={`طلبات قيد المراجعة${students.length > 0 ? ` (${students.length})` : ""}`}
      subtitle="اضغط قبول أو رفض للبت الفوري في كل طلب"
    >
      {loading ? (
        <div className={styles.pendingSkeletonGrid}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={`${styles.skeleton}`} style={{ height: 160, borderRadius: 16 }} />
          ))}
        </div>
      ) : !students || students.length === 0 ? (
        <div className={styles.emptyState}>
          <Check size={32} style={{ color: "#10b981", marginBottom: 10 }} />
          <p className={styles.emptyStateText}>لا توجد طلبات معلقة حالياً 🎉</p>
          <p style={{ fontSize: "0.78rem", color: "#94a3b8", margin: 0 }}>
            جميع المشاركين تم البت في طلباتهم
          </p>
        </div>
      ) : (
        <div className={styles.pendingCardsGrid}>
          {students.map((st) => (
            <PendingCard key={st.id} st={st} onApprovalChange={onApprovalChange} />
          ))}
        </div>
      )}
    </SectionCard>
  );
};

export default PendingStudents;
