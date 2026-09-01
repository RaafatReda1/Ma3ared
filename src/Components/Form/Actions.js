import { supabase } from "../../utils/Supabase";

export const submitForm = async(form) => {
    const {data, error} = await supabase.from('students').insert(form);
    if (error) console.log(error);
    else console.log("Form submitted",data);
}