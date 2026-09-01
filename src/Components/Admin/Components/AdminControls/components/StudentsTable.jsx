import React, { useState } from "react";
import BulkActionBar from "./table/BulkActionBar";
import StudentRow from "./table/StudentRow";
import StudentDrawer from "./table/StudentDrawer";
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

  return (
    <div className={styles.tableCard}>
      {/* 1. Floating Bulk Actions Bar */}
      <BulkActionBar
        selectedCount={selectedIds.length}
        onBulkApproval={onBulkApproval}
        onOpenBulkDelete={onOpenBulkDelete}
      />

      {/* 2. Table Container */}
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
              {/* Expand toggle column */}
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
                    {/* Primary Row */}
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

                    {/* Expandable Accordion Drawer */}
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
  );
};

export default StudentsTable;
