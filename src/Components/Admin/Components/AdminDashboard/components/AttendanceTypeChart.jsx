import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Sparkles } from "lucide-react";
import styles from "../AdminDashboard.module.css";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0];
    return (
      <div className={styles.chartTooltip}>
        <p className={styles.tooltipLabel}>{d.name}</p>
        <p className={styles.tooltipValue}>
          <span>العدد:</span>
          <strong>{d.value}</strong>
        </p>
      </div>
    );
  }
  return null;
};

const AttendanceTypeChart = ({ data = [], loading = false }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <div className={styles.chartTitleBox}>
          <Sparkles size={20} className="text-amber-400" />
          <h3 className={styles.chartTitle}>نوع الحضور والمشاركة</h3>
        </div>
        <span className={styles.chartSubtitle}>حضور لأول مرة مقابل حضور سابق</span>
      </div>

      <div className={styles.chartContent}>
        {loading ? (
          <div className={styles.chartSkeleton} />
        ) : total === 0 ? (
          <div className={styles.chartEmpty}>لا توجد بيانات مسجلين بعد</div>
        ) : (
          <div className={styles.donutWrapper}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Custom Legend */}
            <div className={styles.donutLegend}>
              {data.map((item, idx) => (
                <div key={idx} className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ backgroundColor: item.color }} />
                  <span className={styles.legendName}>{item.name}</span>
                  <span className={styles.legendValue}>
                    {item.value} ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceTypeChart;
