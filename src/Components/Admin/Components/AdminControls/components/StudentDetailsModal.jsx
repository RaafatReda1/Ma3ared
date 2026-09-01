import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Check,
  Clock,
  MessageCircle,
  FileText,
  Phone,
  Mail,
  User,
  Sparkles,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { generateCustomWhatsAppLink } from "@/utils/whatsAppTemplateManager";
import styles from "../AdminControls.module.css";

const StudentDetailsModal = ({
  isOpen = false,
  onClose,
  student = null,
  whatsAppTemplate,
  whatsAppNameOptions,
  onApprovalChange,
}) => {
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  if (!isOpen || !student) return null;

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

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <div className={styles.modalIconBox}>
              <FileText size={22} />
            </div>
            <div>
              <h2 className={styles.modalTitle}>{student.name || "تفاصيل المشارك"}</h2>
              <p className={styles.modalSubtitle}>تاريخ التسجيل: {formatDate(student.created_at)}</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {student.isApproved === true && (
              <span className={`${styles.statusBadge} ${styles.statusApproved}`}>
                <Check size={12} />
                <span>معتمد</span>
              </span>
            )}
            {student.isApproved === null && (
              <span className={`${styles.statusBadge} ${styles.statusPending}`}>
                <Clock size={12} />
                <span>قيد المراجعة</span>
              </span>
            )}
            {student.isApproved === false && (
              <span className={`${styles.statusBadge} ${styles.statusRejected}`}>
                <X size={12} />
                <span>مرفوض</span>
              </span>
            )}

            <button type="button" className={styles.closeModalBtn} onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          <div className={styles.infoGrid}>
            {/* Name */}
            <div className={styles.infoCard}>
              <div className={styles.infoCardHeader}>
                <User size={16} className="text-amber-400" />
                <span>الاسم الكامل</span>
              </div>
              <p className={styles.infoCardValue}>{student.name || "—"}</p>
            </div>

            {/* Email */}
            <div className={styles.infoCard}>
              <div className={styles.infoCardHeader}>
                <Mail size={16} className="text-sky-400" />
                <span>البريد الإلكتروني</span>
              </div>
              <p className={styles.infoCardValue}>{student.email || "—"}</p>
            </div>

            {/* Phone */}
            <div className={styles.infoCard}>
              <div className={styles.infoCardHeader}>
                <Phone size={16} className="text-emerald-400" />
                <span>رقم الهاتف</span>
              </div>
              <p className={styles.infoCardValue} dir="ltr" style={{ textAlign: "right" }}>
                {student.phone || "—"}
              </p>
            </div>

            {/* Attendance Type */}
            <div className={styles.infoCard}>
              <div className={styles.infoCardHeader}>
                <Sparkles size={16} className="text-cyan-400" />
                <span>نوع المشاركة</span>
              </div>
              <p className={styles.infoCardValue}>
                {student.isFirstTime ? "حضور لأول مرة ✦" : "حضور سابق في فعاليات سابقة"}
              </p>
            </div>

            {/* Google Account Linked */}
            <div className={styles.infoCard}>
              <div className={styles.infoCardHeader}>
                <ShieldCheck size={16} className="text-purple-400" />
                <span>توثيق الحساب</span>
              </div>
              <p className={styles.infoCardValue}>
                {student.user_id ? "موثق بحساب Google ✅" : "مسجل بدون تسجيل دخول"}
              </p>
            </div>

            {/* Registration Date */}
            <div className={styles.infoCard}>
              <div className={styles.infoCardHeader}>
                <Calendar size={16} className="text-rose-400" />
                <span>تاريخ ووقت التسجيل</span>
              </div>
              <p className={styles.infoCardValue}>{formatDate(student.created_at)}</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className={styles.modalFooterActions}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              type="button"
              className={styles.drawerBtnApprove}
              onClick={() => onApprovalChange(student.id, true)}
            >
              <Check size={14} />
              <span>اعتماد وقبول</span>
            </button>

            <button
              type="button"
              className={styles.drawerBtnPending}
              onClick={() => onApprovalChange(student.id, null)}
            >
              <Clock size={14} />
              <span>إعادة للمراجعة</span>
            </button>

            <button
              type="button"
              className={styles.drawerBtnReject}
              onClick={() => onApprovalChange(student.id, false)}
            >
              <X size={14} />
              <span>رفض الطلب</span>
            </button>
          </div>

          {student.phone && (
            <button
              type="button"
              onClick={handleWhatsAppSend}
              className={styles.drawerBtnWhatsApp}
            >
              <MessageCircle size={15} />
              <span>محادثة واتساب</span>
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default StudentDetailsModal;
