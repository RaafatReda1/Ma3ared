import React from "react";
import { User, Mail, Phone, CheckSquare } from "lucide-react";
import styles from "./FormInputs.module.css";

const FormInputs = ({ form, setForm, errors = {}, clearFieldError }) => {
  const inputs = [
    {
      label: "الاسم الثلاثي",
      type: "text",
      placeholder: "أحمد محمد علي",
      name: "name",
      icon: <User size={18} className={styles.inputIcon} />,
    },
    {
      label: "البريد الإلكتروني",
      type: "email",
      placeholder: "ahmed@example.com",
      name: "email",
      icon: <Mail size={18} className={styles.inputIcon} />,
    },
    {
      label: "رقم الهاتف (واتساب)",
      type: "tel",
      placeholder: "01012345678",
      name: "phone",
      icon: <Phone size={18} className={styles.inputIcon} />,
    },
  ];

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
    if (clearFieldError) {
      clearFieldError(name);
    }
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: checked,
    }));
  };

  return (
    <div className={styles.formInputsContainer}>
      {inputs.map((input) => {
        const hasError = Boolean(errors[input.name]);
        return (
          <div
            className={`${styles.formInputGroup} ${
              hasError ? styles.hasError : ""
            }`}
            key={input.name}
          >
            <label className={styles.inputLabel}>
              {input.label} <span className={styles.requiredStar}>*</span>
            </label>
            <div className={styles.inputWrapper}>
              {input.icon}
              <input
                type={input.type}
                placeholder={input.placeholder}
                name={input.name}
                value={form[input.name] || ""}
                onChange={handleInputChange}
                className={styles.textInput}
                autoComplete="off"
              />
            </div>
            {hasError && (
              <span className={styles.errorText}>{errors[input.name]}</span>
            )}
          </div>
        );
      })}

      {/* Checkbox field */}
      <div className={styles.checkboxGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="isFirstTime"
            checked={Boolean(form.isFirstTime)}
            onChange={handleCheckboxChange}
            className={styles.checkboxInput}
          />
          <span className={styles.checkboxCustom}>
            <CheckSquare size={16} />
          </span>
          <span className={styles.checkboxText}>
            أول مرة أحضر حفلة معارض مدينة نصر
          </span>
        </label>
      </div>
    </div>
  );
};

export default FormInputs;
