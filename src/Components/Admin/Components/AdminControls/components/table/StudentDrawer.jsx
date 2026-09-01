import React, { useState } from "react";
import {
  Check,
  Clock,
  X,
  MessageCircle,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Shield,
  Sparkles,
  Calendar,
  Hash,
} from "lucide-react";
import { generateCustomWhatsAppLink } from "@/utils/whatsAppTemplateManager";
import styles from "../../AdminControls.module.css";

const StudentDrawer = ({
  student,
  whatsAppTemplate,
  whatsAppNameOptions,
  onOpenDetails,
  onOpenEdit,
  onOpenDelete,
  onSingleApproval,
}) => {
  const [justActed, setJustActed] = useState(null); // 'approved' | 'rejected' | 'pending'

  if (!student) return null;

  const whatsAppLink = generateCustomWhatsAppLink(
    student,
    whatsAppTemplate,
    whatsAppNameOptions
  );

  const handleWhatsAppSend = (e) => {
    e.preventDefault();
    if (whatsAppLink) {
      window.open(whatsAppLink, "_blank", "noopener,noreferrer");
    }
  };

  const handleApproval = (status) => {
    const label = status === true ? "approved" : status === false ? "rejected" : "pending";
    setJustActed(label);
    setTimeout(() => setJustActed(null), 1800);
    onSingleApproval(student.id, status);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("ar-EG", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const statusColor =
    student.isApproved === true
      ? { bg: "#dcfce7", color: "#15803d", label: "معتمد" }
      : student.isApproved === false
      ? { bg: "#fee2e2", color: "#b91c1c", label: "مرفوض" }
      : { bg: "#fef3c7", color: "#b45309", label: "قيد المراجعة" };

  return (
    <div className={styles.expandedDrawer}>

      {/* ── Left panel: Info cards ── */}
      <div className={styles.drawerInfoSection}>

        {/* Status strip at top */}
        <div className={styles.drawerStatusStrip} style={{ background: statusColor.bg, color: statusColor.color }}>
          {student.isApproved === true ? <Check size={14} /> : student.isApproved === false ? <X size={14} /> : <Clock size={14} />}
          <span>{statusColor.label}</span>
          {student.isFirstTime && (
            <span className={styles.drawerFirstTimeBadge}>
              <Sparkles size={11} />
              أول مرة
            </span>
          )}
          {student.user_id && (
            <span className={styles.drawerGoogleBadge}>
              <Shield size={11} />
              Google
            </span>
          )}
          <span className={styles.drawerIdChip}>
            <Hash size={10} />
            {String(student.id).slice(0, 8)}
          </span>
        </div>

        {/* Details grid */}
        <div className={styles.drawerDetailsGrid}>
          <div className={styles.drawerDetailCard}>
            <span className={styles.drawerDetailLabel}>
              <Phone size={11} /> رقم الهاتف
            </span>
            <span className={styles.drawerDetailVal} style={{ direction: "ltr", textAlign: "right", fontFamily: "monospace" }}>
              {student.phone || "—"}
            </span>
          </div>

          <div className={styles.drawerDetailCard}>
            <span className={styles.drawerDetailLabel}>
              <Mail size={11} /> البريد الإلكتروني
            </span>
            <span className={styles.drawerDetailVal} style={{ direction: "ltr", textAlign: "right", fontSize: "0.78rem" }}>
              {student.email || "—"}
            </span>
          </div>

          <div className={styles.drawerDetailCard}>
            <span className={styles.drawerDetailLabel}>
              <Calendar size={11} /> تاريخ التسجيل
            </span>
            <span className={styles.drawerDetailVal} style={{ fontSize: "0.78rem" }}>
              {formatDate(student.created_at)}
            </span>
          </div>
        </div>

        {/* ── Action buttons ── */}
        <div className={styles.drawerActionsRow}>

          {/* Approval group */}
          <div className={styles.drawerApprovalGroup}>
            <button
              type="button"
              className={`${styles.drawerBtnApprove} ${justActed === "approved" ? styles.actedFlash : ""}`}
              onClick={() => handleApproval(true)}
              disabled={student.isApproved === true}
            >
              <Check size={15} />
              <span>قبول</span>
            </button>

            <button
              type="button"
              className={`${styles.drawerBtnPending} ${justActed === "pending" ? styles.actedFlash : ""}`}
              onClick={() => handleApproval(null)}
              disabled={student.isApproved === null}
            >
              <Clock size={15} />
              <span>انتظار</span>
            </button>

            <button
              type="button"
              className={`${styles.drawerBtnReject} ${justActed === "rejected" ? styles.actedFlash : ""}`}
              onClick={() => handleApproval(false)}
              disabled={student.isApproved === false}
            >
              <X size={15} />
              <span>رفض</span>
            </button>

            {student.phone && (
              <button
                type="button"
                onClick={handleWhatsAppSend}
                className={styles.drawerBtnWhatsApp}
                title="فتح محادثة واتساب مع الطالب"
              >
                <MessageCircle size={15} />
                <span>واتساب</span>
              </button>
            )}
          </div>

          {/* Edit & Delete */}
          <div className={styles.drawerSecondaryActions}>
            <button
              type="button"
              className={styles.drawerBtnEdit}
              onClick={() => onOpenEdit(student)}
            >
              <Edit2 size={13} />
              <span>تعديل</span>
            </button>

            <button
              type="button"
              className={styles.drawerBtnDelete}
              onClick={() => onOpenDelete(student)}
            >
              <Trash2 size={13} />
              <span>حذف</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDrawer;
