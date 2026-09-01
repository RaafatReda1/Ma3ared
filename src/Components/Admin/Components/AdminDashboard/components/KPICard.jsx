import React from "react";
import styles from "../AdminDashboard.module.css";

const KPICard = ({ title, value, subtext, icon, color = "gold", badge, loading }) => {
  return (
    <div className={`${styles.kpiCard} ${styles[`kpi_${color}`] || ""}`}>
      <div className={styles.kpiHeader}>
        <span className={styles.kpiTitle}>{title}</span>
        <div className={styles.kpiIconBox}>{icon}</div>
      </div>

      <div className={styles.kpiBody}>
        {loading ? (
          <div className={styles.kpiSkeleton} />
        ) : (
          <div className={styles.kpiValueRow}>
            <span className={styles.kpiValue}>{Number(value || 0).toLocaleString("ar-EG")}</span>
            {badge && <span className={styles.kpiBadge}>{badge}</span>}
          </div>
        )}
      </div>

      {subtext && <div className={styles.kpiSubtext}>{subtext}</div>}
    </div>
  );
};

export default KPICard;
