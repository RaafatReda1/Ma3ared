import React from "react";
import { useAdminStudents } from "./hooks/useAdminStudents";
import ControlsHeader from "./components/ControlsHeader";
import StudentsTable from "./components/StudentsTable";
import Pagination from "./components/Pagination";
import StudentFormModal from "./components/StudentFormModal";
import StudentDetailsModal from "./components/StudentDetailsModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import WhatsAppTemplateModal from "./components/modals/WhatsAppTemplateModal";
import styles from "./AdminControls.module.css";

const AdminControls = () => {
  const {
    students,
    allFilteredStudents,
    totalCount,
    totalPages,
    loading,
    error,
    page,
    setPage,
    pageSize,
    setPageSize,
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
    isWhatsAppModalOpen,
    setIsWhatsAppModalOpen,
    toastMsg,
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
  } = useAdminStudents();

  const handleSortToggle = (col) => {
    if (sortBy === col) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(col);
      setSortAsc(true);
    }
  };

  const handleOpenCreate = () => {
    setEditingStudent(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    setIsFormModalOpen(true);
  };

  const handleOpenDetails = (student) => {
    setViewingStudent(student);
    setIsDetailsModalOpen(true);
  };

  const handleOpenDelete = (student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const handleOpenBulkDelete = () => {
    setStudentToDelete(null);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (studentToDelete) {
      handleDeleteStudent(studentToDelete.id);
    } else {
      handleBulkDelete();
    }
  };

  return (
    <div className={styles.controlsContainer}>
      {/* Toast Notification */}
      {toastMsg && (
        <div className={styles.toastCard}>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header, Preset Filter Cards & Comprehensive Search Bar */}
      <ControlsHeader
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        firstTimeFilter={firstTimeFilter}
        onFirstTimeFilterChange={setFirstTimeFilter}
        dayFilter={dayFilter}
        onDayFilterChange={setDayFilter}
        uniqueRegistrationDays={uniqueRegistrationDays}
        presetFilter={presetFilter}
        onSelectPreset={setPresetFilter}
        presetCounts={presetCounts}
        onResetFilters={handleResetFilters}
        onOpenCreate={handleOpenCreate}
        onOpenWhatsAppSettings={() => setIsWhatsAppModalOpen(true)}
        onRefresh={loadAllStudents}
        loading={loading}
        studentsToExport={allFilteredStudents}
      />

      {/* Error banner */}
      {error && (
        <div className={styles.errorCard}>
          <span>{error}</span>
        </div>
      )}

      {/* Students Table */}
      <StudentsTable
        students={students}
        loading={loading}
        selectedIds={selectedIds}
        whatsAppTemplate={whatsAppTemplate}
        whatsAppNameOptions={whatsAppNameOptions}
        onToggleSelectAll={handleToggleSelectAll}
        onToggleSelectOne={handleToggleSelectOne}
        onOpenDetails={handleOpenDetails}
        onOpenEdit={handleOpenEdit}
        onOpenDelete={handleOpenDelete}
        onSingleApproval={handleSingleApproval}
        onBulkApproval={handleBulkApproval}
        onOpenBulkDelete={handleOpenBulkDelete}
        sortBy={sortBy}
        sortAsc={sortAsc}
        onSortChange={handleSortToggle}
      />

      {/* Pagination Controls */}
      <Pagination
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      {/* WhatsApp Template Customization Modal */}
      <WhatsAppTemplateModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        template={whatsAppTemplate}
        onSaveTemplate={handleSaveWhatsAppTemplate}
      />

      {/* Create / Edit Modal */}
      <StudentFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        student={editingStudent}
        onSave={handleSaveStudent}
      />

      {/* View Details Modal */}
      <StudentDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        student={viewingStudent}
        whatsAppTemplate={whatsAppTemplate}
        whatsAppNameOptions={whatsAppNameOptions}
        onApprovalChange={handleSingleApproval}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        student={studentToDelete}
        selectedCount={selectedIds.length}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default AdminControls;