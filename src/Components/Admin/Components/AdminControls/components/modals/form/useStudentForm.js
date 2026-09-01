import { useState, useEffect } from "react";

export const useStudentForm = (student, isOpen, onSave, onClose) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    isFirstTime: true,
    isApproved: null,
  });

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || "",
        email: student.email || "",
        phone: student.phone || "",
        isFirstTime: student.isFirstTime !== undefined ? student.isFirstTime : true,
        isApproved: student.isApproved,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        isFirstTime: true,
        isApproved: null,
      });
    }
    setErr("");
  }, [student, isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      setErr("اسم المشارك مطلوب!");
      return;
    }
    if (!formData.email?.trim()) {
      setErr("البريد الإلكتروني مطلوب!");
      return;
    }
    if (!formData.phone?.trim()) {
      setErr("رقم الهاتف مطلوب!");
      return;
    }
    try {
      setSaving(true);
      setErr("");
      await onSave(formData);
    } catch (error) {
      console.error(error);
      setErr(error.message || "حدث خطأ أثناء حفظ البيانات");
    } finally {
      setSaving(false);
    }
  };

  return {
    formData,
    saving,
    err,
    handleChange,
    handleSubmit,
  };
};
