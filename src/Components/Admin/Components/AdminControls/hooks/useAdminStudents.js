import { useState, useEffect, useCallback, useMemo } from "react";
import supabase from "@/utils/supabaseClient";
import {
  createStudentAdmin,
  updateStudentAdmin,
  setStudentApprovalStatus,
  bulkSetApprovalStatus,
  deleteStudentAdmin,
  bulkDeleteStudentsAdmin,
  exportStudentsToCSV,
} from "@/utils/adminStudentActions";
import { smartSearchMatch, smartPhoneMatch } from "@/utils/arabicSearch";
import {
  fetchAdminWhatsAppTemplate,
  saveAdminWhatsAppTemplate,
  DEFAULT_WHATSAPP_TEMPLATE,
} from "@/utils/whatsAppTemplateManager";
import { logActivity, ACTION_TYPES, ACTION_CATEGORIES } from "@/utils/activityLogger";

export const useAdminStudents = () => {
  // Master in-memory cache of all students
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters State
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all"); // "all" | "approved" | "pending" | "rejected"
  const [firstTimeFilter, setFirstTimeFilter] = useState("all"); // "all" | "first_time" | "returning"
  const [dayFilter, setDayFilter] = useState("all"); // "all" | "today" | "yesterday" | "YYYY-MM-DD"
  const [presetFilter, setPresetFilter] = useState("all"); // "all" | "pending" | "today" | "approved" | "rejected" | "first_time"

  // Pagination & Sorting
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortAsc, setSortAsc] = useState(false);

  // Selection & Row Expansion
  const [selectedIds, setSelectedIds] = useState([]);
  const [expandedRowId, setExpandedRowId] = useState(null);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [viewingStudent, setViewingStudent] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // WhatsApp Template State & Modal
  const [whatsAppTemplate, setWhatsAppTemplate] = useState(DEFAULT_WHATSAPP_TEMPLATE);
  const [whatsAppNameOptions, setWhatsAppNameOptions] = useState({
    nameMode: "full",
    autoArabic: true,
  });
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

  // Toast / notification feedback
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  // Load all students
  const loadAllStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("students")
        .select("id, name, phone, email, user_id, isApproved, isFirstTime, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAllStudents(data || []);
    } catch (err) {
      console.error("Failed to load students:", err);
      setError("حدث خطأ أثناء تحميل بيانات المسجلين. يرجى التحقق من الاتصال.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load WhatsApp Template
  useEffect(() => {
    loadAllStudents();
    fetchAdminWhatsAppTemplate().then((tpl) => {
      if (tpl) setWhatsAppTemplate(tpl);
    });
  }, [loadAllStudents]);

  // Dynamic unique registration days
  const uniqueRegistrationDays = useMemo(() => {
    const daySet = new Set();
    const todayStr = new Date().toISOString().split("T")[0];
    daySet.add(todayStr);

    allStudents.forEach((s) => {
      if (s.created_at) {
        const dayStr = s.created_at.split("T")[0];
        if (dayStr) daySet.add(dayStr);
      }
    });

    return Array.from(daySet).sort((a, b) => b.localeCompare(a));
  }, [allStudents]);

  // Compute preset filter counts
  const presetCounts = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];

    return {
      all: allStudents.length,
      pending: allStudents.filter((s) => s.isApproved === null).length,
      today: allStudents.filter((s) => s.created_at?.startsWith(todayStr)).length,
      approved: allStudents.filter((s) => s.isApproved === true).length,
      rejected: allStudents.filter((s) => s.isApproved === false).length,
      first_time: allStudents.filter((s) => s.isFirstTime === true).length,
    };
  }, [allStudents]);

  // Apply filters in-memory
  const filteredStudents = useMemo(() => {
    return allStudents.filter((student) => {
      // 1. Preset Filter
      if (presetFilter === "pending" && student.isApproved !== null) return false;
      if (presetFilter === "approved" && student.isApproved !== true) return false;
      if (presetFilter === "rejected" && student.isApproved !== false) return false;
      if (presetFilter === "first_time" && student.isFirstTime !== true) return false;
      if (presetFilter === "today") {
        const todayStr = new Date().toISOString().split("T")[0];
        if (!student.created_at?.startsWith(todayStr)) return false;
      }

      // 2. Status Dropdown Filter
      if (status === "approved" && student.isApproved !== true) return false;
      if (status === "pending" && student.isApproved !== null) return false;
      if (status === "rejected" && student.isApproved !== false) return false;

      // 3. First Time Filter
      if (firstTimeFilter === "first_time" && student.isFirstTime !== true) return false;
      if (firstTimeFilter === "returning" && student.isFirstTime !== false) return false;

      // 4. Day Filter
      if (dayFilter !== "all") {
        const studentDate = student.created_at ? student.created_at.split("T")[0] : null;
        if (dayFilter === "today") {
          const todayStr = new Date().toISOString().split("T")[0];
          if (studentDate !== todayStr) return false;
        } else if (dayFilter === "yesterday") {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split("T")[0];
          if (studentDate !== yesterdayStr) return false;
        } else {
          if (studentDate !== dayFilter) return false;
        }
      }

      // 5. Search
      if (search && search.trim()) {
        const term = search.trim();
        const matchName = smartSearchMatch(student.name, term);
        const matchEmail = (student.email || "").toLowerCase().includes(term.toLowerCase());
        const matchPhone = smartPhoneMatch(student.phone, term);

        if (!matchName && !matchEmail && !matchPhone) {
          return false;
        }
      }

      return true;
    });
  }, [allStudents, presetFilter, status, firstTimeFilter, dayFilter, search]);

  // Sorting
  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (valA === null || valA === undefined) valA = "";
      if (valB === null || valB === undefined) valB = "";

      if (typeof valA === "string") {
        return sortAsc ? valA.localeCompare(valB, "ar") : valB.localeCompare(valA, "ar");
      }
      return sortAsc ? (valA > valB ? 1 : -1) : valA < valB ? 1 : -1;
    });
  }, [filteredStudents, sortBy, sortAsc]);

  // Paginated View
  const paginatedStudents = useMemo(() => {
    const from = (page - 1) * pageSize;
    return sortedStudents.slice(from, from + pageSize);
  }, [sortedStudents, page, pageSize]);

  const totalPages = Math.ceil(sortedStudents.length / pageSize) || 1;

  // Single Approval Toggle with Activity Logging
  const handleSingleApproval = async (studentId, nextStatus) => {
    try {
      const student = allStudents.find((s) => s.id === studentId);
      await setStudentApprovalStatus(studentId, nextStatus);

      setAllStudents((prev) =>
        prev.map((s) => (s.id === studentId ? { ...s, isApproved: nextStatus } : s))
      );

      const statusArabic =
        nextStatus === true ? "اعتماد" : nextStatus === false ? "رفض" : "تعليق";
      showToast(`تم ${statusArabic} المشارك ${student?.name || ""} بنجاح`);

      const actionType =
        nextStatus === true
          ? ACTION_TYPES.APPROVE_STUDENT
          : nextStatus === false
          ? ACTION_TYPES.REJECT_STUDENT
          : ACTION_TYPES.PENDING_STUDENT;

      logActivity({
        action_type: actionType,
        action_category: ACTION_CATEGORIES.ADMIN_OPERATION,
        description: `تم ${statusArabic} طلب المشارك ${student?.name || ""}`,
        target_name: student?.name,
        metadata: { student_id: studentId, email: student?.email, status: nextStatus },
      });
    } catch (err) {
      console.error(err);
      showToast("حدث خطأ أثناء تحديث حالة المشارك");
    }
  };

  // Bulk Approval with Activity Logging
  const handleBulkApproval = async (nextStatus) => {
    if (selectedIds.length === 0) return;
    try {
      await bulkSetApprovalStatus(selectedIds, nextStatus);

      setAllStudents((prev) =>
        prev.map((s) => (selectedIds.includes(s.id) ? { ...s, isApproved: nextStatus } : s))
      );

      const statusArabic =
        nextStatus === true ? "اعتماد" : nextStatus === false ? "رفض" : "تعليق";
      showToast(`تم ${statusArabic} ${selectedIds.length} مشارك بنجاح`);

      logActivity({
        action_type: ACTION_TYPES.BULK_APPROVAL,
        action_category: ACTION_CATEGORIES.ADMIN_OPERATION,
        description: `تم ${statusArabic} عدد ${selectedIds.length} مشارك`,
        metadata: { count: selectedIds.length, status: nextStatus, ids: selectedIds },
      });

      setSelectedIds([]);
    } catch (err) {
      console.error(err);
      showToast("حدث خطأ أثناء التحديث الجماعي");
    }
  };

  // Single Delete with Activity Logging
  const handleDeleteStudent = async (studentId) => {
    try {
      const student = allStudents.find((s) => s.id === studentId);
      await deleteStudentAdmin(studentId);

      setAllStudents((prev) => prev.filter((s) => s.id !== studentId));
      setSelectedIds((prev) => prev.filter((id) => id !== studentId));
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);

      showToast(`تم حذف بيانات المشارك ${student?.name || ""} بنجاح`);

      logActivity({
        action_type: ACTION_TYPES.DELETE_STUDENT,
        action_category: ACTION_CATEGORIES.ADMIN_OPERATION,
        description: `تم حذف بيانات المشارك ${student?.name || ""}`,
        target_name: student?.name,
        metadata: { student_id: studentId, email: student?.email },
      });
    } catch (err) {
      console.error(err);
      showToast("حدث خطأ أثناء حذف المشارك");
    }
  };

  // Bulk Delete with Activity Logging
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await bulkDeleteStudentsAdmin(selectedIds);

      setAllStudents((prev) => prev.filter((s) => !selectedIds.includes(s.id)));
      showToast(`تم حذف ${selectedIds.length} مشارك بنجاح`);

      logActivity({
        action_type: ACTION_TYPES.BULK_DELETE,
        action_category: ACTION_CATEGORIES.ADMIN_OPERATION,
        description: `تم حذف عدد ${selectedIds.length} مشارك نهائياً`,
        metadata: { count: selectedIds.length, ids: selectedIds },
      });

      setSelectedIds([]);
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
    } catch (err) {
      console.error(err);
      showToast("حدث خطأ أثناء الحذف الجماعي");
    }
  };

  // Save / Create Student Form
  const handleSaveStudent = async (formData) => {
    try {
      if (editingStudent) {
        const updated = await updateStudentAdmin(editingStudent.id, formData);
        setAllStudents((prev) =>
          prev.map((s) => (s.id === editingStudent.id ? { ...s, ...updated } : s))
        );
        showToast("تم تحديث بيانات المشارك بنجاح");

        logActivity({
          action_type: ACTION_TYPES.EDIT_STUDENT,
          action_category: ACTION_CATEGORIES.ADMIN_OPERATION,
          description: `تم تعديل بيانات المشارك ${formData.name}`,
          target_name: formData.name,
          metadata: { student_id: editingStudent.id, updates: formData },
        });
      } else {
        const created = await createStudentAdmin(formData);
        setAllStudents((prev) => [created, ...prev]);
        showToast("تم تسجيل المشارك الجديد بنجاح");

        logActivity({
          action_type: ACTION_TYPES.CREATE_STUDENT,
          action_category: ACTION_CATEGORIES.ADMIN_OPERATION,
          description: `تم إضافة مشارك جديد يدوياً: ${formData.name}`,
          target_name: formData.name,
          metadata: { student_id: created.id, email: created.email },
        });
      }

      setIsFormModalOpen(false);
      setEditingStudent(null);
    } catch (err) {
      console.error(err);
      showToast("حدث خطأ أثناء حفظ البيانات");
      throw err;
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    exportStudentsToCSV(filteredStudents);
    logActivity({
      action_type: ACTION_TYPES.EXPORT_CSV,
      action_category: ACTION_CATEGORIES.ADMIN_OPERATION,
      description: `تم تصدير ملف CSV بعدد ${filteredStudents.length} مشارك`,
      metadata: { count: filteredStudents.length },
    });
  };

  // WhatsApp template save
  const handleSaveWhatsAppTemplate = async (newTemplate) => {
    try {
      await saveAdminWhatsAppTemplate(newTemplate);
      setWhatsAppTemplate(newTemplate);
      setIsWhatsAppModalOpen(false);
      showToast("تم حفظ قالب رسائل الواتساب بنجاح");

      logActivity({
        action_type: ACTION_TYPES.UPDATE_WHATSAPP_TEMPLATE,
        action_category: ACTION_CATEGORIES.SETTINGS,
        description: "تم تحديث قالب رسائل الواتساب للمشاركين",
      });
    } catch (err) {
      console.error(err);
      showToast("حدث خطأ أثناء حفظ القالب");
    }
  };

  // Select all toggles
  const handleToggleSelectAll = () => {
    if (selectedIds.length === paginatedStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedStudents.map((s) => s.id));
    }
  };

  const handleToggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatus("all");
    setFirstTimeFilter("all");
    setDayFilter("all");
    setPresetFilter("all");
    setPage(1);
  };

  return {
    students: paginatedStudents,
    allFilteredStudents: filteredStudents,
    totalCount: filteredStudents.length,
    loading,
    error,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    sortBy,
    setSortBy,
    sortAsc,
    setSortAsc,
    search,
    setSearch,
    status,
    setStatus,
    firstTimeFilter,
    setFirstTimeFilter,
    dayFilter,
    setDayFilter,
    presetFilter,
    setPresetFilter,
    uniqueRegistrationDays,
    presetCounts,
    selectedIds,
    expandedRowId,
    setExpandedRowId,
    isFormModalOpen,
    setIsFormModalOpen,
    editingStudent,
    setEditingStudent,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    viewingStudent,
    setViewingStudent,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    studentToDelete,
    setStudentToDelete,
    whatsAppTemplate,
    whatsAppNameOptions,
    setWhatsAppNameOptions,
    isWhatsAppModalOpen,
    setIsWhatsAppModalOpen,
    toastMsg,
    showToast,
    loadAllStudents,
    handleSingleApproval,
    handleBulkApproval,
    handleDeleteStudent,
    handleBulkDelete,
    handleSaveStudent,
    handleExportCSV,
    handleSaveWhatsAppTemplate,
    handleToggleSelectAll,
    handleToggleSelectOne,
    handleResetFilters,
  };
};
