import React from "react";
import { Activity, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "../AdminDashboard.module.css";

const RecentActivityLogs = ({ logs = [], loading = false }) => {
  return (
    <div className={styles.tableWidgetCard}>
      <div className={styles.widgetHeader}>
        <div className={styles.widgetTitleBox}>
          <Activity size={20} className="text-cyan-400" />
          <h3 className={styles.widgetTitle}>سجل العمليات والنشاط</h3>
        </div>
        <Link to="/reports" className={styles.widgetLink}>
          <span>عرض سجل العمليات</span>
          <ArrowLeft size={16} />
        </Link>
      </div>

      <div className={styles.widgetBody}>
        {loading ? (
          <div className={styles.widgetSkeleton} />
        ) : logs.length === 0 ? (
          <div className={styles.widgetEmpty}>لا توجد عمليات مسجلة حديثاً</div>
        ) : (
          <div className={styles.logsList}>
            {logs.map((log) => (
              <div key={log.id} className={styles.logItem}>
                <div className={styles.logDot} />
                <div className={styles.logContent}>
                  <p className={styles.logDescription}>{log.description}</p>
                  <div className={styles.logMeta}>
                    <span className={styles.logActor}>{log.actor_name || "مستخدم"}</span>
                    <span>•</span>
                    <span className={styles.logTime}>
                      {new Date(log.created_at).toLocaleTimeString("ar-EG", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivityLogs;
