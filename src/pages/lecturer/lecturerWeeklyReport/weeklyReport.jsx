import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./weeklyReport.css";
import toast from "react-hot-toast";
import axios from "axios";

import { FileText, Users, MessageSquare, BookOpen } from "lucide-react";
import WeeklyReportForm from "../../../components/lecturer/reportForm/reportForm";

const WeeklyReport = () => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const nav = useNavigate();
  const steps = [
    { number: 1, title: "Module & Dates", icon: BookOpen },
    { number: 2, title: "Weekly Report", icon: FileText },
    { number: 3, title: "Communication", icon: MessageSquare },
    { number: 4, title: "Sessions", icon: Users },
  ];
  const [currentStep, setCurrentStep] = useState(1);
  const [showReportPreview, setShowReportPreview] = useState(false);

  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState({});
  const [groups, setGroups] = useState([]);
  const [channels, setChannels] = useState([]);
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [sessionFiles, setSessionFiles] = useState(null);

  const [reportData, setReportData] = useState({
    moduleIds: [],
    startDate: "",
    endDate: "",
    suggestions: "",
    challenges: "",
    channelActivities: [],
    weeklyActivity: "",
    sessions: [],
  });

  const getModules = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}/api/LecturerAcademy/GetMyModules`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Modules API response:", response.data);
      if (response?.data?.status) {
        setModules(response.data.modules);
      } else {
        toast.error(response.data.message || "Failed to load modules");
      }
    } catch (error) {
      console.error("Error fetching modules:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  }, [API_ENDPOINT]);

  const getCommunicationChannel = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}/api/AcademyGet/GetAllCommunicationChannels`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Channels API response:", response.data);
      if (response?.data?.status) {
        setChannels(response.data.channels);
      } else {
        toast.error(response.data.message || "Failed to load channels");
      }
    } catch (error) {
      console.error("Error fetching channels:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  }, [API_ENDPOINT]);
  useEffect(() => {
    getModules();
    getCommunicationChannel();
  }, [getModules, getCommunicationChannel]);

  const getModuleGroups = async (moduleIds) => {
    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/LecturerAcademy/GetlecturerModuleGroups`,
        { moduleIds },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response?.data?.status) {
        console.log(
          "This are the groups for the selected module" +
            " " +
            response?.data?.groups
        );
        setGroups(response.data.groups);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //getStart and End date of the report
  function getCurrentWeekDates() {
    const today = new Date();
    const day = today.getDay();

    const monday = new Date(today);
    monday.setDate(today.getDate() - ((day + 6) % 7));

    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);

    const format = (date) => date.toISOString().split("T")[0];

    return {
      monday: format(monday),
      friday: format(friday),
    };
  }

  //communication channels and activities
  const handleChannelSelection = (channelId) => {
    if (selectedChannels.includes(channelId)) {
      setSelectedChannels((prev) => prev.filter((id) => id !== channelId));
      setReportData((prev) => {
        const { [channelId]: _, ...remaining } = prev.channelActivities || {};
        return {
          ...prev,
          channelActivities: remaining,
        };
      });
    } else {
      setSelectedChannels((prev) => [...prev, channelId]);
      setReportData((prev) => ({
        ...prev,
        channelActivities: {
          ...prev.channelActivities,
          [channelId]: "",
        },
      }));
    }
  };

  const updateChannelActivity = (channelId, value) => {
    setReportData((prev) => ({
      ...prev,
      channelActivities: {
        ...prev.channelActivities,
        [channelId]: value,
      },
    }));
  };

  //handle sessions
  const addSession = () => {
    const newSession = {
      sessionNumber: 1,
      numberOfStudents: "",
      groupId: 0,
      sessionDate: "",
    };

    setReportData((prev) => ({
      ...prev,
      sessions: [...prev.sessions, newSession],
    }));
  };

  const updateSession = (index, field, value) => {
    setReportData((prev) => {
      const updatedSessions = [...prev.sessions];
      const sessionToUpdate = { ...updatedSessions[index], [field]: value };

      if (field === "groupId" && value !== 0) {
        const sameGroupSessions = updatedSessions.filter(
          (s, i) => s.groupId === value && i !== index
        );

        sessionToUpdate.sessionNumber = sameGroupSessions.length + 1;
      }

      updatedSessions[index] = sessionToUpdate;

      return {
        ...prev,
        sessions: updatedSessions,
      };
    });
  };

  const removeSession = (index) => {
    setReportData((prev) => ({
      ...prev,
      sessions: prev.sessions.filter((_, i) => i !== index),
    }));
  };

  //report submition
  const submitReport = async (e) => {
    e.preventDefault();

    if (sessionFiles === null) {
      toast.error("Please upload a supporting document before submitting.");

      return;
    }

    const channelActivities = selectedChannels
      .filter((channelId) => reportData.channelActivities[channelId]?.trim())
      .map((channelId) => {
        const channel = channels.find((c) => c.channelId === channelId);
        return {
          channelName: channel?.channelName || "Unknown",
          activity: reportData.channelActivities[channelId],
        };
      });

    const payload = {
      moduleIds: reportData.moduleIds,
      startDate: reportData.startDate,
      endDate: reportData.endDate,
      suggestions: reportData.suggestions,
      challenges: reportData.challenges,
      channelActivities: channelActivities,
      weeklyActivity: reportData.weeklyActivity,
      sessions: reportData.sessions,
      draftId: 0,
    };

    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/LecturerReports/SubmitReport`,
        payload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
        {
          validateStatus: () => true,
        }
      );

      if (response?.data?.status) {
        const reportId = response.data.reportId;
        if (sessionFiles) {
          await uploadAttendanceRegister(reportId, sessionFiles);
        }

        toast.success(response.data.message);
        nav("/report-history");
      } else {
        toast.error(response.data.message || "Failed to submit report.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An unexpected error occurred."
      );
    }
  };

  const uploadAttendanceRegister = async (reportId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("reportId", reportId);

    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/LecturerReports/UploadAttendanceRegister`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
        {
          validateStatus: () => true,
        }
      );

      if (response?.data?.status) {
        console.log(response.data.message);
        toast.success(response.data.message);
      } else {
        console.log(response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //Drafts
  const saveDraft = async (e) => {
    e.preventDefault();

    if (!reportData.moduleIds) {
      toast.error("Please select at least one module.");

      return;
    }

    const channelActivities = selectedChannels
      .filter((channelId) => reportData.channelActivities[channelId]?.trim())
      .map((channelId) => {
        const channel = channels.find((c) => c.channelId === channelId);
        return {
          channelName: channel?.channelName || "Unknown",
          activity: reportData.channelActivities[channelId],
        };
      });

    const draftPayload = {
      moduleIds: reportData.moduleIds,
      startDate: reportData.startDate,
      endDate: reportData.endDate,
      suggestions: reportData.suggestions || "",
      challenges: reportData.challenges || "",
      channelActivities: channelActivities || [],
      weeklyActivity: reportData.weeklyActivity || "",
      sessions: reportData.sessions || [],
    };

    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/LecturerReports/CreateDraft`,
        draftPayload,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
        {
          validateStatus: () => true,
        }
      );

      if (response?.data?.status) {
        const draftId = response.data.draftId;

        if (sessionFiles) {
          await uploadDraftAttendanceRegister(draftId, sessionFiles);
        }

        toast.success(response.data.message || "Draft saved successfully!");
        nav("/lecturer-drafts");
      } else {
        toast.error(response.data.message || "Failed to save draft.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving draft.");
    }
  };
  const uploadDraftAttendanceRegister = async (draftId, file) => {
    const formData = new FormData();
    formData.append("draftAttendanceRegister", file);
    formData.append("draftId", draftId);

    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/LecturerReports/UploadDraftAttendanceRegister`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
        {
          validateStatus: () => true,
        }
      );

      if (response?.data?.status) {
        console.log(response.data.message);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //Navigation between the steps
  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return (
          reportData.moduleIds.length > 0 &&
          reportData.startDate &&
          reportData.endDate
        );
      case 2:
        return reportData.weeklyActivity.trim();
      case 3:
        return selectedChannels.every((channelId) =>
          reportData.channelActivities?.[channelId]?.trim()
        );
      case 4:
        return (
          reportData.sessions.length > 0 &&
          reportData.sessions.every(
            (s) => s.groupId > 0 && s.numberOfStudents > 0 && s.sessionDate
          ) &&
          sessionFiles !== null
        );
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      getModuleGroups(reportData.moduleIds);
    }
    if (currentStep === 2) {
      if (!reportData.weeklyActivity.trim()) {
        toast.error("Please fill in the Weekly Activity before proceeding.");
        return;
      }
    }

    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <div className="lecturer-Weekly-Report-page">
      <WeeklyReportForm
        reportType={"Create"}
        steps={steps}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        reportData={reportData}
        setReportData={setReportData}
        selectedModule={selectedModule}
        setSelectedModule={setSelectedModule}
        getCurrentWeekDates={getCurrentWeekDates}
        getModuleGroups={getModuleGroups}
        modules={modules}
        communicationChannels={channels}
        selectedChannels={selectedChannels}
        handleChannelSelection={handleChannelSelection}
        updateChannelActivity={updateChannelActivity}
        addSession={addSession}
        removeSession={removeSession}
        updateSession={updateSession}
        availableGroups={groups}
        canProceedToNext={canProceedToNext}
        handleNext={handleNextStep}
        sessionFiles={sessionFiles}
        setSessionFiles={setSessionFiles}
        setShowReportPreview={setShowReportPreview}
        showReportPreview={showReportPreview}
        submitReport={submitReport}
        saveDraft={saveDraft}
      />
    </div>
  );
};

export default WeeklyReport;
