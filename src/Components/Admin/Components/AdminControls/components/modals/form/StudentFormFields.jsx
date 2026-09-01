import React from "react";
import { User, Mail, Phone, Sparkles } from "lucide-react";
import styles from "../../../AdminControls.module.css";

const StudentFormFields = ({ formData, onChange }) => {
  return (
    <div className={styles.formFieldsGroup}>
      {/* Name */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          <User size={15} />
          <span>اسم المشارك الكامل *</span>
        </label>
        <input
          type="text"
          className={styles.formInput}
          placeholder="مثال: أحمد محمد علي"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          required
        />
      </div>

      {/* Email */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          <Mail size={15} />
          <span>البريد الإلكتروني *</span>
        </label>
        <input
          type="email"
          className={styles.formInput}
          placeholder="example@gmail.com"
          value={formData.email}
          onChange={(e) => onChange("email", e.target.value)}
          required
        />
      </div>

      {/* Phone */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          <Phone size={15} />
          <span>رقم الهاتف (واتساب) *</span>
        </label>
        <input
          type="tel"
          className={styles.formInput}
          placeholder="01012345678"
          value={formData.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          required
        />
      </div>

      {/* First Time Attending */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          <Sparkles size={15} />
          <span>هل يحضر فعاليات المعارض لأول مرة؟</span>
        </label>
        <select
          className={styles.formInput}
          value={formData.isFirstTime ? "true" : "false"}
          onChange={(e) => onChange("isFirstTime", e.target.value === "true")}
        >
          <option value="true">نعم، حضور لأول مرة ✦</option>
          <option value="false">لا، حضور سابق في فعاليات سابقة 🔄</option>
        </select>
      </div>
    </div>
  );
};

export default StudentFormFields;
