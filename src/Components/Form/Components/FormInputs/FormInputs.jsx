import React from "react";
import styles from "./FormInputs.module.css";
const FormInputs = ({ form, setForm }) => {
  const inputs = [
    {
      label: "الاسم",
      type: "text",
      placeholder: "احمد محمد علي",
      name: "name",
    },
    {
      label: "الايميل",
      type: "email",
      placeholder: "ahmed@example.com",
      name: "email",
    },
    {
      label: "رقم الهاتف",
      type: "number",
      placeholder: "01012345678",
      name: "phone",
    },
    {
      label: "اول مره احضر حفلة معارض مدينة نصر",
      type: "checkbox",
      name: "isFirstTime",
    },
  ];

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
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
      {inputs.map((input, index) => (
        <div className={styles.formInput} key={index}>
          <label>{input.label}</label>
          <input
            type={input.type}
            placeholder={input.placeholder}
            name={input.name}
            onChange={
              input.type === "checkbox"
                ? handleCheckboxChange
                : handleInputChange
            }
          />
        </div>
      ))}
    </div>
  );
};

export default FormInputs;
