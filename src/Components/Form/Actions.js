import { supabase } from "../../utils/Supabase";

export const validateForm = (form) => {
  const errors = {};

  // Name validation
  if (!form.name || form.name.trim().length < 3) {
    errors.name = "يرجى إدخال الاسم الثلاثي بشكل صحيح (3 حروف على الأقل)";
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email || !emailRegex.test(form.email.trim())) {
    errors.email = "يرجى إدخال بريد إلكتروني صحيح (example@domain.com)";
  }

  // Phone validation (Egyptian numbers: 010, 011, 012, 015 - 11 digits)
  const phoneRegex = /^01[0125][0-9]{8}$/;
  const cleanPhone = form.phone ? String(form.phone).trim() : "";
  if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
    errors.phone =
      "يرجى إدخال رقم هاتف مصري صحيح مكون من 11 رقم يبدأ بـ 010 أو 011 أو 012 أو 015";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const fetchUserDataByEmail = async (email) => {
  if (!email) return { success: false, data: null };

  try {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("email", email.trim())
      .order("id", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Fetch User Data Error:", error);
      return { success: false, error };
    }

    return { success: true, data: data?.[0] || null };
  } catch (err) {
    console.error("Fetch User Error:", err);
    return { success: false, error: err };
  }
};

export const updateUserData = async (id, form) => {
  const validation = validateForm(form);
  if (!validation.isValid) {
    return {
      success: false,
      validationError: true,
      errors: validation.errors,
      message: "الرجاء مراجعة البيانات المدخلة وتصحيح الأخطاء الموضحة.",
    };
  }

  try {
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: String(form.phone).trim(),
      isFirstTime: Boolean(form.isFirstTime),
    };

    const { data, error } = await supabase
      .from("students")
      .update(payload)
      .eq("id", id);

    if (error) {
      console.error("Supabase Update Error:", error);
      return {
        success: false,
        message: error.message || "حدث خطأ أثناء تحديث البيانات.",
      };
    }

    const updatedLocal = {
      ...payload,
      id,
      status: "تم تحديث البيانات",
      submittedAt: new Date().toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    localStorage.setItem("ma3ared_local_ticket", JSON.stringify(updatedLocal));

    return {
      success: true,
      data: updatedLocal,
      message: "تم تحديث بياناتك بنجاح!",
    };
  } catch (err) {
    console.error("Unexpected Update Error:", err);
    return {
      success: false,
      message: "حدث خطأ غير متوقع أثناء تحديث البيانات.",
    };
  }
};

export const submitForm = async (form) => {
  // Validate first
  const validation = validateForm(form);
  if (!validation.isValid) {
    return {
      success: false,
      validationError: true,
      errors: validation.errors,
      message: "الرجاء مراجعة البيانات المدخلة وتصحيح الأخطاء الموضحة.",
    };
  }

  try {
    // Check if email already exists in database
    const existing = await fetchUserDataByEmail(form.email);
    if (existing.success && existing.data) {
      return {
        success: false,
        duplicateEmail: true,
        existingData: existing.data,
        message:
          "هذا البريد الإلكتروني مسجل لدينا بالفعل! يسعدنا وجودك معنا، يمكنك تعديل بياناتك المسجلة مباشرة.",
      };
    }

    // Check current auth user
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id || null;

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: String(form.phone).trim(),
      isFirstTime: Boolean(form.isFirstTime),
      ...(userId && { user_id: userId }),
    };

    // Insert into Supabase 'students' table
    const { data, error } = await supabase.from("students").insert([payload]);

    if (error) {
      if (error.code === "23505" || error.message?.includes("duplicate")) {
        return {
          success: false,
          duplicateEmail: true,
          message: "هذا البريد الإلكتروني مسجل لدينا بالفعل!",
        };
      }

      console.error("Supabase RLS/Insertion Error:", error);
      return {
        success: false,
        supabaseError: true,
        error,
        message:
          error.message ||
          "حدث خطأ أثناء إرسال البيانات إلى السيرفر. يرجى المحاولة لاحقاً.",
      };
    }

    // Local ticket preview
    const localTicket = {
      ...payload,
      status: "قيد المراجعة والموافقة",
      submittedAt: new Date().toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Save local copy in localStorage
    localStorage.setItem("ma3ared_local_ticket", JSON.stringify(localTicket));

    return {
      success: true,
      data: localTicket,
      message: "تم حفظ حجزك بنجاح!",
    };
  } catch (err) {
    console.error("Unexpected submission error:", err);
    return {
      success: false,
      message: "حدث خطأ غير متوقع. يرجى إعادة المحاولة.",
    };
  }
};

export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      console.error("Google Auth Error:", error);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err) {
    console.error("Unexpected Auth Error:", err);
    return { success: false, error: err.message };
  }
};

export const signOutUser = async () => {
  try {
    await supabase.auth.signOut();
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const getLocalTicket = () => {
  try {
    const data = localStorage.getItem("ma3ared_local_ticket");
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};
