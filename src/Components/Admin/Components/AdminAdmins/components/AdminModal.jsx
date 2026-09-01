import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ShieldAlert,
  ShieldCheck,
  User,
  Mail,
  Phone,
  KeyRound,
  Check,
  Users,
} from "lucide-react";
import styles from "../AdminAdmins.module.css";

const AdminModal = ({
  isOpen = false,
  onClose,
  adminToEdit = null,
  googleUsers = [],
  onSave,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsAppMsg, setWhatsAppMsg] = useState("");
  const [sudo, setSudo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (adminToEdit) {
      setSelectedStudentId("");
      setSelectedUserId(adminToEdit.user_id || "");
      setName(adminToEdit.name || "");
      setEmail(adminToEdit.email || "");
      setPhone(adminToEdit.phone || "");
      setWhatsAppMsg(adminToEdit.whatsAppMsg || "");
      setSudo(Boolean(adminToEdit.sudo));
    } else {
      setSelectedStudentId("");
      setSelectedUserId("");
      setName("");
      setEmail("");
      setPhone("");
      setWhatsAppMsg("");
      setSudo(false);
    }
    setErrorMsg("");
  }, [adminToEdit, isOpen]);

  // Lock scroll while modal open
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const googleVerifiedUsers = googleUsers.filter((u) => Boolean(u.user_id));
  const otherRegisteredUsers = googleUsers.filter((u) => !u.user_id);

  const handleSelectStudent = (e) => {
    const studentId = e.target.value;
    setSelectedStudentId(studentId);

    if (!studentId) {
      setSelectedUserId("");
      return;
    }

    const found = googleUsers.find((u) => String(u.id) === String(studentId));
    if (found) {
      setSelectedUserId(found.user_id || "");
      setName(found.name || "");
      setEmail(found.email || "");
      setPhone(found.phone || "");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("يرجى إدخال اسم المسؤول");
      return;
    }
    if (!selectedUserId && !email.trim()) {
      setErrorMsg("يرجى اختيار مستخدم أو إدخال البريد الإلكتروني أو معرّف user_id");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        id: adminToEdit?.id,
        user_id: selectedUserId.trim() || null,
        name: name.trim(),
        email: email.trim() || null,
        phone: phone.trim() || null,
        whatsAppMsg: whatsAppMsg.trim() || null,
        sudo,
      });
      onClose();
    } catch (err) {
      setErrorMsg(err?.message || "حدث خطأ أثناء حفظ بيانات المسؤول");
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderTitleBox}>
            <div className={styles.modalIconBadge}>
              <ShieldAlert size={22} className="text-amber-500" />
            </div>
            <div>
              <h2 className={styles.modalTitle}>
                {adminToEdit ? "تعديل بيانات المسؤول" : "إضافة مسؤول جديد إلى لوحة التحكم"}
              </h2>
              <p className={styles.modalSubtitle}>
                {adminToEdit
                  ? "تعديل صلاحيات ومعلومات المسؤول الحالي"
                  : "اختر من المسجلين بحساب Google أو أضف معرف المستخدم مباشرة"}
              </p>
            </div>
          </div>

          <button type="button" className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className={styles.modalErrorBox}>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          {/* 1. Registered Users Quick Picker (Add mode only) */}
          {!adminToEdit && (
            <div className={styles.googlePickerBox}>
              <div className={styles.googlePickerHeader}>
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-sky-600" />
                  <span className="font-bold text-slate-800 text-sm">
                    اختر من المسجلين (تعبئة تلقائية للبيانات والمعرّف):
                  </span>
                </div>
                <span className={styles.googleUsersCountBadge}>
                  {googleUsers.length} مسجل
                </span>
              </div>

              <select
                className={styles.selectInput}
                value={selectedStudentId}
                onChange={handleSelectStudent}
              >
                <option value="">-- اختر مشارك مسجل لملء بياناته تلقائياً --</option>
                
                {googleVerifiedUsers.length > 0 && (
                  <optgroup label="✨ مسجلين بحساب Google موثق (يحتوي على user_id)">
                    {googleVerifiedUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name || "بدون اسم"} ({u.email || u.phone}) — موثق بـ Google ✅
                      </option>
                    ))}
                  </optgroup>
                )}

                {otherRegisteredUsers.length > 0 && (
                  <optgroup label="📋 باقي المسجلين بالاستمارة">
                    {otherRegisteredUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name || "بدون اسم"} ({u.email || u.phone})
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>
          )}

          {/* 2. User ID field (UUID) */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <KeyRound size={15} className="text-slate-400" />
              <span>معرّف المستخدم (user_id):</span>
            </label>
            <input
              type="text"
              className={styles.formInput}
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              placeholder="مثال: e4b2c123-4567-89ab-cdef-0123456789ab"
              style={{ direction: "ltr", fontFamily: "monospace" }}
            />
            <span className={styles.fieldHint}>
              معرّف حساب Google Auth المربوط بجدول auth.users (اختياري، يتم ملؤه تلقائياً عند اختيار حساب Google)
            </span>
          </div>

          {/* 3. Name & Email Row */}
          <div className={styles.twoColsRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <User size={15} className="text-slate-400" />
                <span>اسم المسؤول:</span>
              </label>
              <input
                type="text"
                className={styles.formInput}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="الاسم الكامل"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <Mail size={15} className="text-slate-400" />
                <span>البريد الإلكتروني:</span>
              </label>
              <input
                type="email"
                className={styles.formInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                style={{ direction: "ltr" }}
              />
            </div>
          </div>

          {/* 4. Phone */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <Phone size={15} className="text-slate-400" />
              <span>رقم الهاتف:</span>
            </label>
            <input
              type="tel"
              className={styles.formInput}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01012345678"
              style={{ direction: "ltr", textAlign: "right" }}
            />
          </div>

          {/* 5. Sudo Admin Privilege Switch */}
          <div className={`${styles.sudoToggleCard} ${sudo ? styles.sudoActive : ""}`}>
            <label className={styles.sudoToggleLabel}>
              <input
                type="checkbox"
                checked={sudo}
                onChange={(e) => setSudo(e.target.checked)}
                className={styles.sudoCheckbox}
              />
              <div className={styles.sudoTextCol}>
                <div className="flex items-center gap-2">
                  <ShieldAlert size={18} className={sudo ? "text-purple-600" : "text-slate-400"} />
                  <span className="font-bold text-slate-900 text-sm">
                    منح صلاحيات مسؤول رئيسي (Sudo Admin)
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  المسؤول الرئيسي يمتلك صلاحية إضافة وحذف المشرفين، مسح السجلات، وتعديل إعدادات النظام الحساسة
                </p>
              </div>
            </label>
          </div>

          {/* Modal Footer */}
          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.btnCancel}
              onClick={onClose}
              disabled={isSubmitting}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className={styles.btnSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span>جاري الحفظ...</span>
              ) : (
                <>
                  <Check size={16} />
                  <span>{adminToEdit ? "حفظ التعديلات" : "إضافة المسؤول الآن"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default AdminModal;
