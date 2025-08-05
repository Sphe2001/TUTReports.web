import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import "./reportStatistics.css";
import { toast, Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faClipboardList,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";

const tabLabels = [
  { name: "All Report Statistics", icon: faChartBar },
  { name: "By Submission Stats", icon: faClipboardList },
  { name: "By Student Attendance", icon: faUserCheck },
];

const barColors = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#6366f1",
  "#14b8a6",
];

const LecturerSelect = ({ onSelect }) => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const [lecturers, setLecturers] = useState([]);
  const [selectedLecturerId, setSelectedLecturerId] = useState("");

  useEffect(() => {
    const fetchReviewerDepartment = async () => {
      try {
        const response = await axios.get(
          `${API_ENDPOINT}/api/UserGetters/GetAllReviewers`,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response?.data?.status) {
          const reviewerDepartment = response.data.reviewerDepartment;

          fetchDepartmentLecturers(reviewerDepartment);
        }
      } catch (err) {
        console.log(
          err.response?.data?.message || "Error loading reviewer department"
        );
      }
    };

    const fetchDepartmentLecturers = async (department) => {
      try {
        const response = await axios.get(
          `${API_ENDPOINT}/api/UserGetters/GetDepartmentLecturers?department=${department}`,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response?.data?.status) {
          setLecturers(response.data.lecturers);
        }
      } catch (err) {
        console.log(
          err.response?.data?.message || "Error loading department lecturers"
        );
      }
    };

    fetchReviewerDepartment();
  }, []);

  const handleSelectChange = (e) => {
    const selectedId = e.target.value;
    setSelectedLecturerId(selectedId);
    onSelect(selectedId);
  };

  return (
    <div className="custom-dropdown">
      <span className="status-dot green"></span>
      <select value={selectedLecturerId} onChange={handleSelectChange}>
        <option value="">Select A Lecturer</option>
        {lecturers.map((lect) => (
          <option key={lect.userId} value={lect.userId}>
            {lect.lecturerName} {lect.lecturerSurname}
          </option>
        ))}
      </select>
    </div>
  );
};

const ReportStatistics = () => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const [currentDateTime, setCurrentDateTime] = useState("");
  let viewMode = "Grid";
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalReports, setTotalReports] = useState(0);
  const [missedReports, setMissedReports] = useState(0);
  const [unreviewedReports, setUnreviewedReports] = useState(0);
  const [reviewedReports, setReviewedReports] = useState(0);
  const [userId, setUserId] = useState("");
  const [submissionStartDate, setSubmissionStartDate] = useState("");
  const [submissionEndDate, setSubmissionEndDate] = useState("");
  const [submissionStats, setSubmissionStats] = useState(null);
  const [activeTab, setActiveTab] = useState("All Report Statistics");
  const [groupId, setGroupId] = useState("");
  const [attendanceStartDate, setAttendanceStartDate] = useState("");
  const [attendanceEndDate, setAttendanceEndDate] = useState("");
  const [attendanceStats, setAttendanceStats] = useState(null);
  const submissionRef = useRef(null);
  const [attendanceView, setAttendanceView] = useState("customRange");
  const [moduleId, setModuleId] = useState("");

  // Custom Range dropdown data
  const [customRangeGroups, setCustomRangeGroups] = useState([]);
  const [customRangeModules, setCustomRangeModules] = useState([]);
  const [customRangeLecturers, setCustomRangeLecturers] = useState([]);

  // All Time dropdown data
  const [allTimeGroups, setAllTimeGroups] = useState([]);
  const [allTimeModules, setAllTimeModules] = useState([]);
  const [allTimeLecturers, setAllTimeLecturers] = useState([]);

  const fetchWithToast = async (url, setter, label, valueKey = "data") => {
    try {
      const resp = await axios.get(url, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      const d = resp.data;
      if (d.status) setter(d[valueKey] ?? 0);
      else toast.error(d.message || `Failed to load ${label}`);
    } catch (err) {
      toast.error(err.response?.data?.message || `Error loading ${label}`);
    }
  };

  const fetchSubmissionRate = async () => {
    if (!userId || !submissionStartDate || !submissionEndDate) {
      toast.error(
        "Please Choose Name, Surname, Start Date, and End Date Before Clicking Fetch."
      );
      return;
    }
    try {
      const resp = await axios.get(
        `${API_ENDPOINT}/api/stats/reviewer/GetLecturerSubmissionRate`,
        {
          params: {
            userid: userId,
            startDate: submissionStartDate,
            endDate: submissionEndDate,
          },
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      const res = resp.data;
      if (res.status) {
        setSubmissionStats(res);
        toast.success("Submission stats loaded.");
      } else toast.error(res.message || "Failed to fetch submission rate.");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Error fetching submission rate."
      );
    }
  };
  useEffect(() => {
    const fetchReviewerDepartment = async () => {
      try {
        const response = await axios.get(
          `${API_ENDPOINT}/api/UserGetters/GetAllReviewers`,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response?.data?.status) {
          const reviewerDepartment = response.data.reviewerDepartment;

          fetchAllOptionsByDepartment(reviewerDepartment);
        } else {
          toast.error(
            response?.data?.message || "Failed to get reviewer department."
          );
        }
      } catch (err) {
        console.error("Reviewer fetch error:", err);
        toast.error(
          err.response?.data?.message || "Error loading reviewer department."
        );
      }
    };

    const fetchAllOptionsByDepartment = async (deptId) => {
      try {
        const config = {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        };

        // ✅ Fetch lecturers (no change)
        const lecturersResp = await axios.get(
          `${API_ENDPOINT}/api/UserGetters/GetDepartmentLecturers?department=${deptId}`,
          config
        );

        if (
          lecturersResp.data.status &&
          Array.isArray(lecturersResp.data.lecturers)
        ) {
          const lecturers = lecturersResp.data.lecturers.map((lect) => ({
            userId: lect.userId,
            name: lect.lecturerName,
            surname: lect.lecturerSurname,
          }));
          setCustomRangeLecturers(lecturers);
          setAllTimeLecturers(lecturers);
        } else {
          toast.error(
            lecturersResp.data.message || "Failed to load lecturers."
          );
        }

        // ✅ Fetch groups and modules from GetAllGroupsPerDepartment
        const groupsResp = await axios.get(
          `${API_ENDPOINT}/api/UserGetters/GetAllGroupsPerDepartment?department=${deptId}`,
          config
        );

        if (groupsResp.data.status && Array.isArray(groupsResp.data.data)) {
          const rawData = groupsResp.data.data;

          // Extract and set groups
          const groups = rawData.map((g) => ({
            groupId: g.groupId,
            groupName: g.groupName,
          }));
          setCustomRangeGroups(groups);
          setAllTimeGroups(groups);

          // Extract and deduplicate modules
          const moduleMap = new Map();
          rawData.forEach((g) => {
            if (g.moduleName) {
              const key = g.moduleName.trim().toLowerCase();
              if (!moduleMap.has(key)) {
                moduleMap.set(key, {
                  moduleId: key, // using moduleName as pseudo-id
                  moduleName: g.moduleName,
                });
              }
            }
          });
          const modules = Array.from(moduleMap.values());
          setCustomRangeModules(modules);
          setAllTimeModules(modules);

          toast.success("Groups and modules populated.");
        } else {
          toast.error(
            groupsResp.data.message || "Failed to load groups/modules."
          );
        }
      } catch (err) {
        console.error("Dropdown fetch error:", err);
        toast.error(
          err.response?.data?.message || "Error loading dropdown data."
        );
      }
    };

    fetchReviewerDepartment();
  }, [API_ENDPOINT]);

  const fetchAttendanceStats = async () => {
    try {
      const config = {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      };

      let res;
      let params = {};

      // Validate required params based on view
      if (attendanceView === "customRange") {
        if (!groupId || !attendanceStartDate || !attendanceEndDate) {
          toast.error("Group, start date, and end date are required.");
          return;
        }
        params = {
          groupId,
          startDate: attendanceStartDate,
          endDate: attendanceEndDate,
        };
        res = await axios.get(
          `${API_ENDPOINT}/api/stats/attendance/GetCustomDateRangeAttendance`,
          { params, ...config }
        );
      } else if (attendanceView === "allTime") {
        if (!groupId) {
          toast.error("Group is required.");
          return;
        }
        params = { groupId };
        res = await axios.get(
          `${API_ENDPOINT}/api/stats/attendance/GetAllTimeAttendanceByGroup`,
          { params, ...config }
        );
      } else if (attendanceView === "customRangeByModule") {
        if (!moduleId || !attendanceStartDate || !attendanceEndDate) {
          toast.error("Module, start date, and end date are required.");
          return;
        }
        params = {
          moduleId,
          startDate: attendanceStartDate,
          endDate: attendanceEndDate,
        };
        res = await axios.get(
          `${API_ENDPOINT}/api/stats/attendance/GetCustomDateRangeAttendanceByModule`,
          { params, ...config }
        );
      } else if (attendanceView === "allTimeByModule") {
        if (!moduleId) {
          toast.error("Module is required.");
          return;
        }
        params = { moduleId };
        res = await axios.get(
          `${API_ENDPOINT}/api/stats/attendance/GetAllTimeAttendanceByModule`,
          { params, ...config }
        );
      } else if (attendanceView === "customRangeByLecturer") {
        if (!userId || !attendanceStartDate || !attendanceEndDate) {
          toast.error("Lecturer, start date, and end date are required.");
          return;
        }
        params = {
          userId,
          startDate: attendanceStartDate,
          endDate: attendanceEndDate,
        };
        res = await axios.get(
          `${API_ENDPOINT}/api/stats/attendance/GetCustomDateRangeAttendanceByLecturer`,
          { params, ...config }
        );
      } else if (attendanceView === "allTimeByLecturer") {
        if (!userId) {
          toast.error("Lecturer is required.");
          return;
        }
        params = { userId };
        res = await axios.get(
          `${API_ENDPOINT}/api/stats/attendance/GetAllTimeAttendanceByLecturer`,
          { params, ...config }
        );
      }

      if (!res || !res.data) {
        toast.error("No response from server.");
        return;
      }

      const { status, ...data } = res.data;

      if (status) {
        const total = parseInt(data.totalStudents || 0);
        const attended = parseInt(data.attendedStudents || 0);
        const absent =
          typeof data.absentStudents === "number"
            ? data.absentStudents
            : total - attended;

        const pieChartData = [
          { name: "Present", value: attended, color: "#4caf50" },
          { name: "Absent", value: absent, color: "#f44336" },
        ];

        const stats = {
          ...data,
          pieChartData,
          highestAttendance: data.attendancePercentage || 0,
          lowestAttendance: 100 - (data.attendancePercentage || 0),
          averageRate: data.attendancePercentage || 0,
          totalStudents: total,
          attendedStudents: attended,
          absentStudents: absent,
          dateRange: data.period,
        };

        setAttendanceStats(stats);
        toast.success("Stats loaded successfully.");
      } else {
        toast.error(data.message || "Failed to fetch attendance stats.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error(err.response?.data?.message || "Error fetching stats.");
    }
  };

  useEffect(() => {
    const now = new Date().toLocaleString("en-ZA", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    setCurrentDateTime(now);

    const fetchStats = async () => {
      setLoading(true);
      await Promise.all([
        fetchWithToast(
          `${API_ENDPOINT}/api/stats/reviewer/GetTotalReportsCount`,
          setTotalReports,
          "total reports count",
          "count"
        ),
        fetchWithToast(
          `${API_ENDPOINT}/api/stats/reviewer/GetMissedReportsCount`,
          setMissedReports,
          "missed reports count",
          "count"
        ),
        fetchWithToast(
          `${API_ENDPOINT}/api/stats/reviewer/GetUnreviewedReportsCount`,
          setUnreviewedReports,
          "unreviewed reports count",
          "count"
        ),
        fetchWithToast(
          `${API_ENDPOINT}/api/stats/reviewer/GetReviewedReportsCount`,
          setReviewedReports,
          "reviewed reports count",
          "count"
        ),
      ]);
      setData([
        {
          category: "Overall",
          numReports: totalReports,
          reviewedCount: reviewedReports,
          pendingReports: unreviewedReports,
          missedReports,
        },
      ]);
      setLoading(false);
    };

    fetchStats();
  }, [
    totalReports,
    missedReports,
    unreviewedReports,
    reviewedReports,
    API_ENDPOINT,
  ]);

  const renderKeyLegend = (labels, colors) => (
    <div className="report-key">
      <h3>Key:</h3>
      <ul>
        {labels.map((lbl, i) => (
          <li key={lbl}>
            <span
              className="legend-color"
              style={{ backgroundColor: colors[i] }}
            ></span>
            {lbl}
          </li>
        ))}
      </ul>
    </div>
  );

  const renderKPICounters = () => (
    <div className="kpi-counters">
      {[
        "Total Reports",
        "Reviewed Reports",
        "Pending Reports",
        "Missed Reports",
      ].map((lbl, idx) => {
        const val = [
          totalReports,
          reviewedReports,
          unreviewedReports,
          missedReports,
        ][idx];
        return (
          <div
            key={lbl}
            className={`kpi-card ${lbl.toLowerCase().replace(/ /g, "-")}`}
          >
            <h3>{lbl}</h3>
            <p>{val}</p>
          </div>
        );
      })}
    </div>
  );

  const renderCharts = () => {
    if (loading) return <p>Loading stats...</p>;

    const pieData = submissionStats
      ? [
          {
            name: "Submission Rate",
            value: submissionStats.submissionRate ?? 0,
          },
          {
            name: "Missed Submission Rate",
            value: submissionStats.missedSubmissionRate ?? 0,
          },
          { name: "Total Reports", value: submissionStats.totalReports ?? 0 },
          { name: "Missed Reports", value: submissionStats.missedReports ?? 0 },
        ]
      : [
          { name: "Reports", value: data[0].numReports },
          { name: "Reviewed", value: data[0].reviewedCount },
          { name: "Pending", value: data[0].pendingReports },
        ];

    const wrapperClass =
      viewMode === "Grid" ? "report-chart-quad-split" : "report-chart-list";

    return (
      <>
        <Toaster position="top-center" />
        {activeTab === "All Report Statistics" && (
          <>
            {renderKPICounters()}
            <div className={wrapperClass}>
              <div className="bar-chart-section">
                <div className="section">
                  <h3>Bar Chart</h3>
                  {renderKeyLegend(
                    ["Reports", "Reviewed", "Pending"],
                    barColors
                  )}
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="category"
                        angle={-40}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="numReports" fill={barColors[0]} />
                      <Bar dataKey="reviewedCount" fill={barColors[1]} />
                      <Bar dataKey="pendingReports" fill={barColors[2]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "By Submission Stats" && (
          <div className="section submission-section" ref={submissionRef}>
            <h3>Submission Stats</h3>
            <small style={{ fontSize: "0.8rem", color: "#555" }}>
              Select A Lecturer
            </small>
            <div className="submission-inputs">
              <LecturerSelect onSelect={(id) => setUserId(id)} />
              <input
                type="date"
                value={submissionStartDate}
                onChange={(e) => setSubmissionStartDate(e.target.value)}
              />
              <input
                type="date"
                value={submissionEndDate}
                onChange={(e) => setSubmissionEndDate(e.target.value)}
              />
              <button onClick={fetchSubmissionRate}>Fetch</button>
            </div>
            {submissionStats && (
              <div className="submission-stats">
                {Object.entries(submissionStats).map(([k, v]) => (
                  <p key={k}>
                    {k.replace(/([A-Z])/g, " $1")}: {v}
                  </p>
                ))}
              </div>
            )}
            <div className="section pie-chart-section">
              <h3>Pie Chart</h3>
              {renderKeyLegend(
                [
                  "Submission Rate",
                  "Missed Submission Rate",
                  "Total Reports",
                  "Missed Reports",
                ],
                barColors
              )}
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Tooltip />
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={barColors[i % barColors.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        {activeTab === "By Student Attendance" && (
          <div className="attendance-section">
            <Toaster />
            <h2 className="section-title">Attendance Statistics</h2>

            {/* View Option Dropdown */}
            <div className="view-dropdown-wrapper">
              <label htmlFor="attendanceView">View Option</label>
              <select
                id="attendanceView"
                value={attendanceView}
                onChange={(e) => setAttendanceView(e.target.value)}
              >
                <option value="customRange">Custom Range by Group</option>
                <option value="allTime">All Time by Group</option>
                <option value="customRangeByModule">
                  Custom Range by Module
                </option>
                <option value="allTimeByModule">All Time by Module</option>
                <option value="customRangeByLecturer">
                  Custom Range by Lecturer
                </option>
                <option value="allTimeByLecturer">All Time by Lecturer</option>
              </select>
              <button onClick={fetchAttendanceStats}>Fetch Stats</button>
            </div>

            {/* Filters */}
            <div className="filter-bar">
              {/* Lecturer */}
              <div className="filter-item">
                <label>Lecturer</label>
                <select
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  disabled={
                    !["customRangeByLecturer", "allTimeByLecturer"].includes(
                      attendanceView
                    )
                  }
                >
                  <option value="">All Lecturers</option>
                  {(attendanceView === "customRangeByLecturer"
                    ? customRangeLecturers
                    : allTimeLecturers
                  ).map((lect) => (
                    <option key={lect.userId} value={lect.userId}>
                      {lect.name} {lect.surname}
                    </option>
                  ))}
                </select>
              </div>

              {/* Modules */}
              <div className="filter-item">
                <label>Modules</label>
                <select
                  value={moduleId}
                  onChange={(e) => setModuleId(e.target.value)}
                  disabled={
                    !["customRangeByModule", "allTimeByModule"].includes(
                      attendanceView
                    )
                  }
                >
                  <option value="">All Modules</option>
                  {(attendanceView === "customRangeByModule"
                    ? customRangeModules
                    : allTimeModules
                  ).map((m) => (
                    <option key={m.moduleId} value={m.moduleId}>
                      {m.moduleName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Group */}
              <div className="filter-item">
                <label>Group</label>
                <select
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}
                  disabled={
                    !["customRange", "allTime"].includes(attendanceView)
                  }
                >
                  <option value="">All Groups</option>
                  {(attendanceView === "customRange"
                    ? customRangeGroups
                    : allTimeGroups
                  ).map((g) => (
                    <option key={g.groupId} value={g.groupId}>
                      {g.groupName}
                    </option>
                  ))}
                </select>
              </div>

              {/* From Date */}
              <div className="filter-item">
                <label>From Date</label>
                <input
                  type="date"
                  value={attendanceStartDate}
                  onChange={(e) => setAttendanceStartDate(e.target.value)}
                  disabled={
                    ![
                      "customRange",
                      "customRangeByModule",
                      "customRangeByLecturer",
                    ].includes(attendanceView)
                  }
                />
              </div>

              {/* To Date */}
              <div className="filter-item">
                <label>To Date</label>
                <input
                  type="date"
                  value={attendanceEndDate}
                  onChange={(e) => setAttendanceEndDate(e.target.value)}
                  disabled={
                    ![
                      "customRange",
                      "customRangeByModule",
                      "customRangeByLecturer",
                    ].includes(attendanceView)
                  }
                />
              </div>
            </div>

            {/* Attendance Breakdown and Quick Stats */}
            {attendanceStats && (
              <div className="stats-grid">
                {/* Pie Chart */}
                <div className="pie-chart-box">
                  <h3 className="chart-title">Attendance Breakdown</h3>
                  <p className="chart-subtitle">
                    {attendanceStats?.moduleCode ||
                      attendanceStats?.moduleName ||
                      ""}
                    {attendanceStats?.groupName &&
                      ` Group ${attendanceStats.groupName}`}
                    {attendanceStats?.dateRange &&
                      ` (${attendanceStats.dateRange})`}
                  </p>

                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={attendanceStats.pieChartData || []}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {(attendanceStats.pieChartData || []).map(
                          (entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          )
                        )}
                      </Pie>
                      <Legend verticalAlign="bottom" />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="legend-description">
                    <span style={{ color: "#4caf50" }}>● Present</span>
                    <span style={{ color: "#f44336" }}>● Absent</span>
                  </div>
                </div>

                {/* Quick Stats Cards */}
                <div className="quick-stats-box">
                  <h3 className="chart-title">Quick Statistics</h3>
                  <div className="stat-cards">
                    <div className="stat-card green">
                      <p className="value">
                        {attendanceStats.highestAttendance}%
                      </p>
                      <p className="label">Highest Attendance</p>
                    </div>
                    <div className="stat-card red">
                      <p className="value">
                        {attendanceStats.lowestAttendance}%
                      </p>
                      <p className="label">Lowest Attendance</p>
                    </div>
                    <div className="stat-card blue">
                      <p className="value">{attendanceStats.averageRate}%</p>
                      <p className="label">Average Rate</p>
                    </div>
                    <div className="stat-card purple">
                      <p className="value">{attendanceStats.totalStudents}</p>
                      <p className="label">Total Students</p>
                    </div>
                    <div className="stat-card green">
                      <p className="value">
                        {attendanceStats.attendedStudents}
                      </p>
                      <p className="label">Present Students</p>
                    </div>
                    <div className="stat-card red">
                      <p className="value">{attendanceStats.absentStudents}</p>
                      <p className="label">Absent Students</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="report-statistics">
      <div className="report-stats-header"></div>
      <h2>Report Statistics</h2>
      <p className="report-stats-datetime">{currentDateTime}</p>
      <div className="tabs">
        {tabLabels.map((tab) => (
          <button
            key={tab.name}
            className={activeTab === tab.name ? "active" : ""}
            onClick={() => setActiveTab(tab.name)}
          >
            <FontAwesomeIcon icon={tab.icon} style={{ marginRight: "8px" }} />
            {tab.name}
          </button>
        ))}
      </div>
      {renderCharts()}
    </div>
  );
};

export default ReportStatistics;
