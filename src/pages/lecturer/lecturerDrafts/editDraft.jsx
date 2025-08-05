import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "./editDraft.css";
import DraftReportForm from "../../../components/lecturer/draftForm/draftForm";
import { FileText, Users, MessageSquare, BookOpen } from "lucide-react";

const EditDraft = () => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const { draftId } = useParams();
  const nav = useNavigate();
  const [selectedChannels, setSelectedChannels] = useState({});
  const [channels, setChannels] = useState([]);
  const [groups, setGroups] = useState([]);
  const [sessionFiles, setSessionFiles] = useState(null);
  const [showReportPreview, setShowReportPreview] = useState(false);
  const steps = [
    { number: 1, title: "Module & Dates", icon: BookOpen },
    { number: 2, title: "Weekly Report", icon: FileText },
    { number: 3, title: "Communication", icon: MessageSquare },
    { number: 4, title: "Sessions", icon: Users },
  ];
  const [currentStep, setCurrentStep] = useState(1);
  const [reportData, setReportData] = useState({
    modules: [],
    moduleIds: [],
    startDate: "",
    endDate: "",
    suggestions: "",
    challenges: "",
    channels: [],
    channelActivities: {},
    weeklyActivity: "",
    sessions: [],
    hasAttendanceRegister: false,
    draftAttendanceRegisterFileName: "",
  });

  //Drafts
  const getDraft = async (draftId) => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}/api/LecturerReports/ViewMyDraft`,
        {
          params: { draftId: draftId },
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
        {
          validateStatus: () => true,
        }
      );

      if (response?.data?.status) {
        const draftModules = response.data.modules || [];
        const mergedChannelActivities = {};
        const draftSessions = response.data.sessions || [];

        response.data.channelActivities.forEach(({ channelName, activity }) => {
          if (mergedChannelActivities[channelName]) {
            mergedChannelActivities[channelName] += `\n${activity}`;
          } else {
            mergedChannelActivities[channelName] = activity;
          }
        });
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

        setReportData({
          modules: response.data.modules,
          moduleIds: draftModules.map((m) => m.moduleId),
          startDate: response.data.startDate,
          endDate: response.data.endDate,
          suggestions: response.data.suggestions,
          challenges: response.data.challenges,
          channels: channelList,
          channelActivities: normalizedSummaries,
          weeklyActivity: response.data.weeklyActivity,
          sessions: draftSessions.map((s, i) => ({
            sessionId: s.sessionId,
            sessionNumber: s.sessionNumber || i + 1,
            sessionDate: s.sessionDate,
            numberOfStudents: s.numberOfStudents,
            groupId: s.group.groupId,
          })),
          hasAttendanceRegister: response.data.hasAttendanceRegister,
          draftAttendanceRegisterFileName:
            response.data.draftAttendanceRegisterFileName,
        });
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
        console.log(response.data.message);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error.response?.data?.message || "An error occurred.");
    }
  };
  const getCommunicationChannel = async () => {
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
  };
  useEffect(() => {
    getCommunicationChannel();
    if (draftId) {
      getDraft(draftId);
    }
  }, [draftId, getCommunicationChannel, getDraft]);

  const updateDraft = async (e) => {
    e.preventDefault();

    const channelActivities = Object.entries(selectedChannels)
      .filter(([_, value]) => value.show && value.content.trim())
      .map(([channelName, value]) => ({
        channelName,
        activity: value.content,
      }));

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

  const submitReport = async (e) => {
    e.preventDefault();

    if (!!sessionFiles && !reportData.hasAttendanceRegister) {
      toast.error("Please upload a supporting document before submitting.");

      return;
    }

    const channelActivities = Object.entries(selectedChannels)
      .filter(([_, value]) => value.show && value.content.trim())
      .map(([channelName, value]) => ({
        channelName,
        activity: value.content,
      }));

    const payload = {
      moduleIds: reportData.moduleIds,
      startDate: reportData.startDate,
      endDate: reportData.endDate,
      suggestions: reportData.suggestions,
      challenges: reportData.challenges,
      channelActivities: channelActivities,
      weeklyActivity: reportData.weeklyActivity,
      sessions: reportData.sessions,
      draftId: draftId,
    };
    console.log("this is the payload for the report " + draftId);
    if (sessionFiles) {
      await uploadDraftAttendanceRegister(draftId, sessionFiles);
    }

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

  //communication channels and activities
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
        return Object.values(selectedChannels).every(
          (val) => !val.show || (val.content && val.content.trim())
        );
      case 4:
        return (
          (reportData.sessions.length > 0 &&
            reportData.sessions.every(
              (s) => s.groupId > 0 && s.numberOfStudents > 0 && s.sessionDate
            ) &&
            sessionFiles !== null) ||
          reportData.hasAttendanceRegister
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
    <div>
      <DraftReportForm
        reportType={"Draft"}
        steps={steps}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        reportData={reportData}
        setReportData={setReportData}
        getModuleGroups={getModuleGroups}
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
        saveDraft={updateDraft}
      />
    </div>
  );
};

export default EditDraft;
