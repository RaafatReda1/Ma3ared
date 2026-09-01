/**
 * Export filtered student rows to a beautifully styled, print-ready PDF document for Ma3ared
 */
export const exportStudentsToPDF = (students = [], filterTitle = "كشف تسجيل المشاركين") => {
  if (!students || students.length === 0) return;

  const now = new Date().toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const totalCount = students.length;
  const approvedCount = students.filter((s) => s.isApproved === true).length;
  const pendingCount = students.filter((s) => s.isApproved === null).length;
  const rejectedCount = students.filter((s) => s.isApproved === false).length;
  const firstTimeCount = students.filter((s) => s.isFirstTime === true).length;

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("يرجى السماح بالنوافذ المنبثقة لتوليد ملف الـ PDF");
    return;
  }

  const rowsHtml = students
    .map(
      (s, idx) => `
      <tr>
        <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
        <td>
          <div style="font-weight: bold; color: #0f172a;">${s.name || "بدون اسم"}</div>
          <div style="font-size: 11px; color: #64748b; direction: ltr; text-align: right;">${s.email || "—"}</div>
        </td>
        <td style="direction: ltr; text-align: right; font-weight: 600;">${s.phone || "—"}</td>
        <td style="text-align: center;">
          <span style="font-size: 11px; font-weight: 600; color: #0284c7;">
            ${s.isFirstTime ? "حضور لأول مرة ✦" : "حضور سابق"}
          </span>
        </td>
        <td style="text-align: center;">
          <span style="
            display: inline-block;
            padding: 3px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: bold;
            background: ${s.isApproved === true ? "#dcfce7" : s.isApproved === false ? "#fee2e2" : "#fef3c7"};
            color: ${s.isApproved === true ? "#15803d" : s.isApproved === false ? "#b91c1c" : "#b45309"};
          ">
            ${s.isApproved === true ? "معتمد" : s.isApproved === false ? "مرفوض" : "قيد المراجعة"}
          </span>
        </td>
        <td style="font-size: 11px; color: #64748b; text-align: center;">
          ${new Date(s.created_at).toLocaleDateString("ar-EG")}
        </td>
      </tr>
    `
    )
    .join("");

  const htmlContent = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="utf-8" />
      <title>${filterTitle} - حفلة معارض مدينة نصر 2026</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; font-family: 'Cairo', sans-serif; }
        body {
          margin: 0;
          padding: 24px;
          color: #1e293b;
          background: #ffffff;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #df9c4c;
          padding-bottom: 16px;
          margin-bottom: 20px;
        }
        .title { font-size: 22px; font-weight: 800; color: #0f172a; margin: 0; }
        .subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }
        .stats-bar {
          display: flex;
          gap: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 10px 16px;
          border-radius: 10px;
          margin-bottom: 20px;
          font-size: 13px;
          font-weight: bold;
        }
        .stat-item { display: flex; align-items: center; gap: 6px; }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }
        th {
          background: #0f172a;
          color: #ffffff;
          padding: 10px 12px;
          text-align: right;
          font-weight: 700;
        }
        td {
          padding: 10px 12px;
          border-bottom: 1px solid #e2e8f0;
          vertical-align: middle;
        }
        tr:nth-child(even) { background: #f8fafc; }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1 class="title">${filterTitle}</h1>
          <div class="subtitle">حفلة معارض مدينة نصر 2026 — تاريخ الطباعة: ${now}</div>
        </div>
        <div style="text-align: left;">
          <span style="font-size: 18px; font-weight: 800; color: #df9c4c;">معارض ملابس</span>
        </div>
      </div>

      <div class="stats-bar">
        <div class="stat-item"><span>إجمالي المسجلين:</span> <span style="color: #0284c7;">${totalCount}</span></div>
        <div class="stat-item"><span>المعتمدين:</span> <span style="color: #16a34a;">${approvedCount}</span></div>
        <div class="stat-item"><span>قيد المراجعة:</span> <span style="color: #d97706;">${pendingCount}</span></div>
        <div class="stat-item"><span>المرفوضين:</span> <span style="color: #dc2626;">${rejectedCount}</span></div>
        <div class="stat-item"><span>حضور لأول مرة:</span> <span style="color: #8b5cf6;">${firstTimeCount}</span></div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 40px; text-align: center;">#</th>
            <th>اسم المشارك والبريد</th>
            <th>رقم الهاتف</th>
            <th style="text-align: center;">نوع الحضور</th>
            <th style="text-align: center;">حالة الاعتماد</th>
            <th style="text-align: center;">تاريخ التسجيل</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
