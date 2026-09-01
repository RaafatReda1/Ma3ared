import React, { useState } from "react";
import {
  Check,
  Clock,
  X,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import BulkActionBar from "./table/BulkActionBar";
import StudentRow from "./table/StudentRow";
import StudentDrawer from "./table/StudentDrawer";
import { generateCustomWhatsAppLink } from "@/utils/whatsAppTemplateManager";
import styles from "../AdminControls.module.css";

const StudentsTable = ({
  students = [],
  loading = false,
  selectedIds = [],
  whatsAppTemplate,
  whatsAppNameOptions,
  onToggleSelectAll,
  onToggleSelectOne,
  onOpenDetails,
  onOpenEdit,
  onOpenDelete,
  onSingleApproval,
  onBulkApproval,
  onOpenBulkDelete,
  sortBy,
  sortAsc,
  onSortChange,
}) => {
  const [expandedRowId, setExpandedRowId] = useState(null);

  const onToggleRowExpansion = (studentId) => {
    setExpandedRowId((prev) => (prev === studentId ? null : studentId));
  };

  const allSelected =
    students.length > 0 && selectedIds.length === students.length;

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

  const handleWhatsAppSend = (student) => {
    const whatsAppLink = generateCustomWhatsAppLink(
      student,
      whatsAppTemplate,
      whatsAppNameOptions
    );
    if (whatsAppLink) {
      window.open(whatsAppLink, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className={styles.tableCard}>
      {/* 1. Floating Bulk Actions Bar */}
      <BulkActionBar
        selectedCount={selectedIds.length}
        onBulkApproval={onBulkApproval}
        onOpenBulkDelete={onOpenBulkDelete}
      />

      {/* ── 2. Desktop Table View (>= 768px) ── */}
      <div className={styles.desktopTableView}>
        <div className={styles.tableResponsive}>
          <table className={styles.studentsTable}>
            <thead>
              <tr>
                <th style={{ width: "44px", textAlign: "center" }}>
                  <input
                    type="checkbox"
                    className={styles.rowCheckbox}
                    checked={allSelected}
                    onChange={onToggleSelectAll}
                  />
                </th>
                <th style={{ width: "36px" }} />
                <th>بيانات المشارك</th>
                <th
                  style={{ cursor: "pointer", userSelect: "none" }}
                  onClick={() => onSortChange("isFirstTime")}
                >
                  نوع الحضور {sortBy === "isFirstTime" ? (sortAsc ? "↑" : "↓") : ""}
                </th>
                <th
                  style={{ cursor: "pointer", userSelect: "none" }}
                  onClick={() => onSortChange("isApproved")}
                >
                  الحالة {sortBy === "isApproved" ? (sortAsc ? "↑" : "↓") : ""}
                </th>
                <th
                  style={{ cursor: "pointer", userSelect: "none" }}
                  onClick={() => onSortChange("created_at")}
                >
                  تاريخ التسجيل {sortBy === "created_at" ? (sortAsc ? "↑" : "↓") : ""}
                </th>
                <th style={{ textAlign: "center", width: "180px" }}>إجراءات</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "48px",
                      color: "var(--color-text-muted)",
                      fontWeight: 700,
                    }}
                  >
                    جاري تحميل بيانات المشاركين...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "48px",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    لا توجد نتائج مطابقة للتصفية الحالية
                  </td>
                </tr>
              ) : (
                students.map((student) => {
                  const isExpanded = expandedRowId === student.id;
                  return (
                    <React.Fragment key={student.id}>
                      <StudentRow
                        student={student}
                        isSelected={selectedIds.includes(student.id)}
                        isExpanded={isExpanded}
                        whatsAppTemplate={whatsAppTemplate}
                        whatsAppNameOptions={whatsAppNameOptions}
                        onToggleSelect={() => onToggleSelectOne(student.id)}
                        onToggleExpand={() => onToggleRowExpansion(student.id)}
                        onOpenDetails={onOpenDetails}
                        onOpenEdit={onOpenEdit}
                        onOpenDelete={onOpenDelete}
                        onSingleApproval={onSingleApproval}
                      />

                      {isExpanded && (
                        <tr>
                          <td colSpan="7" className={styles.drawerCell}>
                            <StudentDrawer
                              student={student}
                              whatsAppTemplate={whatsAppTemplate}
                              whatsAppNameOptions={whatsAppNameOptions}
                              onOpenDetails={onOpenDetails}
                              onOpenEdit={onOpenEdit}
                              onOpenDelete={onOpenDelete}
                              onSingleApproval={onSingleApproval}
                            />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 3. Mobile Card View (< 768px) ── */}
      <div className={styles.mobileCardsView}>
        {loading ? (
          <div className={styles.mobileLoadingBox}>جاري تحميل المشاركين...</div>
        ) : students.length === 0 ? (
          <div className={styles.mobileEmptyBox}>لا توجد نتائج مطابقة للتصفية الحالية</div>
        ) : (
          students.map((student) => {
            const isSelected = selectedIds.includes(student.id);
            const isExpanded = expandedRowId === student.id;

            return (
              <div
                key={student.id}
                className={`${styles.mobileStudentCard} ${isSelected ? styles.mobileCardSelected : ""} ${isExpanded ? styles.mobileCardExpanded : ""}`}
              >
                {/* 1. Header: Checkbox + Avatar + Name + Shield + Expand Toggle */}
                <div className={styles.mobileCardTopRow}>
                  <div className={styles.mobileCardIdentity}>
                    <input
                      type="checkbox"
                      className={styles.rowCheckbox}
                      checked={isSelected}
                      onChange={() => onToggleSelectOne(student.id)}
                    />
                    <div className={styles.studentAvatar}>
                      {(student.name || "م").charAt(0).toUpperCase()}
                    </div>
                    <div className={styles.mobileNameMeta}>
                      <div className={styles.nameRow}>
                        <span className={styles.studentNameText}>{student.name || "بدون اسم"}</span>
                        {student.user_id && (
                          <span className={styles.verifiedIcon} title="مسجل بحساب Google موثق">
                            <ShieldCheck size={14} className="text-sky-500" />
                          </span>
                        )}
                      </div>
                      <span className={styles.studentEmailText}>{student.email || "—"}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={styles.mobileExpandBtn}
                    onClick={() => onToggleRowExpansion(student.id)}
                    title={isExpanded ? "إغلاق التفاصيل" : "عرض التفاصيل"}
                  >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>

                {/* 2. Middle Row: Badges & Phone */}
                <div className={styles.mobileCardMiddleRow}>
                  <div className={styles.mobileBadgesList}>
                    {student.isFirstTime ? (
                      <span className={`${styles.badge} ${styles.badgeFirstTime}`}>
                        <Sparkles size={11} />
                        <span>أول مرة</span>
                      </span>
                    ) : (
                      <span className={`${styles.badge} ${styles.badgeReturning}`}>
                        <span>حضور سابق</span>
                      </span>
                    )}

                    {student.isApproved === true && (
                      <span className={`${styles.statusBadge} ${styles.statusApproved}`}>
                        <Check size={11} />
                        <span>معتمد</span>
                      </span>
                    )}
                    {student.isApproved === null && (
                      <span className={`${styles.statusBadge} ${styles.statusPending}`}>
                        <Clock size={11} />
                        <span>قيد المراجعة</span>
                      </span>
                    )}
                    {student.isApproved === false && (
                      <span className={`${styles.statusBadge} ${styles.statusRejected}`}>
                        <X size={11} />
                        <span>مرفوض</span>
                      </span>
                    )}
                  </div>

                  {student.phone && (
                    <span className={styles.studentPhoneText}>
                      <Phone size={11} />
                      <span>{student.phone}</span>
                    </span>
                  )}
                </div>

                {/* 3. Registration Date row */}
                <div className={styles.mobileCardDateRow}>
                  <span style={{ color: "#94a3b8", fontSize: "0.74rem" }}>تاريخ التسجيل:</span>
                  <span className={styles.dateText}>{formatDate(student.created_at)}</span>
                </div>

                {/* 4. Action Toolbar */}
                <div className={styles.mobileCardActionsRow}>
                  <div className={styles.mobileActionButtonsLeft}>
                    {student.isApproved !== true && (
                      <button
                        type="button"
                        className={styles.rowBtnApprove}
                        onClick={() => onSingleApproval(student.id, true)}
                        title="اعتماد وقبول"
                      >
                        <Check size={14} />
                      </button>
                    )}

                    {student.isApproved !== false && (
                      <button
                        type="button"
                        className={styles.rowBtnReject}
                        onClick={() => onSingleApproval(student.id, false)}
                        title="رفض الطلب"
                      >
                        <X size={14} />
                      </button>
                    )}

                    {student.phone && (
                      <button
                        type="button"
                        onClick={() => handleWhatsAppSend(student)}
                        className={styles.rowBtnWhatsApp}
                        title="إرسال رسالة واتساب"
                      >
                        <MessageCircle size={14} />
                      </button>
                    )}
                  </div>

                  <div className={styles.mobileActionButtonsRight}>
                    <button
                      type="button"
                      className={styles.rowBtnEdit}
                      onClick={() => onOpenEdit(student)}
                      title="تعديل البيانات"
                    >
                      <Edit2 size={13} />
                    </button>

                    <button
                      type="button"
                      className={styles.rowBtnDelete}
                      onClick={() => onOpenDelete(student)}
                      title="حذف المشارك"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* 5. Expanded Inline Drawer */}
                {isExpanded && (
                  <div className={styles.mobileDrawerContainer}>
                    <StudentDrawer
                      student={student}
                      whatsAppTemplate={whatsAppTemplate}
                      whatsAppNameOptions={whatsAppNameOptions}
                      onOpenDetails={onOpenDetails}
                      onOpenEdit={onOpenEdit}
                      onOpenDelete={onOpenDelete}
                      onSingleApproval={onSingleApproval}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StudentsTable;
