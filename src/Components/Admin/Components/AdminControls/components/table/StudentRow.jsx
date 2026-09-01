import React from "react";
import {
  Check,
  Clock,
  X,
  Eye,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { generateCustomWhatsAppLink } from "@/utils/whatsAppTemplateManager";
import styles from "../../AdminControls.module.css";

const StudentRow = ({
  student,
  isSelected = false,
  isExpanded = false,
  whatsAppTemplate,
  whatsAppNameOptions,
  onToggleSelect,
  onToggleExpand,
  onOpenDetails,
  onOpenEdit,
  onOpenDelete,
  onSingleApproval,
}) => {
  const whatsAppLink = generateCustomWhatsAppLink(
    student,
    whatsAppTemplate,
    whatsAppNameOptions
  );

  const handleWhatsAppSend = (e) => {
    e.stopPropagation();
    if (whatsAppLink) {
      window.open(whatsAppLink, "_blank", "noopener,noreferrer");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("ar-EG", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <tr
      className={`${styles.tableRow} ${isSelected ? styles.rowSelected : ""} ${
        isExpanded ? styles.rowExpanded : ""
      }`}
    >
      {/* Checkbox */}
      <td className={styles.colCheckbox} onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          className={styles.rowCheckbox}
          checked={isSelected}
          onChange={onToggleSelect}
        />
      </td>

      {/* Expand toggle */}
      <td
        className={styles.colExpand}
        onClick={(e) => {
          e.stopPropagation();
          onToggleExpand();
        }}
        title={isExpanded ? "إغلاق التفاصيل" : "عرض تفاصيل الطالب"}
      >
        <button type="button" className={styles.expandToggleBtn}>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </td>

      {/* Participant Info */}
      <td className={styles.colStudent}>
        <div className={styles.studentCell}>
          <div className={styles.studentAvatar}>
            {(student.name || "م").charAt(0).toUpperCase()}
          </div>
          <div className={styles.studentDetailsText}>
            <div className={styles.nameRow}>
              <span className={styles.studentNameText}>{student.name || "بدون اسم"}</span>
              {student.user_id && (
                <span className={styles.verifiedIcon} title="مسجل بحساب Google موثق">
                  <ShieldCheck size={14} className="text-sky-500" />
                </span>
              )}
            </div>
            <span className={styles.studentEmailText}>{student.email}</span>
            {student.phone && (
              <span className={styles.studentPhoneText}>
                <Phone size={11} />
                <span>{student.phone}</span>
              </span>
            )}
          </div>
        </div>
      </td>

      {/* First Time Attendance */}
      <td className={styles.colAttendance}>
        {student.isFirstTime ? (
          <span className={`${styles.badge} ${styles.badgeFirstTime}`}>
            <Sparkles size={12} />
            <span>أول مرة</span>
          </span>
        ) : (
          <span className={`${styles.badge} ${styles.badgeReturning}`}>
            <span>حضور سابق</span>
          </span>
        )}
      </td>

      {/* Approval Status */}
      <td className={styles.colStatus}>
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
      </td>

      {/* Registration Date */}
      <td className={styles.colDate}>
        <span className={styles.dateText}>{formatDate(student.created_at)}</span>
      </td>

      {/* Quick Actions Toolbar */}
      <td className={styles.colActions} onClick={(e) => e.stopPropagation()}>
        <div className={styles.rowActionsToolbar}>
          {/* Quick Approve button */}
          {student.isApproved !== true && (
            <button
              type="button"
              className={styles.rowBtnApprove}
              onClick={() => onSingleApproval(student.id, true)}
              title="اعتماد وقبول"
            >
              <Check size={13} />
            </button>
          )}

          {/* Quick Reject button */}
          {student.isApproved !== false && (
            <button
              type="button"
              className={styles.rowBtnReject}
              onClick={() => onSingleApproval(student.id, false)}
              title="رفض الطلب"
            >
              <X size={13} />
            </button>
          )}

          {/* WhatsApp Direct Action */}
          {student.phone && (
            <button
              type="button"
              onClick={handleWhatsAppSend}
              className={styles.rowBtnWhatsApp}
              title="إرسال رسالة واتساب"
            >
              <MessageCircle size={14} />
            </button>
          )}

          {/* Edit Button */}
          <button
            type="button"
            className={styles.rowBtnEdit}
            onClick={() => onOpenEdit(student)}
            title="تعديل البيانات"
          >
            <Edit2 size={13} />
          </button>

          {/* Delete Button */}
          <button
            type="button"
            className={styles.rowBtnDelete}
            onClick={() => onOpenDelete(student)}
            title="حذف المشارك"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default StudentRow;
