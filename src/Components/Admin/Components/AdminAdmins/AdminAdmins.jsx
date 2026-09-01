import React, { useState, useEffect, useCallback } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  UserPlus,
  RefreshCw,
  Search,
  User,
  Mail,
  Phone,
  KeyRound,
  Edit2,
  Trash2,
  Copy,
  Check,
  Calendar,
  AlertCircle,
} from "lucide-react";
import {
  fetchAllAdmins,
  fetchGoogleSignedUsers,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from "@/utils/adminManagementActions";
import { getAdminProfile } from "@/utils/activityLogger";
import AdminModal from "./components/AdminModal";
import styles from "./AdminAdmins.module.css";

const AdminAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [googleUsers, setGoogleUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentProfile, setCurrentProfile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [adminsData, usersData, profile] = await Promise.all([
        fetchAllAdmins(),
        fetchGoogleSignedUsers(),
        getAdminProfile(true),
      ]);

      setAdmins(adminsData);
      setGoogleUsers(usersData);
      setCurrentProfile(profile);
    } catch (err) {
      console.error("Error loading admins data:", err);
      setError(err?.message || "خطأ في تحميل بيانات المسؤولين");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCopy = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveAdmin = async (adminData) => {
    if (adminData.id) {
      await updateAdmin(adminData.id, adminData);
      showToast("تم تحديث بيانات المسؤول بنجاح");
    } else {
      await createAdmin(adminData);
      showToast("تمت إضافة المسؤول الجديد بنجاح");
    }
    await loadData();
  };

  const handleDeleteAdmin = async () => {
    if (!adminToDelete) return;
    try {
      await deleteAdmin(adminToDelete.id, adminToDelete.name);
      showToast(`تم حذف المسؤول (${adminToDelete.name}) بنجاح`);
      setAdminToDelete(null);
      await loadData();
    } catch (err) {
      showToast(err?.message || "خطأ أثناء حذف المسؤول");
    }
  };

  // Filter admins
  const filteredAdmins = admins.filter((a) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      (a.name && a.name.toLowerCase().includes(q)) ||
      (a.email && a.email.toLowerCase().includes(q)) ||
      (a.phone && a.phone.includes(q)) ||
      (a.user_id && a.user_id.toLowerCase().includes(q))
    );
  });

  const sudoCount = admins.filter((a) => a.sudo).length;
  const verifiedCount = admins.filter((a) => a.user_id).length;

  return (
    <div className={styles.adminsContainer}>
      {/* Toast Notification */}
      {toastMsg && (
        <div className={styles.toastCard}>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ── 1. Header ── */}
      <div className={styles.headerRow}>
        <div className={styles.titleBlock}>
          <div className="flex items-center gap-3">
            <h1 className={styles.mainTitle}>
              <ShieldAlert size={28} className="text-purple-600" />
              <span>إدارة المسؤولين والمشرفين</span>
            </h1>
            <span className={styles.sudoBadgeHeader}>
              <ShieldCheck size={14} />
              <span>صلاحيات Sudo Admin</span>
            </span>
          </div>
          <p className={styles.subtitle}>
            إضافة وتعيين المسؤولين عن طريق اختيار حسابات Google الموثقة ومنح الصلاحيات
          </p>
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={loadData}
            disabled={loading}
            title="تحديث البيانات"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span>تحديث</span>
          </button>

          <button
            type="button"
            className={styles.btnPrimary}
            onClick={() => {
              setEditingAdmin(null);
              setIsModalOpen(true);
            }}
          >
            <UserPlus size={16} />
            <span>إضافة مسؤول جديد</span>
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className={styles.errorCard}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* ── 2. Stats Bar ── */}
      <div className={styles.statsBar}>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>إجمالي المسؤولين</span>
          <span className={styles.statVal} style={{ color: "#7c3aed" }}>
            {admins.length}
          </span>
        </div>

        <div className={styles.statBox}>
          <span className={styles.statLabel}>مسؤولين رئيسيين (Sudo)</span>
          <span className={styles.statVal} style={{ color: "#df9c4c" }}>
            {sudoCount}
          </span>
        </div>

        <div className={styles.statBox}>
          <span className={styles.statLabel}>موثقين بحساب Google</span>
          <span className={styles.statVal} style={{ color: "#0284c7" }}>
            {verifiedCount}
          </span>
        </div>

        <div className={styles.statBox}>
          <span className={styles.statLabel}>مستخدمي Google المتاحين</span>
          <span className={styles.statVal} style={{ color: "#10b981" }}>
            {googleUsers.length}
          </span>
        </div>
      </div>

      {/* ── 3. Search Bar ── */}
      <div className={styles.searchBarCard}>
        <div className={styles.searchWrap}>
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="بحث بالاسم، البريد الإلكتروني، رقم الهاتف، أو معرف user_id..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── 4. Admins Grid ── */}
      <div className={styles.adminsGrid}>
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className={styles.skeletonCard} style={{ height: 190 }} />
          ))
        ) : filteredAdmins.length === 0 ? (
          <div className={styles.emptyBox}>
            <ShieldAlert size={36} className="text-slate-300 mb-2" />
            <p className="font-bold text-slate-700">لا يوجد مسؤولين مطابقين لشروط البحث</p>
          </div>
        ) : (
          filteredAdmins.map((admin) => {
            const isCurrentUser = currentProfile?.id === admin.id;

            return (
              <div
                key={admin.id}
                className={`${styles.adminCard} ${admin.sudo ? styles.sudoCard : ""}`}
              >
                {/* Top Row: Avatar + Role Badge */}
                <div className={styles.cardTopRow}>
                  <div className={styles.avatarWrap}>
                    <div className={admin.sudo ? styles.sudoAvatar : styles.adminAvatar}>
                      {(admin.name || "م").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={styles.adminNameText}>{admin.name || "مسؤول"}</span>
                        {isCurrentUser && (
                          <span className={styles.currentAdminBadge}>(أنت)</span>
                        )}
                      </div>
                      <span className={styles.adminEmailText}>{admin.email || "—"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {admin.sudo ? (
                      <span className={styles.sudoBadge}>
                        <ShieldAlert size={12} />
                        <span>مسؤول رئيسي</span>
                      </span>
                    ) : (
                      <span className={styles.normalAdminBadge}>
                        <User size={12} />
                        <span>مشرف</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Details list */}
                <div className={styles.cardDetailsBox}>
                  {admin.phone && (
                    <div className={styles.cardDetailItem}>
                      <Phone size={13} className="text-emerald-600" />
                      <span style={{ direction: "ltr", fontFamily: "monospace" }}>
                        {admin.phone}
                      </span>
                    </div>
                  )}

                  {admin.user_id && (
                    <div className={styles.cardDetailItem}>
                      <KeyRound size={13} className="text-sky-600" />
                      <span
                        className={styles.monoIdText}
                        title={`User UUID: ${admin.user_id}`}
                      >
                        {admin.user_id}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(admin.user_id, admin.id)}
                        className={styles.copyBtn}
                        title="نسخ المعرف"
                      >
                        {copiedId === admin.id ? <Check size={11} /> : <Copy size={11} />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className={styles.cardActionsRow}>
                  <span className={styles.createdDateText}>
                    <Calendar size={12} />
                    <span>
                      {new Date(admin.created_at).toLocaleDateString("ar-EG", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className={styles.btnActionEdit}
                      onClick={() => {
                        setEditingAdmin(admin);
                        setIsModalOpen(true);
                      }}
                      title="تعديل بيانات المسؤول"
                    >
                      <Edit2 size={14} />
                      <span>تعديل</span>
                    </button>

                    <button
                      type="button"
                      className={styles.btnActionDelete}
                      onClick={() => setAdminToDelete(admin)}
                      disabled={isCurrentUser}
                      title={
                        isCurrentUser
                          ? "لا يمكنك حذف حسابك الحالي"
                          : "حذف المسؤول من النظام"
                      }
                    >
                      <Trash2 size={14} />
                      <span>حذف</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── 5. Add / Edit Admin Modal ── */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        adminToEdit={editingAdmin}
        googleUsers={googleUsers}
        onSave={handleSaveAdmin}
      />

      {/* ── 6. Delete Confirmation Modal ── */}
      {adminToDelete && (
        <div className={styles.modalOverlay} onClick={() => setAdminToDelete(null)}>
          <div
            className={styles.deleteConfirmCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.deleteWarningIcon}>
              <Trash2 size={26} />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">
              تأكيد حذف المسؤول
            </h3>
            <p className="text-sm text-slate-600 my-2 leading-relaxed">
              هل أنت متأكد من رغبتك في حذف المسؤول{" "}
              <strong className="text-slate-900">({adminToDelete.name})</strong>؟ لن
              يتمكن هذا الحساب من الدخول إلى لوحة التحكم بعد الحذف.
            </p>

            <div className="flex gap-3 justify-end mt-4">
              <button
                type="button"
                className={styles.btnCancel}
                onClick={() => setAdminToDelete(null)}
              >
                إلغاء
              </button>
              <button
                type="button"
                className={styles.btnConfirmDelete}
                onClick={handleDeleteAdmin}
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAdmins;
