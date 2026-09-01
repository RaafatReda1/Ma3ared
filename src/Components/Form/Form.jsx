import { useEffect, useState } from 'react'
import FormInputs from './Components/FormInputs/FormInputs'
import styles from './Form.module.css'
import { submitForm } from './Actions';
const Form = () => {
  const [form, setForm] = useState([]);
  const handleSubmit = async() => {
    await submitForm(form);
  }
  useEffect(() => {
    console.log(form);
  }, [form]);
  return (
    <form action="" className={styles.formContainer}>
        <FormInputs form={form} setForm={setForm}/>
        <button type="button" onClick= {handleSubmit}>احجز دلوقت</button>
    </form>
  )
}

export default Form