import React, { useEffect, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList,
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";
import { getSurvey, getSurveyOptions } from "../../../../services/survey.service";

/* ─── Palette ─── */
const PAL = [
  "#2563eb","#059669","#7c3aed","#0891b2","#e11d48",
  "#d97706","#4f46e5","#db2777","#0d9488","#ca8a04",
  "#16a34a","#dc2626","#9333ea","#0284c7","#64748b"
];
const YES_COLOR = "#059669";
const NO_COLOR  = "#e11d48";

const ANALYTIC_CATEGORIES = [
  ["Population", "pie", [["Male", ["male"]], ["Female", ["female"]], ["Other", ["other gender", "third gender", "other"]]]],
  ["Building Details", "hbar", [["Pucca House", ["pucca house", "pucca"]], ["Semi Pucca House", ["semi pucca"]], ["Kutcha House", ["kutcha house", "kutcha"]], ["Toilet Available", ["toilet available", "toilet facility"]], ["Roof Type", ["roof type"]]]],
  ["Socio Economic Status", "hbar", [["BPL", ["bpl"]], ["APL", ["apl"]], ["Income Groups", ["income group", "income"]], ["Occupation Distribution", ["occupation"]]]],
  ["Education", "bar", [["Total Literate Members", ["total literate members"]], ["Dropout Rate (Reverse Indicator)", ["dropout rate"]]]],
  ["Transportation", "pie", [["Walking", ["walking", "walk"]], ["Bicycle", ["bicycle", "cycle"]], ["Two Wheeler", ["two wheeler", "two-wheeler", "motorcycle"]], ["Car", ["car"]], ["Public Transport", ["public transport", "bus"]]]],
  ["Water & Sanitation", "hbar", [["Tap Water", ["tap water"]], ["Borewell", ["borewell", "bore well"]], ["Hand Pump", ["hand pump"]], ["Toilet Facility", ["toilet facility", "toilet available"]], ["Drainage", ["drainage"]], ["Waste Disposal", ["waste disposal", "garbage"]]]],
  ["Infrastructure", "hbar", [["Road", ["road"]], ["Street Lights", ["street light"]], ["School", ["school"]], ["Health Centre", ["health centre", "health center"]], ["Community Hall", ["community hall"]]]],
  ["Digital Connectivity", "grouped-bar", [["Smartphone", ["smartphone", "smart phone"]], ["Internet", ["internet"]], ["Digital Payments", ["digital payment"]], ["Social Media", ["social media"]], ["Smart Village Awareness", ["smart village awareness"]]]],
  ["Electricity", "hbar", [["Electricity Connection", ["electricity connection", "electric connection"]], ["Meter Installed", ["meter installed", "electric meter"]], ["Supply Hours", ["supply hours", "electricity hours"]]]],
  ["Clean Fuel", "pie", [["LPG", ["lpg"]], ["Firewood", ["firewood"]], ["Biogas", ["biogas"]], ["Electricity", ["electric cooking"]], ["Other Fuel", ["other fuel"]]]],
  ["Health & Nutrition", "hbar", [["Vaccination", ["vaccination", "immunization"]], ["Health Insurance", ["health insurance"]], ["Institutional Delivery", ["institutional delivery"]], ["Anganwadi", ["anganwadi"]], ["Toilet Usage", ["toilet usage"]]]],
  ["Household Source of Income", "hbar", [["Agriculture", ["agriculture"]], ["Government Job", ["government job"]], ["Private Job", ["private job"]], ["Labour", ["labour", "labor"]], ["Business / Self Employed", ["business", "self employed"]], ["Other", ["occupation other", "other"]]]],
  ["Livestock / Animal Husbandry", "pie", [["Cow", ["cow"]], ["Buffalo", ["buffalo"]], ["Goat", ["goat"]], ["Poultry", ["poultry", "chicken"]], ["No Livestock", ["no livestock"]]]],
  ["Socially Inclusive & Awareness", "grouped-bar", [["SHG Membership", ["shg", "self help group"]], ["Government Scheme Awareness", ["scheme awareness", "government scheme"]], ["Skill Training", ["skill training"]], ["Digital Awareness", ["digital awareness"]], ["Social Participation", ["social participation"]]]],
];

const cleanText = value => String(value ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const numberValue = item => Number(item?.value ?? item?.percentage ?? item?.score ?? 0);
const countValue = item => Number(item?.count ?? item?.householdCount ?? 0);

const buildAnalytics = processedData => {
  const source = processedData?.categories || [];
  const items = source.flatMap(category => (category.graphData || category.indicators || []).map(item => ({
    ...item, label: cleanText(item.indicator ?? item.name ?? item.parameter ?? ""), value: numberValue(item), count: countValue(item), originalDisplayValue: item.displayValue, _sourceCategory: category.category,
  })));
  return ANALYTIC_CATEGORIES.map(([category, type, parameters]) => {
    const graphData = parameters.map(([indicator, terms]) => {
      let matches = items.filter(item => terms.some(term => item.label.includes(term)) && Number.isFinite(item.value) && item.value > 0);
      // Household Source of Income: use only data from the same-named processor category
      // to avoid picking up similar indicators from Socio-Economic Status category
      if (category === "Household Source of Income") {
        matches = matches.filter(item => item._sourceCategory === "Household Source of Income");
      }
      if (!matches.length) return null;
      const count = matches.reduce((sum, item) => sum + item.count, 0);
      const value = matches.reduce((sum, item) => sum + item.value, 0) / matches.length;
      const originalDisplayValue = matches[0]?.originalDisplayValue;
      const displayValue = originalDisplayValue || `${value.toFixed(1)}%`;
      return { indicator, value: Number(value.toFixed(2)), count, displayValue, Yes: value, No: Math.max(0, 100 - value), YesCount: count, NoCount: 0 };
    }).filter(Boolean).sort((a, b) => b.value - a.value);
    return { category, type, graphData };
  }).filter(category => category.graphData.length);
};

/* ─── Custom Tooltip ─── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background:"#fff", border:"1px solid #e2e8f0", borderRadius:10,
      padding:"10px 16px", fontSize:16, boxShadow:"0 2px 14px rgba(0,0,0,.09)",
      maxWidth:260
    }}>
      <p style={{fontWeight:700, color:"#1e293b", marginBottom:6, fontSize:17}}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{color: p.fill || p.color, margin:"2px 0", fontWeight:600}}>
          {p.name}: {p.payload?.displayValue ?? p.value}
          {p.name === "Yes" && p.payload?.YesCount !== undefined
            ? ` (${p.payload.YesCount} HH)` : ""}
          {p.name === "No" && p.payload?.NoCount !== undefined
            ? ` (${p.payload.NoCount} HH)` : ""}
        </p>
      ))}
    </div>
  );
};

/* ─── Pie Chart ─── */
const PieCard = ({ data, color, showTooltip = true }) => {
  const RADIAN = Math.PI / 180;
  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    if (percent < 0.04) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="#fff" textAnchor="middle"
        dominantBaseline="central" fontSize={16} fontWeight={600}>
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };
  return (
    <div style={{width:"100%", height:380}}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="indicator"
            cx="50%" cy="50%" outerRadius={140}
            label={renderLabel} labelLine={false} animationDuration={900}>
            {data.map((_, i) => (
              <Cell key={i} fill={PAL[(i + PAL.indexOf(color)) % PAL.length]} />
            ))}
          </Pie>
          {showTooltip && (
            <Tooltip
              formatter={(v, _, item) => [
                `${item.payload.displayValue} (${item.payload.count} HH)`,
                item.payload.indicator
              ]}
              contentStyle={{borderRadius:8, fontSize:16}}
            />
          )}
          <Legend iconSize={13}
            formatter={v => <span style={{fontSize:17, color:"#374151"}}>{v}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

/* ─── Vertical Bar Chart ─── */
const VBar = ({ data, color }) => {
  const maxV = data.reduce((m, d) => Math.max(m, d.value || 0), 0);
  const dom  = [0, Math.max(Math.ceil((maxV * 1.2) / 10) * 10, 10)];
  const sw   = data.length > 8 ? data.length * 90 : null;
  return (
    <div style={{width:"100%", overflowX:"auto"}}>
      <div style={{width: sw || "100%", height:400}}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{top:30, right:20, bottom:90, left:40}}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="indicator" tick={{fontSize:16, fill:"#475569"}}
              angle={-30} textAnchor="end" height={100} interval={0} />
            <YAxis domain={dom} tick={{fontSize:16, fill:"#475569"}}
              label={{value:"Households (%)", angle:-90, position:"insideLeft",
                offset:0, style:{fontSize:13, fill:"#64748b", fontWeight:500}}} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconSize={13}
              formatter={v => <span style={{fontSize:17, color:"#374151"}}>{v}</span>} />
            <Bar dataKey="value" fill={color} radius={[6,6,0,0]}
              animationDuration={850} name="Coverage (%)">
              <LabelList dataKey="value"
                content={({ x, y, width, value, index }) => {
                  const item = data[index];
                  return (
                    <text x={x + width / 2} y={y - 6} textAnchor="middle"
                      fontSize={16} fill="#475569" fontWeight={600}>
                      {item?.displayValue || `${value}%`}
                    </text>
                  );
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/* ─── Horizontal Bar Chart ─── */
const HBar = ({ data, color }) => {
  const maxV = data.reduce((m, d) => Math.max(m, d.value || 0), 0);
  const dom  = [0, Math.max(Math.ceil((maxV * 1.2) / 10) * 10, 10)];
  const h    = Math.max(360, data.length * 56 + 80);

  const CustomBarLabel = ({ x, y, width, height, value, index }) => {
    const item = data[index];
    const label = item ? `${value}%  (${item.count} HH)` : `${value}%`;
    return (
      <text x={x + width + 8} y={y + height / 2} dominantBaseline="middle"
        fontSize={16} fill="#475569" fontWeight={600}>
        {label}
      </text>
    );
  };

  return (
    <div style={{width:"100%", height:h, overflowY:"auto"}}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical"
          margin={{top:10, right:140, bottom:10, left:16}}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" domain={dom} tick={{fontSize:16, fill:"#475569"}} />
          <YAxis type="category" dataKey="indicator" width={220}
            tick={{fontSize:16, fill:"#475569"}} />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconSize={13}
            formatter={v => <span style={{fontSize:17, color:"#374151"}}>{v}</span>} />
          <Bar dataKey="value" fill={color} radius={[0,6,6,0]}
            animationDuration={850} name="Coverage (%)">
            <LabelList content={<CustomBarLabel />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/* ─── Grouped Bar Chart (Yes/No) ─── */
const GroupedBar = ({ data }) => {
  const h = Math.max(380, data.length * 60 + 100);
  return (
    <div style={{width:"100%", height:h, overflowY:"auto"}}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical"
          margin={{top:10, right:130, bottom:10, left:16}}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" domain={[0,100]} tick={{fontSize:16, fill:"#475569"}}
            tickFormatter={v => `${v}%`} />
          <YAxis type="category" dataKey="indicator" width={220}
            tick={{fontSize:16, fill:"#475569"}} />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconSize={13}
            formatter={v => <span style={{fontSize:17, color:"#374151"}}>{v}</span>} />
          <Bar dataKey="Yes" fill={YES_COLOR} radius={[0,4,4,0]}
            animationDuration={850} name="Yes">
            <LabelList dataKey="Yes"
              content={({ x, y, width, height, value }) => (
                value > 5 ? (
                  <text x={x + width + 4} y={y + height / 2}
                    dominantBaseline="middle" fontSize={16} fill="#059669" fontWeight={600}>
                    {`${value}%`}
                  </text>
                ) : null
              )}
            />
          </Bar>
          <Bar dataKey="No" fill={NO_COLOR} radius={[0,4,4,0]}
            animationDuration={850} name="No">
            <LabelList dataKey="No"
              content={({ x, y, width, height, value }) => (
                value > 5 ? (
                  <text x={x + width + 4} y={y + height / 2}
                    dominantBaseline="middle" fontSize={16} fill="#e11d48" fontWeight={600}>
                    {`${value}%`}
                  </text>
                ) : null
              )}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/* ─── Chart Dispatcher ─── */
const ChartCard = ({ cat, idx, populationSummary }) => {
  const color = PAL[idx % PAL.length];
  const type  = cat.type || "bar";
  const raw   = cat.graphData || [];

  // Normalise: support both {indicator, value} and {name, value} shapes
  const data = raw
    .map(item => ({
      ...item,
      indicator: String(item.indicator ?? item.name ?? "Unknown").trim(),
      value: typeof item.value === "number" ? item.value
           : parseFloat(item.value) || 0,
    }))
    .filter(d => !isNaN(d.value) && d.value > 0);

  const isPopulationChart = cat.category === "Population";
  const pieData = isPopulationChart
    ? (() => {
        const summary = populationSummary || {};
        const totalPopulation = Number(summary.totalPopulation ?? 0);
        const malePopulation = Number(summary.malePopulation ?? 0);
        const femalePopulation = Number(summary.femalePopulation ?? 0);

        if (!totalPopulation || totalPopulation <= 0 || malePopulation < 0 || femalePopulation < 0) {
          console.error("Population data is missing or invalid in the processed survey JSON. Re-upload or reprocess the survey to populate Total Population, Total Male Population, and Total Female Population.");
          return [];
        }

        const malePercentage = (malePopulation / totalPopulation) * 100;
        const femalePercentage = (femalePopulation / totalPopulation) * 100;

        return [
          {
            indicator: "Male",
            value: malePercentage,
            count: malePopulation,
            displayValue: `${malePercentage.toFixed(1)}%`,
          },
          {
            indicator: "Female",
            value: femalePercentage,
            count: femalePopulation,
            displayValue: `${femalePercentage.toFixed(1)}%`,
          },
        ].filter(item => item.count > 0 || item.value > 0);
      })()
    : data;

  if (!pieData.length) return (
    <div style={{padding:"28px", textAlign:"center", background:"#f8fafc",
      borderRadius:12, color:"#94a3b8", marginTop:12}}>
      <p style={{fontSize:16, fontWeight:500}}>
        {isPopulationChart
          ? "Population data is missing in the processed survey JSON. Re-upload or reprocess the survey to populate the Gram Panchayat population values."
          : "No data available for this category"}
      </p>
    </div>
  );

  if (type === "pie")         return <PieCard    data={pieData} color={color} showTooltip={!isPopulationChart} />;
  if (type === "grouped-bar") return <GroupedBar data={data} />;
  if (type === "hbar")        return <HBar       data={data} color={color} />;
  return                              <VBar       data={data} color={color} />;
};

/* ─── Survey Selector ─── */
const SurveyButton = ({ survey, active, onClick }) => (
  <button onClick={onClick} style={{
    padding:"9px 22px", borderRadius:10, fontSize:15,
    fontWeight: active ? 700 : 500, cursor:"pointer", border:"none",
    background: active ? "#2563eb" : "transparent",
    color: active ? "#fff" : "#475569", transition:"all .2s"
  }}>
    {survey.surveyTitle}
  </button>
);

/* ═══════════════════ Main Page ═══════════════════ */
const IndicatorsPage = () => {
  const { village } = useOutletContext();
  const [sp, setSp] = useSearchParams();
  const [surveys, setSurveys] = useState([]);
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);
  const [survey, setSurvey] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const sid = village?.state?._id || village?.state;
  const querySurveyId = sp.get("survey");
  const legacyYear = Number(sp.get("year"));

  useEffect(() => {
    if (!sid || !village?._id) return;
    let dead = false;

    getSurveyOptions(sid, village._id)
      .then(items => {
        if (dead) return;
        setSurveys(items);

        if (items.length) {
          const selected =
            items.find(item => String(item._id) === querySurveyId) ||
            items.find(item => item.surveyYear === legacyYear) ||
            items[0];

          const id = String(selected._id);
          setSelectedSurveyId(id);
          if (id !== querySurveyId) {
            setSp({ survey: id }, { replace: true });
          }
        }
      })
      .catch(() => {
        if (!dead) setErr("Development indicator surveys are not available yet.");
      });

    return () => { dead = true; };
  }, [sid, village?._id]);

  useEffect(() => {
    if (!selectedSurveyId || !sid || !village?._id) return;
    let dead = false;
    setLoading(true);
    setErr("");
    setSurvey(null);

    getSurvey(sid, village._id, selectedSurveyId)
      .then(data => { if (!dead) setSurvey(data); })
      .catch(() => { if (!dead) setErr("Unable to load the selected survey."); })
      .finally(() => { if (!dead) setLoading(false); });

    return () => { dead = true; };
  }, [sid, village?._id, selectedSurveyId]);

  const onSurvey = (id) => {
    const value = String(id);
    setSelectedSurveyId(value);
    setSp({ survey: value }, { replace: true });
  };

  const selectedSurvey = surveys.find(
    item => String(item._id) === selectedSurveyId
  );
  const categories = buildAnalytics(survey?.processedData);
  const myScoreValue = survey?.processedData?.summary?.myScore;

  if (err && !surveys.length) return (
    <div style={{borderRadius:20, border:"1px solid #e2e8f0", background:"#fff",
      padding:40, textAlign:"center", color:"#64748b"}}>
      <p style={{fontSize:20, fontWeight:600}}>{err}</p>
      <p style={{fontSize:15, marginTop:6}}>Contact system admin to upload VDI worksheets.</p>
    </div>
  );

  return (
    <section style={{display:"flex", flexDirection:"column", gap:36}}>

      {/* Header */}
      <div style={{display:"flex", alignItems:"flex-start",
        justifyContent:"space-between", flexWrap:"wrap", gap:16}}>
        <div>
          <h1 style={{fontSize:34, fontWeight:700, color:"#0f172a", margin:0}}>
            Development Indicators
          </h1>
          <p style={{fontSize:16, color:"#64748b", marginTop:8}}>
            Analytics from the uploaded Household Survey — {village?.name?.en || "Village"}
          </p>
        </div>
        {surveys.length > 0 && (
          <div style={{display:"flex", flexWrap:"wrap", gap:6,
            background:"#f1f5f9", borderRadius:14, padding:"6px 8px"}}>
            {surveys.map(item => (
              <SurveyButton
                key={item._id}
                survey={item}
                active={String(item._id) === selectedSurveyId}
                onClick={() => onSurvey(item._id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* My Score summary */}
      {!loading && (
        <div style={{display:"flex", justifyContent:"center"}}>
          <div style={{width:"100%", maxWidth:760, borderRadius:20, border:"1px solid #e2e8f0",
            background:"#fff", padding:"28px 32px", boxShadow:"0 1px 6px rgba(0,0,0,.06)",
            textAlign:"center"}}>
            <p style={{fontSize:14, fontWeight:700, color:"#64748b", margin:0, letterSpacing:"0.08em",
              textTransform:"uppercase"}}>VDI</p>
            <div style={{fontSize:56, fontWeight:800, color:"#2563eb", lineHeight:1.1, marginTop:10}}>
              {myScoreValue !== undefined && myScoreValue !== null && !Number.isNaN(Number(myScoreValue))
                ? Number(myScoreValue).toString()
                : "—"}
            </div>
            <p style={{fontSize:15, color:"#64748b", margin:"10px 0 0"}}>Overall Village Development Index</p>
          </div>
        </div>
      )}

      {/* Summary pills */}
      {!loading && categories.length > 0 && (
        <div style={{display:"flex", flexWrap:"wrap", gap:12}}>
          {[
            { bg:"#eff6ff", color:"#2563eb", text:`📊 ${categories.length} Categories` },
            { bg:"#f0fdf4", color:"#16a34a",
              text:`📋 ${categories.reduce((s,c)=>s+(c.graphData||[]).length,0)} Parameters` },
            { bg:"#f5f3ff", color:"#7c3aed", text:`📋 Survey: ${selectedSurvey?.surveyTitle || survey?.surveyTitle || "Untitled Survey"}` },
          ].map(({bg,color,text}) => (
            <div key={text} style={{background:bg, borderRadius:10, padding:"8px 20px",
              fontSize:15, color, fontWeight:600}}>{text}</div>
          ))}
        </div>
      )}

      {/* Spinner */}
      {loading && (
        <div style={{minHeight:400, display:"flex", alignItems:"center", justifyContent:"center"}}>
          <div style={{width:46, height:46, borderRadius:"50%",
            border:"4px solid #e2e8f0", borderTopColor:"#2563eb",
            animation:"spin .8s linear infinite"}} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      )}

      {/* No data */}
      {!loading && !err && categories.length === 0 && surveys.length > 0 && (
        <div style={{borderRadius:20, border:"1px solid #e2e8f0", background:"#fff",
          padding:40, textAlign:"center", color:"#64748b"}}>
          <p style={{fontSize:20, fontWeight:600}}>No data available for {selectedSurvey?.surveyTitle || "this survey"}.</p>
          <p style={{fontSize:15, marginTop:6}}>
            Re-upload the Household Survey Excel in the admin panel.
          </p>
        </div>
      )}

      {/* Category Cards */}
      {!loading && categories.map((cat, idx) => (
        <article key={cat.category || idx}
          style={{width:"100%", borderRadius:20, border:"1px solid #e2e8f0",
            background:"#fff", padding:"28px 32px",
            boxShadow:"0 1px 6px rgba(0,0,0,.06)", transition:"box-shadow .2s"}}
          onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,.11)"}
          onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 6px rgba(0,0,0,.06)"}
        >
          <div style={{display:"flex", alignItems:"center", gap:14}}>
            <div style={{width:5, height:38, borderRadius:4,
              background:PAL[idx%PAL.length], flexShrink:0}} />
            <div>
              <h2 style={{fontSize:30, fontWeight:700, color:"#1e293b", margin:0, lineHeight:1.2}}>
                {cat.category}
              </h2>
            </div>
          </div>
          <ChartCard
            cat={cat}
            idx={idx}
            populationSummary={survey?.processedData?.population || survey?.processedData?.populationSummary}
          />
        </article>
      ))}
    </section>
  );
};

export default IndicatorsPage;