import React from "react";
import { Users, CheckCircle2, Clock, XCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "../AdminDashboard.module.css";

const RecentRegistrations = ({ students = [], loading = false }) => {
  return (
    <div className={styles.tableWidgetCard}>
      <div className={styles.widgetHeader}>
        <div className={styles.widgetTitleBox}>
          <Users size={20} className="text-amber-400" />
          <h3 className={styles.widgetTitle}>أحدث المسجلين</h3>
        </div>
        <Link to="/students" className={styles.widgetLink}>
          <span>عرض الكل</span>
          <ArrowLeft size={16} />
        </Link>
      </div>

      <div className={styles.widgetBody}>
        {loading ? (
          <div className={styles.widgetSkeleton} />
        ) : students.length === 0 ? (
          <div className={styles.widgetEmpty}>لا توجد تسجيلات حديثة</div>
        ) : (
          <div className={styles.studentsList}>
            {students.map((s) => (
              <div key={s.id} className={styles.studentItem}>
                <div className={styles.studentInfo}>
                  <div className={styles.studentAvatar}>
                    {(s.name || "م").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className={styles.studentName}>{s.name || "بدون اسم"}</h4>
                    <span className={styles.studentEmail}>{s.email}</span>
                  </div>
                </div>

                <div className={styles.studentStatusCol}>
                  {s.isApproved === true ? (
                    <span className={`${styles.badge} ${styles.badgeApproved}`}>
                      <CheckCircle2 size={13} />
                      <span>معتمد</span>
                    </span>
                  ) : s.isApproved === false ? (
                    <span className={`${styles.badge} ${styles.badgeRejected}`}>
                      <XCircle size={13} />
                      <span>مرفوض</span>
                    </span>
                  ) : (
                    <span className={`${styles.badge} ${styles.badgePending}`}>
                      <Clock size={13} />
                      <span>قيد المراجعة</span>
                    </span>
                  )}

                  <span className={styles.studentDate}>
                    {new Date(s.created_at).toLocaleDateString("ar-EG", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentRegistrations;
