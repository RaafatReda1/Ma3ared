import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
import styles from "../AdminDashboard.module.css";

const PERIODS = [
  { key: "24h", label: "24 ساعة" },
  { key: "7d",  label: "7 أيام"  },
  { key: "30d", label: "30 يوم"  },
  { key: "all", label: "الكل"    },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.chartTooltip}>
        <p className={styles.tooltipLabel}>{label}</p>
        <p className={styles.tooltipValue}>
          <span>عدد المسجلين:</span>
          <strong>{payload[0].value}</strong>
        </p>
      </div>
    );
  }
  return null;
};

const RegistrationTrend = ({ data = [], loading = false }) => {
  const [period, setPeriod] = useState("all");

  const filteredData = useMemo(() => {
    if (period === "all") return data;
    const now = Date.now();
    const msMap = { "24h": 86400000, "7d": 604800000, "30d": 2592000000 };
    const cutoff = now - msMap[period];
    return data.filter((d) => {
      // d.fullDate is YYYY-MM-DD; compare as midnight UTC
      const ts = new Date(d.fullDate + "T00:00:00Z").getTime();
      return ts >= cutoff;
    });
  }, [data, period]);

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <div className={styles.chartTitleBox}>
          <TrendingUp size={20} className="text-amber-400" />
          <h3 className={styles.chartTitle}>منحنى التسجيل عبر الوقت</h3>
        </div>

        {/* Period Selector */}
        <div style={{ display: "flex", gap: 4 }}>
          {PERIODS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setPeriod(p.key)}
              style={{
                padding: "4px 10px",
                borderRadius: 8,
                border: "1px solid",
                cursor: "pointer",
                fontSize: "0.75rem",
                fontWeight: 700,
                transition: "all 0.18s",
                borderColor: period === p.key ? "#df9c4c" : "#e2e8f0",
                background: period === p.key ? "#df9c4c" : "#ffffff",
                color: period === p.key ? "#ffffff" : "#64748b",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.chartContent}>
        {loading ? (
          <div className={styles.chartSkeleton} />
        ) : filteredData.length === 0 ? (
          <div className={styles.chartEmpty}>لا توجد بيانات لهذه الفترة الزمنية</div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#df9c4c" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#df9c4c" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(223, 156, 76, 0.1)" />
              <XAxis
                dataKey="date"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "rgba(223, 156, 76, 0.2)" }}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "rgba(223, 156, 76, 0.2)" }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#df9c4c"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#goldGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default RegistrationTrend;
