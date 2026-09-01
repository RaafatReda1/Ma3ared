import supabase from "./supabaseClient";
import { logActivity, getAdminProfile } from "./activityLogger";

/**
 * Fetch all admins from public.admins
 */
export async function fetchAllAdmins() {
  const { data, error } = await supabase
    .from("admins")
    .select("*")
    .order("sudo", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching admins:", error);
    throw error;
  }
  return data || [];
}

/**
 * Fetch all registered students (both Google-signed and form-registered)
 * to allow Sudo Admin to promote any participant to Admin
 */
export async function fetchGoogleSignedUsers() {
  const { data, error } = await supabase
    .from("students")
    .select("id, name, email, phone, user_id, isApproved, created_at")
    .order("user_id", { nullsFirst: false, ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users for admin:", error);
    throw error;
  }
  return data || [];
}


/**
 * Add a new admin to public.admins
 */
export async function createAdmin({ user_id, name, email, phone, whatsAppMsg = null, sudo = false }) {
  if (!user_id && !email) {
    throw new Error("يجب تحديد المستخدم أو البريد الإلكتروني");
  }

  // Check if admin already exists with this user_id or email
  if (user_id) {
    const { data: existing } = await supabase
      .from("admins")
      .select("id")
      .eq("user_id", user_id)
      .maybeSingle();

    if (existing) {
      throw new Error("هذا المستخدم مضاف بالفعل كمسؤول في النظام");
    }
  }

  const payload = {
    user_id: user_id || null,
    name: name?.trim() || "مسؤول جديد",
    email: email?.trim() || null,
    phone: phone?.trim() || null,
    whatsAppMsg: whatsAppMsg?.trim() || null,
    sudo: Boolean(sudo),
  };

  const { data, error } = await supabase
    .from("admins")
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error("Error creating admin:", error);
    throw error;
  }

  // Log activity
  const currentAdmin = await getAdminProfile();
  if (currentAdmin) {
    await logActivity({
      action_type: "create_admin",
      action_category: "admin_operation",
      description: `إضافة مسؤول جديد (${payload.name} - ${payload.email || "بدون إيميل"}) بصلاحية ${payload.sudo ? "مسؤول رئيسي Sudo" : "مشرف"}`,
      target_id: data.id,
      target_name: payload.name,
      actorOverride: {
        id: currentAdmin.user_id,
        email: currentAdmin.email,
        name: currentAdmin.name,
        role: "sudo_admin",
      },
    });
  }

  return data;
}

/**
 * Update an existing admin record in public.admins
 */
export async function updateAdmin(id, { name, email, phone, whatsAppMsg, sudo }) {
  const payload = {
    name: name?.trim(),
    email: email?.trim() || null,
    phone: phone?.trim() || null,
    whatsAppMsg: whatsAppMsg?.trim() || null,
    sudo: Boolean(sudo),
  };

  const { data, error } = await supabase
    .from("admins")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating admin:", error);
    throw error;
  }

  // Log activity
  const currentAdmin = await getAdminProfile();
  if (currentAdmin) {
    await logActivity({
      action_type: "update_admin",
      action_category: "admin_operation",
      description: `تعديل بيانات المسؤول (${payload.name})`,
      target_id: id,
      target_name: payload.name,
      actorOverride: {
        id: currentAdmin.user_id,
        email: currentAdmin.email,
        name: currentAdmin.name,
        role: "sudo_admin",
      },
    });
  }

  return data;
}

/**
 * Delete an admin record from public.admins
 */
export async function deleteAdmin(adminId, adminName) {
  const currentAdmin = await getAdminProfile();
  if (currentAdmin && currentAdmin.id === adminId) {
    throw new Error("لا يمكنك حذف حساب المسؤول الحالي الذي تستخدمه لتسجيل الدخول");
  }

  const { error } = await supabase
    .from("admins")
    .delete()
    .eq("id", adminId);

  if (error) {
    console.error("Error deleting admin:", error);
    throw error;
  }

  // Log activity
  if (currentAdmin) {
    await logActivity({
      action_type: "delete_admin",
      action_category: "admin_operation",
      description: `حذف المسؤول (${adminName || adminId}) من النظام`,
      target_id: adminId,
      target_name: adminName,
      actorOverride: {
        id: currentAdmin.user_id,
        email: currentAdmin.email,
        name: currentAdmin.name,
        role: "sudo_admin",
      },
    });
  }

  return true;
}
