/** variablesConfig.js — Ma3ared schema: only name, phone, email */
export const AVAILABLE_VARIABLES = [
  { tag: "{name}",       label: "اسم المشارك",       iconName: "UserCheck", desc: "حسب الإعداد المختار" },
  { tag: "{firstName}",  label: "الاسم الأول فقط",   iconName: "Sparkles",  desc: "مثال: منة أو أحمد"  },
  { tag: "{fullName}",   label: "الاسم كاملاً",       iconName: "FileText",  desc: "الاسم كامل بدون أرقام" },
  { tag: "{phone}",      label: "رقم الهاتف",         iconName: "Phone",     desc: "رقم المشارك"         },
  { tag: "{email}",      label: "البريد الإلكتروني",  iconName: "Mail",      desc: "إيميل المشارك"       },
];
