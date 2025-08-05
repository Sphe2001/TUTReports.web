import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import EditReportForm from "../../../components/lecturer/editReportForm/editReportForm";
import { FileText, Users, MessageSquare, BookOpen } from "lucide-react";
import "./editReport.css";

const EditReportPage = () => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const { reportId } = useParams();
  const navigate = useNavigate();

  const [modules, setModules] = useState([]);
  const [groups, setGroups] = useState([]);
  const [allChannels, setAllChannels] = useState([]);
  const [form, setForm] = useState({
    module: "",
    moduleCode: "",
    startDate: "",
    endDate: "",
    weeklyActivity: "",
    challenges: "",
    suggestions: "",
    groups: [],
    channels: [],
    channelSummaries: {},
    sessions: [],
    hasAttendanceRegister: false,
    attendanceRegisterFile: "",
  });
  const [loading, setLoading] = useState(true);
  const [selectedChannels, setSelectedChannels] = useState({});

  useEffect(() => {
    axios
      .get(`${API_ENDPOINT}/api/LecturerAcademy/GetMyModules`, {
        withCredentials: true,
      })
      .then((response) => {
        setModules(
          Array.isArray(response.data.modules) ? response.data.modules : []
        );
      });
  }, [API_ENDPOINT]);

  useEffect(() => {
    axios
      .get(`${API_ENDPOINT}/api/LecturerAcademy/GetMyModuleGroups`, {
        withCredentials: true,
      })
      .then((response) => {
        setGroups(
          Array.isArray(response.data.groups) ? response.data.groups : []
        );
      });
  }, [API_ENDPOINT]);

  useEffect(() => {
    axios
      .get(`${API_ENDPOINT}/api/AcademyGet/GetAllCommunicationChannels`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        if (response?.data?.status) {
          setAllChannels(response.data.channels);
        }
      });
  }, [API_ENDPOINT]);

  useEffect(() => {
    axios
      .get(
        `${API_ENDPOINT}/api/LecturerReports/ViewReport?reportId=${reportId}`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log("API report data:", response.data);
        let channelList = response.data.channelActivities || [];
        if (Array.isArray(channelList) && channelList.length > 0) {
          if (typeof channelList[0] === "string") {
            channelList = channelList.map((name, idx) => ({
              channelName: name,
            }));
          }
        }

        const summaries = response.data.channelActivities || {};
        const normalizedSummaries = {};
        channelList.forEach((c) => {
          const channelName = c.channelName;
          const summaryKey = Object.keys(summaries).find(
            (k) => k.trim().toLowerCase() === channelName.trim().toLowerCase()
          );
          normalizedSummaries[channelName] = summaryKey
            ? summaries[summaryKey]
            : "";
        });

        const fetchedForm = {
          module: response.data.module || "",
          moduleCode: response.data.moduleCode || "",
          startDate: parseFormattedDate(response.data.startDate) || "",
          endDate: parseFormattedDate(response.data.endDate) || "",
          weeklyActivity: response.data.weeklyActivity || "",
          challenges: response.data.challenges || "",
          suggestions: response.data.suggestions || "",
          groups: response.data.groupNames
            ? Array.isArray(response.data.groupNames)
              ? response.data.groupNames
              : response.data.groupNames.split(",").map((g) => g.trim())
            : [],
          channels: channelList,
          channelSummaries: normalizedSummaries,
          sessions:
            response.data.sessions && response.data.sessions.length > 0
              ? response.data.sessions.map((s) => ({
                  sessionNumber: s.sessionNumber || "",
                  numberOfStudents: s.numberOfStudents || "",
                  groupId: s.groupId || "",
                  sessionDate: parseFormattedDate(s.sessionDate) || "",
                }))
              : [
                  {
                    sessionNumber: 1,
                    numberOfStudents: "",
                    groupId: "",
                    sessionDate: "",
                  },
                ],
          hasAttendanceRegister: response.data.hasAttendanceRegister,
          attendanceRegisterFile: response.data.attendanceRegisterFile,
        };

        setForm(fetchedForm);

        const initialSelectedChannels = {};
        if (
          response.data.channelActivities &&
          response.data.channelActivities.length > 0
        ) {
          response.data.channelActivities.forEach((ca) => {
            initialSelectedChannels[ca.channelName] = {
              show: true,
              content: ca.activity,
            };
          });
        }
        setSelectedChannels(initialSelectedChannels);

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [reportId, API_ENDPOINT]);

  const getModuleGroups = async (moduleId) => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}/api/LecturerAcademy/GetMyModuleGroups`,
        {
          params: { moduleId },
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response?.data?.status) {
        setGroups(response.data.groups);
      } else {
        setGroups([]);
      }
    } catch (error) {
      setGroups([]);
    }
  };

  function parseFormattedDate(dateStr) {
    if (!dateStr) return "";

    const [day, monthName, year] = dateStr.split(" ");
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = (months.indexOf(monthName) + 1).toString().padStart(2, "0");
    return `${year}-${month}-${day.padStart(2, "0")}`;
  }

  useEffect(() => {
    if (modules.length > 0 && form.module) {
      const selectedModule = modules.find(
        (m) => m.moduleName === form.module || m.moduleCode === form.moduleCode
      );
      if (selectedModule) {
        getModuleGroups(selectedModule.moduleId || selectedModule.moduleID);
      }
    }
  }, [modules, form.module, form.moduleCode]);

  // Prepare props for EditReportForm
  const steps = [
    { number: 1, title: "Module & Dates", icon: BookOpen },
    { number: 2, title: "Weekly Report", icon: FileText },
    { number: 3, title: "Communication", icon: MessageSquare },
    { number: 4, title: "Sessions", icon: Users },
  ];
  const [currentStep, setCurrentStep] = useState(1);
  const [showReportPreview, setShowReportPreview] = useState(false);
  const [sessionFiles, setSessionFiles] = useState([]);

  // Find the correct module object for the report
  const selectedModule = modules.find(
    (mod) =>
      mod.moduleName === form.module || mod.moduleCode === form.moduleCode
  );

  // Only render EditReportForm when modules and report data are loaded and module is found
  if (loading || modules.length === 0 || !form.module || !selectedModule) {
    return <p>Loading...</p>;
  }

  // Functions for EditReportForm
  const handleChannelSelection = (channelName) => {
    setSelectedChannels((prev) => ({
      ...prev,
      [channelName]: !prev[channelName]
        ? { show: true, content: "" }
        : { ...prev[channelName], show: !prev[channelName].show },
    }));
  };
  const updateChannelActivity = (channelName, value) => {
    setSelectedChannels((prev) => ({
      ...prev,
      [channelName]: {
        ...prev[channelName],
        content: value,
      },
    }));
  };
  const addSessionForm = () => {
    setForm((prev) => ({
      ...prev,
      sessions: [
        ...prev.sessions,
        {
          sessionNumber: prev.sessions.length + 1,
          numberOfStudents: "",
          groupId: "",
          sessionDate: "",
        },
      ],
    }));
  };
  const removeSessionForm = (idx) => {
    setForm((prev) => ({
      ...prev,
      sessions: prev.sessions.filter((_, i) => i !== idx),
    }));
  };
  const updateSessionForm = (idx, field, value) => {
    setForm((prev) => ({
      ...prev,
      sessions: prev.sessions.map((session, i) =>
        i === idx ? { ...session, [field]: value } : session
      ),
    }));
  };
  const canProceedToNext = () => {
    if (currentStep === 2) {
      return form.weeklyActivity.trim() !== "";
    }
    return true;
  };
  const handleNext = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const saveDraft = () => alert("Draft saved!");
  const submitReport = async () => {
    const groupNameToId = {};
    groups.forEach((g) => {
      const name = g.groupName || g;
      const id = g.groupId || g.id;
      groupNameToId[name] = id;
    });

    const sessionsWithIds = form.sessions.map((s) => ({
      ...s,
      groupId: Number(s.groupId) || null,
    }));

    const channelActivities = Object.entries(selectedChannels)
      .filter(([_, val]) => val.show && val.content.trim())
      .map(([channelName, val]) => ({
        channelName,
        activity: val.content,
      }));

    const submitForm = {
      ...form,
      groupNames: form.groups.join(", "),
      channelActivities,
      sessions: sessionsWithIds,
    };

    try {
      const response = await axios.put(
        `${API_ENDPOINT}/api/LecturerReports/EditMyReport?reportId=${reportId}`,
        submitForm,
        { withCredentials: true }
      );
      // Use the reportId returned from the API for file upload
      const updatedReportId = response?.data?.reportId || reportId;
      if (response?.data?.status && sessionFiles && sessionFiles.length > 0) {
        for (const file of sessionFiles) {
          await uploadAttendanceRegister(updatedReportId, file);
        }
      }
      navigate(`/view-lecture-report/${updatedReportId}`);
    } catch (error) {
      // Optionally handle error
    }
  };
  // Add file upload function
  const uploadAttendanceRegister = async (reportId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("reportId", reportId);

    try {
      await axios.post(
        `${API_ENDPOINT}/api/LecturerReports/UploadAttendanceRegister`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error) {
      // Optionally handle error
    }
  };
  const getCurrentWeekDates = () => ({
    start: form.startDate,
    end: form.endDate,
  });

  // Prepare channelActivities object for EditReportForm (channelName -> activity)
  const channelActivities = {};
  allChannels.forEach((ch) => {
    if (selectedChannels[ch.channelName]?.show) {
      channelActivities[ch.channelName] =
        selectedChannels[ch.channelName]?.content || "";
    }
  });

  return (
    <div className="edit-report-page-bg-wide">
      <EditReportForm
        reportType="Edit"
        steps={steps}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        reportData={{
          ...form,
          modules: [selectedModule],
          channelActivities: channelActivities,
        }}
        setReportData={setForm}
        modules={[selectedModule]}
        communicationChannels={allChannels}
        selectedChannels={selectedChannels}
        handleChannelSelection={handleChannelSelection}
        updateChannelActivity={updateChannelActivity}
        addSession={addSessionForm}
        removeSession={removeSessionForm}
        updateSession={updateSessionForm}
        availableGroups={groups}
        canProceedToNext={canProceedToNext}
        handleNext={handleNext}
        setSessionFiles={setSessionFiles}
        sessionFiles={sessionFiles}
        getCurrentWeekDates={getCurrentWeekDates}
        showReportPreview={showReportPreview}
        setShowReportPreview={setShowReportPreview}
        submitReport={submitReport}
        saveDraft={saveDraft}
      />
    </div>
  );
};

export default EditReportPage;
