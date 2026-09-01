import supabase from "./supabaseClient";

/**
 * Fetch students with search, filters, pagination, and sorting for Ma3ared
 */
export const fetchStudentsWithFilters = async ({
  search = "",
  status = "all", // "all" | "approved" | "pending" | "rejected"
  firstTime = "all", // "all" | "first_time" | "returning"
  page = 1,
  pageSize = 10,
  sortBy = "created_at",
  sortAsc = false,
}) => {
  try {
    let query = supabase
      .from("students")
      .select("id, name, phone, email, user_id, isApproved, isFirstTime, created_at", {
        count: "exact",
      });

    // 1. Status Filter
    if (status === "approved") {
      query = query.eq("isApproved", true);
    } else if (status === "pending") {
      query = query.is("isApproved", null);
    } else if (status === "rejected") {
      query = query.eq("isApproved", false);
    }

    // 2. First Time Filter
    if (firstTime === "first_time") {
      query = query.eq("isFirstTime", true);
    } else if (firstTime === "returning") {
      query = query.eq("isFirstTime", false);
    }

    // 3. Search Filter (Name, Email, Phone)
    if (search && search.trim()) {
      const term = search.trim();
      query = query.or(
        `name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`
      );
    }

    // 4. Sorting
    query = query.order(sortBy, { ascending: sortAsc });

    // 5. Pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;
    if (error) throw error;

    return {
      students: data || [],
      totalCount: count || 0,
      totalPages: Math.ceil((count || 0) / pageSize),
    };
  } catch (err) {
    console.error("fetchStudentsWithFilters error:", err);
    throw err;
  }
};

/**
 * Create a new student (Admin manual registration)
 */
export const createStudentAdmin = async (studentData) => {
  const payload = {
    name: studentData.name?.trim() || null,
    email: studentData.email?.trim().toLowerCase(),
    phone: studentData.phone?.trim() || null,
    isFirstTime: studentData.isFirstTime !== undefined ? Boolean(studentData.isFirstTime) : true,
    isApproved: studentData.isApproved !== undefined ? studentData.isApproved : null,
  };

  const { data, error } = await supabase
    .from("students")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Update an existing student record
 */
export const updateStudentAdmin = async (id, updates) => {
  const payload = {};
  if (updates.name !== undefined) payload.name = updates.name?.trim() || null;
  if (updates.email !== undefined) payload.email = updates.email?.trim().toLowerCase();
  if (updates.phone !== undefined) payload.phone = updates.phone?.trim() || null;
  if (updates.isFirstTime !== undefined) payload.isFirstTime = Boolean(updates.isFirstTime);
  if (updates.isApproved !== undefined) payload.isApproved = updates.isApproved;

  const { data, error } = await supabase
    .from("students")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Set single student approval status (true | false | null)
 */
export const setStudentApprovalStatus = async (id, isApproved) => {
  const { data, error } = await supabase
    .from("students")
    .update({ isApproved })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Bulk update approval status for multiple student IDs
 */
export const bulkSetApprovalStatus = async (ids, isApproved) => {
  if (!ids || ids.length === 0) return [];

  const { data, error } = await supabase
    .from("students")
    .update({ isApproved })
    .in("id", ids)
    .select();

  if (error) throw error;
  return data;
};

/**
 * Delete a student record by ID
 */
export const deleteStudentAdmin = async (id) => {
  const { error } = await supabase
    .from("students")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
};

/**
 * Bulk delete students by an array of IDs
 */
export const bulkDeleteStudentsAdmin = async (ids) => {
  if (!ids || ids.length === 0) return true;

  const { error } = await supabase
    .from("students")
    .delete()
    .in("id", ids);

  if (error) throw error;
  return true;
};

/**
 * Format Egyptian/International phone number for WhatsApp
 */
export const formatWhatsAppNumber = (phone) => {
  if (!phone) return "";
  let clean = phone.replace(/[^\d+]/g, "");
  // If starts with 01 (Egyptian mobile), prepend country code 2
  if (clean.startsWith("01")) {
    clean = "2" + clean;
  } else if (clean.startsWith("+")) {
    clean = clean.substring(1);
  }
  return clean;
};

/**
 * Generate official WhatsApp approval link for Ma3ared
 */
export const generateWhatsAppApprovalLink = (student) => {
  const phone = formatWhatsAppNumber(student?.phone);
  if (!phone) return null;

  const studentName = student.name || "مشاركنا العزيز";

  const message = `مرحباً ${studentName}،
يسعدنا إبلاغك باعتماد طلب مشاركتك في حفلة معارض مدينة نصر 2026!

📍 الموعد: الجمعة 4 سبتمبر 2026 - الساعة 01:00 ظهرًا
نتطلع لرؤيتك ونتمنى لك يوماً رائعاً معنا! ✨
فريق معارض مدينة نصر`;

  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(
    message
  )}`;
};

/**
 * Export all students to CSV formatted data
 */
export const exportStudentsToCSV = (students) => {
  const headers = ["الاسم", "البريد الإلكتروني", "رقم الهاتف", "حضور لأول مرة", "حالة القبول", "تاريخ التسجيل"];

  const rows = students.map((s) => [
    `"${(s.name || "").replace(/"/g, '""')}"`,
    `"${(s.email || "").replace(/"/g, '""')}"`,
    `"${(s.phone || "").replace(/"/g, '""')}"`,
    s.isFirstTime ? '"نعم (أول مرة)"' : '"حضور سابق"',
    s.isApproved === true ? '"معتمد"' : s.isApproved === false ? '"مرفوض"' : '"قيد المراجعة"',
    `"${new Date(s.created_at).toLocaleString("ar-EG")}"`,
  ]);

  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `ma3ared_participants_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

