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

const RegistrationTrend = ({ data = [], registrationDates = [], loading = false }) => {
  const [period, setPeriod] = useState("7d");

  // Dynamically build complete time-series data with zero-padding so curves always draw properly
  const chartData = useMemo(() => {
    const dates = registrationDates.length > 0
      ? registrationDates.map((d) => new Date(d))
      : data.map((d) => new Date(d.fullDate || d.date));

    const now = new Date();

    if (period === "24h") {
      // 8 time buckets of 3 hours each over the past 24 hours
      const buckets = [];
      for (let i = 7; i >= 0; i--) {
        const bucketEnd = new Date(now.getTime() - i * 3 * 3600 * 1000);
        const bucketStart = new Date(bucketEnd.getTime() - 3 * 3600 * 1000);

        const count = dates.filter((d) => d >= bucketStart && d <= bucketEnd).length;
        const timeLabel = bucketEnd.toLocaleTimeString("ar-EG", {
          hour: "2-digit",
          minute: "2-digit",
        });

        buckets.push({
          date: i === 0 ? "الآن" : timeLabel,
          count,
        });
      }
      return buckets;
    }

    if (period === "7d" || period === "30d") {
      // Complete daily sequence for the past 7 or 30 days
      const daysCount = period === "7d" ? 7 : 30;
      const days = [];

      for (let i = daysCount - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dateKey = d.toISOString().slice(0, 10);

        const count = dates.filter((rd) => rd.toISOString().slice(0, 10) === dateKey).length;
        const label = d.toLocaleDateString("ar-EG", {
          month: "short",
          day: "numeric",
        });

        days.push({
          date: label,
          fullDate: dateKey,
          count,
        });
      }
      return days;
    }

    // Period: "all"
    if (data.length === 0) return [];
    if (data.length === 1) {
      // When only 1 day has registrations, pad before and after so the area curve renders nicely
      const single = data[0];
      const singleDate = new Date(single.fullDate || Date.now());

      const dBefore2 = new Date(singleDate);
      dBefore2.setDate(dBefore2.getDate() - 2);

      const dBefore1 = new Date(singleDate);
      dBefore1.setDate(dBefore1.getDate() - 1);

      const dAfter1 = new Date(singleDate);
      dAfter1.setDate(dAfter1.getDate() + 1);

      const dAfter2 = new Date(singleDate);
      dAfter2.setDate(dAfter2.getDate() + 2);

      return [
        { date: dBefore2.toLocaleDateString("ar-EG", { month: "short", day: "numeric" }), count: 0 },
        { date: dBefore1.toLocaleDateString("ar-EG", { month: "short", day: "numeric" }), count: 0 },
        single,
        { date: dAfter1.toLocaleDateString("ar-EG", { month: "short", day: "numeric" }), count: 0 },
        { date: dAfter2.toLocaleDateString("ar-EG", { month: "short", day: "numeric" }), count: 0 },
      ];
    }

    return data;
  }, [data, registrationDates, period]);

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <div className={styles.chartTitleBox}>
          <TrendingUp size={20} className="text-amber-500" />
          <h3 className={styles.chartTitle}>منحنى التسجيل عبر الوقت</h3>
        </div>

        {/* Period Selector Buttons */}
        <div style={{ display: "flex", gap: 4 }}>
          {PERIODS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setPeriod(p.key)}
              style={{
                padding: "5px 12px",
                borderRadius: 8,
                border: "1px solid",
                cursor: "pointer",
                fontSize: "0.78rem",
                fontWeight: 700,
                transition: "all 0.18s ease",
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
        ) : chartData.length === 0 ? (
          <div className={styles.chartEmpty}>لا توجد بيانات تسجيل كافية بعد</div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData} margin={{ top: 12, right: 12, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#df9c4c" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#df9c4c" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(223, 156, 76, 0.12)" />
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
                dot={{ r: 4, fill: "#df9c4c", stroke: "#ffffff", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#df9c4c", stroke: "#ffffff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default RegistrationTrend;
