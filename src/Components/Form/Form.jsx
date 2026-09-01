import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Ticket,
  Sparkles,
  CheckCircle,
  Clock,
  ShieldCheck,
  Edit3,
  Save,
  UserCheck,
  RefreshCw,
  XCircle,
  ArrowLeft,
} from 'lucide-react';
import FormInputs from './Components/FormInputs/FormInputs';
import {
  submitForm,
  signInWithGoogle,
  getLocalTicket,
  fetchUserDataByEmail,
  updateUserData,
} from './Actions';
import { supabase } from '../../utils/Supabase';
import PopupModal from '../PopupModal/PopupModal';
import styles from './Form.module.css';

gsap.registerPlugin(ScrollTrigger);

export const Form = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    isFirstTime: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localTicket, setLocalTicket] = useState(null);

  // Auth User & DB Record link state
  const [authUser, setAuthUser] = useState(null);
  const [dbRecord, setDbRecord] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Popup Modal State
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    details: null,
  });

  const sectionRef = useRef(null);
  const formCardRef = useRef(null);

  // Check auth user & fetch matching DB entry by email
  useEffect(() => {
    const initUserData = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const currentUser = authData?.user;

      if (currentUser) {
        setAuthUser(currentUser);
        // Look for user email in database
        const res = await fetchUserDataByEmail(currentUser.email);
        if (res.success && res.data) {
          setDbRecord(res.data);
          setForm({
            name: res.data.name || '',
            email: res.data.email || '',
            phone: res.data.phone || '',
            isFirstTime: Boolean(res.data.isFirstTime),
          });
        } else {
          // Prepopulate with Google profile info for new registration
          setForm((prev) => ({
            ...prev,
            name: currentUser.user_metadata?.full_name || prev.name,
            email: currentUser.email || prev.email,
          }));
        }
      } else {
        setAuthUser(null);
        setDbRecord(null);
        setIsEditing(false);
        const existingTicket = getLocalTicket();
        if (existingTicket) {
          setLocalTicket(existingTicket);
        }
      }
    };

    initUserData();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user;
        if (currentUser) {
          setAuthUser(currentUser);
          const res = await fetchUserDataByEmail(currentUser.email);
          if (res.success && res.data) {
            setDbRecord(res.data);
            setForm({
              name: res.data.name || '',
              email: res.data.email || '',
              phone: res.data.phone || '',
              isFirstTime: Boolean(res.data.isFirstTime),
            });
          }
        } else {
          setAuthUser(null);
          setDbRecord(null);
          setIsEditing(false);
        }
      }
    );

    return () => authListener?.subscription?.unsubscribe();
  }, []);

  // GSAP entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (formCardRef.current) {
        gsap.fromTo(
          formCardRef.current,
          { y: 60, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const clearFieldError = (fieldName) => {
    if (errors[fieldName]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[fieldName];
        return updated;
      });
    }
  };

  const handleFormSubmit = async (e) => {
    if (e) e.preventDefault();

    setIsSubmitting(true);

    const activeRecordId = dbRecord?.id || localTicket?.id;

    if ((isEditing || dbRecord) && activeRecordId) {
      // Update existing record in Supabase
      const updateRes = await updateUserData(activeRecordId, form);
      setIsSubmitting(false);

      if (!updateRes.success) {
        if (updateRes.validationError) {
          setErrors(updateRes.errors);
        }
        setModalState({
          isOpen: true,
          type: 'error',
          title: 'تعذر تحديث البيانات',
          message: updateRes.message,
        });
        return;
      }

      setErrors({});
      setDbRecord((prev) => ({ ...prev, ...form }));
      setIsEditing(false);
      setModalState({
        isOpen: true,
        type: 'success',
        title: 'تم تحديث بياناتك بنجاح! ✦',
        message: 'تم حفظ وتحديث جميع البيانات المعدلة في قاعدة البيانات مباشرة.',
        details: (
          <>
            <div className={styles.modalDetailRow}>
              <span className={styles.modalDetailLabel}>الاسم الثلاثي:</span>
              <span className={styles.modalDetailVal}>{form.name}</span>
            </div>
            <div className={styles.modalDetailRow}>
              <span className={styles.modalDetailLabel}>البريد الإلكتروني:</span>
              <span className={styles.modalDetailVal}>{form.email}</span>
            </div>
            <div className={styles.modalDetailRow}>
              <span className={styles.modalDetailLabel}>رقم الهاتف:</span>
              <span className={styles.modalDetailVal}>{form.phone}</span>
            </div>
          </>
        ),
      });
      return;
    }

    // New submission
    const result = await submitForm(form);
    setIsSubmitting(false);

    if (!result.success) {
      if (result.duplicateEmail) {
        if (result.existingData) {
          setDbRecord(result.existingData);
          setForm({
            name: result.existingData.name || form.name,
            email: result.existingData.email || form.email,
            phone: result.existingData.phone || form.phone,
            isFirstTime: Boolean(result.existingData.isFirstTime),
          });
        }
        setModalState({
          isOpen: true,
          type: 'info',
          title: 'البريد الإلكتروني مسجل بالفعل',
          message: result.message,
          actionButton: (
            <button
              className={styles.modalActionBtn}
              onClick={() => {
                setModalState((prev) => ({ ...prev, isOpen: false }));
                setIsEditing(true);
              }}
            >
              الانتقال لتعديل البيانات
            </button>
          ),
        });
        return;
      }

      if (result.validationError) {
        setErrors(result.errors);
        setModalState({
          isOpen: true,
          type: 'error',
          title: 'خطأ في البيانات المدخلة',
          message: result.message,
        });
      } else {
        setModalState({
          isOpen: true,
          type: 'error',
          title: 'تعذر إرسال الحجز',
          message: result.message,
        });
      }
      return;
    }

    // Success!
    setErrors({});
    setLocalTicket(result.data);
    setModalState({
      isOpen: true,
      type: 'success',
      title: 'تم إرسال حجزك بنجاح! ✦',
      message: 'تم حفظ بياناتك بنجاح وهي الآن بانتظار مراجعة الإدارة والموافقة.',
      details: (
        <>
          <div className={styles.modalDetailRow}>
            <span className={styles.modalDetailLabel}>الاسم:</span>
            <span className={styles.modalDetailVal}>{result.data.name}</span>
          </div>
          <div className={styles.modalDetailRow}>
            <span className={styles.modalDetailLabel}>البريد الإلكتروني:</span>
            <span className={styles.modalDetailVal}>{result.data.email}</span>
          </div>
          <div className={styles.modalDetailRow}>
            <span className={styles.modalDetailLabel}>رقم الهاتف:</span>
            <span className={styles.modalDetailVal}>{result.data.phone}</span>
          </div>
          <div className={styles.modalDetailRow}>
            <span className={styles.modalDetailLabel}>حالة الطلب:</span>
            <span className={styles.modalDetailVal} style={{ color: 'var(--color-gold-light)' }}>
              قيد المراجعة والموافقة
            </span>
          </div>
        </>
      ),
    });
  };

  const handleGoogleSignIn = async () => {
    setModalState({
      isOpen: true,
      type: 'info',
      title: 'توجيه لتسجيل الدخول بواسطة Google',
      message: 'جاري فتح نافذة تسجيل الدخول الآمن عبر حساب Google...',
    });
    await signInWithGoogle();
  };

  const handleNewBooking = () => {
    localStorage.removeItem('ma3ared_local_ticket');
    setLocalTicket(null);
    setDbRecord(null);
    setIsEditing(false);
    setForm({ name: '', email: authUser?.email || '', phone: '', isFirstTime: false });
    setErrors({});
  };

  const displayData = dbRecord || localTicket;
  const isFormActive = isEditing || (!displayData && !authUser);

  return (
    <section ref={sectionRef} id="tickets" className={styles.formSection}>
      <div className={styles.ambientGlow} />

      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.headerGroup}>
          <div className={styles.badge}>
            <Sparkles className={styles.badgeIcon} size={16} />
            <span>
              {isEditing
                ? 'تعديل بيانات الحجز'
                : displayData
                ? 'تأكيد الحجز والبيانات'
                : 'حجز الحضور والمشاركة'}
            </span>
          </div>
          <h2 className={styles.title}>
            {isEditing ? (
              <>
                تعديل بياناتك <span className={styles.goldText}>المسجلة</span>
              </>
            ) : displayData ? (
              <>
                بياناتك المسجلة <span className={styles.goldText}>بالنظام</span>
              </>
            ) : (
              <>
                انضم إلى أضخم حدث <span className={styles.goldText}>للمعارض 2026</span>
              </>
            )}
          </h2>
          <p className={styles.subtitle}>
            {isEditing
              ? 'يمكنك تعديل الاسم أو رقم الهاتف أو البريد الإلكتروني وإعادة حفظها مباشرة.'
              : displayData
              ? 'بياناتك محفوظة لدينا بنجاح وبانتظار مراجعة الإدارة والموافقة.'
              : 'سجل بياناتك الآن واحصل على معاينة فورية لبيانات حجزك'}
          </p>
        </div>

        {/* Main Card Container */}
        <div ref={formCardRef} className={styles.formCard}>
          {/* User Account Link Status Pill */}
          {authUser && (
            <div className={styles.userLinkedBar}>
              <UserCheck size={18} className={styles.linkedIcon} />
              <span>
                مرتبط بحساب: <strong>{authUser.email}</strong>
              </span>
              {isEditing && (
                <span className={styles.linkedBadge}>
                  <Edit3 size={13} /> وضع التعديل مفعل
                </span>
              )}
            </div>
          )}

          {displayData && !isEditing ? (
            /* Registered Ticket Card Display (Signed In or Local Preview) */
            <div className={styles.ticketPreviewWrapper}>
              <div className={styles.previewHeader}>
                <div className={styles.successBadge}>
                  <CheckCircle size={22} />
                  <span>بيانات حجزك المسجلة</span>
                </div>
                <div className={styles.statusBadge}>
                  <Clock size={15} />
                  <span>قيد المراجعة والموافقة</span>
                </div>
              </div>

              <div className={styles.ticketInfoGrid}>
                <div className={styles.ticketItem}>
                  <span className={styles.itemLabel}>الاسم الثلاثي:</span>
                  <span className={styles.itemVal}>{displayData.name}</span>
                </div>
                <div className={styles.ticketItem}>
                  <span className={styles.itemLabel}>البريد الإلكتروني:</span>
                  <span className={styles.itemVal}>{displayData.email}</span>
                </div>
                <div className={styles.ticketItem}>
                  <span className={styles.itemLabel}>رقم الهاتف (واتساب):</span>
                  <span className={styles.itemVal}>{displayData.phone}</span>
                </div>
                <div className={styles.ticketItem}>
                  <span className={styles.itemLabel}>المشاركة السابقة:</span>
                  <span className={styles.itemVal}>
                    {displayData.isFirstTime ? 'أول مرة أحضر' : 'سبق لي الحضور'}
                  </span>
                </div>
              </div>

              {/* Action Buttons: NO GOOGLE BUTTON WHEN SIGNED IN! */}
              <div className={styles.previewActions}>
                <button
                  type="button"
                  className={styles.editDataBtn}
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 size={18} />
                  <span>تعديل بياناتك المسجلة</span>
                </button>

                {!authUser && (
                  <button
                    type="button"
                    className={styles.googleBtn}
                    onClick={handleGoogleSignIn}
                  >
                    <svg className={styles.googleSvg} viewBox="0 0 24 24" width="20" height="20">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>تسجيل الدخول بـ Google لمزامنة بياناتك</span>
                  </button>
                )}

                <button
                  type="button"
                  className={styles.secondaryActionBtn}
                  onClick={handleNewBooking}
                >
                  <RefreshCw size={16} />
                  <span>حجز بيانات جديدة</span>
                </button>
              </div>
            </div>
          ) : (
            /* Editable Form Mode */
            <form onSubmit={handleFormSubmit} noValidate>
              <FormInputs
                form={form}
                setForm={setForm}
                errors={errors}
                clearFieldError={clearFieldError}
              />

              {/* Action Buttons */}
              <div className={styles.submitActionsGroup}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.submitBtn}
                >
                  {isSubmitting ? (
                    <span className={styles.loadingSpinner}>
                      {isEditing ? 'جاري حفظ التعديلات...' : 'جاري إرسال البيانات...'}
                    </span>
                  ) : (
                    <>
                      <span>
                        {isEditing ? 'إعادة حفظ وتحديث البيانات' : 'تأكيد وإرسال البيانات'}
                      </span>
                      {isEditing ? <Save size={20} /> : <Ticket size={20} />}
                    </>
                  )}
                </button>

                {isEditing && displayData && (
                  <button
                    type="button"
                    className={styles.cancelEditBtn}
                    onClick={() => setIsEditing(false)}
                  >
                    <span>إلغاء التعديل والعودة</span>
                  </button>
                )}

                {!authUser && !isEditing && (
                  <button
                    type="button"
                    className={styles.googleOutlineBtn}
                    onClick={handleGoogleSignIn}
                  >
                    <svg className={styles.googleSvg} viewBox="0 0 24 24" width="18" height="18">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>تسجيل الدخول بواسطة Google</span>
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Global Fixed Center Popup Modal */}
      <PopupModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        details={modalState.details}
        actionButton={modalState.actionButton}
      />
    </section>
  );
};

export default Form;