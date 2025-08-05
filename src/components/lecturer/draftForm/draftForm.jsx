import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  CheckCircle,
  Eye,
  Upload,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";
import WeeklyReportPreview from "../reportPreview/reportPreview";
import { motion } from "framer-motion";

const DraftReportForm = ({
  reportType,
  steps,
  currentStep,
  setCurrentStep,
  reportData,
  setReportData,
  communicationChannels,
  selectedChannels,
  handleChannelSelection,
  updateChannelActivity,
  addSession,
  removeSession,
  updateSession,
  availableGroups,
  canProceedToNext,
  handleNext,
  setSessionFiles,
  sessionFiles,
  showReportPreview,
  setShowReportPreview,
  submitReport,
  saveDraft,
}) => {
  const [previewData, setPreviewData] = useState(null);

  return (
    <div className="report-form-container">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="report-form-header"
      >
        <div>
          {reportType === "Edit" && <h2>Edit Report</h2>}
          {reportType === "Draft" && <h2>Complete Report</h2>}
          {reportType === "Create" && <h2>Create Weekly Report</h2>}
          <p>Submit your weekly report</p>
        </div>
        <button
          onClick={() => window.history.back()}
          className="report-form-back-button"
        >
          <ArrowLeft size={16} />
          {reportType === "Edit" && <span>Back to Reports</span>}
          {reportType === "Draft" && <span>Back to Drafts</span>}
          {reportType === "Create" && <span>Back to Reports</span>}
        </button>
      </motion.div>

      {/* Step Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="report-form-step-indicator"
      >
        {steps.map((step, index) => (
          <div className="report-form-step" key={step.number}>
            <div
              className={`circle ${currentStep >= step.number ? "active" : ""}`}
            >
              <step.icon size={25} />
            </div>
            <p
              className={`step-title ${
                currentStep >= step.number ? "active" : ""
              }`}
            >
              {step.title}
            </p>
            {index < steps.length - 1 && (
              <div
                className={`divider ${
                  currentStep > step.number ? "active" : ""
                }`}
              />
            )}
          </div>
        ))}
      </motion.div>

      {/* Step Content */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="report-form-step-content"
      >
        {currentStep === 1 && (
          <div>
            <div className="step-header">
              <h2>Module & Date Selection</h2>
            </div>

            <label>Select Module *</label>

            <div className="report-form-modules-list-container">
              {Array.isArray(reportData.modules) &&
              reportData.modules.length > 0 ? (
                reportData.modules.map((module) => {
                  const isChecked =
                    reportData.moduleIds?.includes(module.moduleId) || false;

                  return (
                    <label key={module.moduleId}>
                      <input
                        type="checkbox"
                        value={module.moduleId}
                        checked={isChecked}
                        disabled
                        onChange={(e) => {
                          const moduleId = parseInt(e.target.value, 10);
                          const checked = e.target.checked;

                          setReportData((prev) => {
                            const alreadySelected =
                              prev.moduleIds.includes(moduleId);

                            if (checked && !alreadySelected) {
                              return {
                                ...prev,
                                moduleIds: [...prev.moduleIds, moduleId],
                              };
                            }

                            if (!checked && alreadySelected) {
                              return {
                                ...prev,
                                moduleIds: prev.moduleIds.filter(
                                  (id) => id !== moduleId
                                ),
                              };
                            }

                            return prev;
                          });
                        }}
                      />
                      <div className="module-name-code-container">
                        <span>{module.moduleName}</span> -{" "}
                        <strong>{module.moduleCode}</strong>
                      </div>
                    </label>
                  );
                })
              ) : (
                <p>Loading modules...</p>
              )}
            </div>

            <div className="report-form-date-grid">
              <div>
                <label>Start Date</label>
                <input
                  type="date"
                  value={reportData.startDate}
                  onChange={(e) =>
                    setReportData((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  disabled
                />
              </div>
              <div>
                <label>End Date </label>
                <input
                  type="date"
                  value={reportData.endDate}
                  onChange={(e) =>
                    setReportData((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  disabled
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <div className="step-header">
              <h2>Weekly Report Details</h2>
            </div>

            <label>Weekly Activity *</label>
            <textarea
              value={reportData.weeklyActivity}
              onChange={(e) =>
                setReportData((prev) => ({
                  ...prev,
                  weeklyActivity: e.target.value,
                }))
              }
              placeholder="Describe your weekly lecturing activities..."
              required
            />

            <label>Challenges Faced </label>
            <textarea
              value={reportData.challenges}
              onChange={(e) =>
                setReportData((prev) => ({
                  ...prev,
                  challenges: e.target.value,
                }))
              }
              placeholder="Describe any challenges you encountered..."
            />

            <label>Suggestions for Improvement </label>
            <textarea
              value={reportData.suggestions}
              onChange={(e) =>
                setReportData((prev) => ({
                  ...prev,
                  suggestions: e.target.value,
                }))
              }
              placeholder="Provide suggestions for improvement.."
            />
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <div className="step-header">
              <h2>Communication Channel Activities</h2>
              <p>
                Select the communication channels you used and describe your
                activities
              </p>
            </div>

            {communicationChannels.map((channel) => (
              <div className="report-form-channel-box" key={channel.channelId}>
                <div className="report-form-checkbox-container">
                  <input
                    type="checkbox"
                    checked={
                      selectedChannels[channel.channelName]?.show || false
                    }
                    onChange={() => handleChannelSelection(channel.channelName)}
                  />
                  <span>{channel.channelName}</span>
                </div>

                {selectedChannels[channel.channelName]?.show && (
                  <div>
                    <textarea
                      value={
                        selectedChannels[channel.channelName]?.content || ""
                      }
                      onChange={(e) =>
                        updateChannelActivity(
                          channel.channelName,
                          e.target.value
                        )
                      }
                      placeholder={`Describe your activities in ${channel.channelName}...`}
                      required
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <div className="report-form-session-header">
              <h2>Lecturing Sessions</h2>
              <button onClick={addSession} className="report-form-btn add">
                <Plus size={16} /> Add Session
              </button>
            </div>

            {reportData.sessions.length === 0 ? (
              <div className="empty-sessions">
                <p>
                  No sessions added yet. Click "Add Session" to get started.
                </p>
              </div>
            ) : (
              reportData.sessions.map((session, index) => (
                <div className="session-box" key={index}>
                  <div className="session-box-header">
                    <h3>Session {session.sessionNumber}</h3>
                    <button
                      onClick={() => removeSession(index)}
                      className="report-form-remove-btn"
                    >
                      <Trash2 size={25} />
                    </button>
                  </div>

                  <div className="report-form-session-grid">
                    <div>
                      <label>Student Group *</label>
                      <select
                        value={session.groupId}
                        onChange={(e) =>
                          updateSession(
                            index,
                            "groupId",
                            parseInt(e.target.value)
                          )
                        }
                        required
                      >
                        <option value={0}>Select group</option>
                        {availableGroups.map((group) => (
                          <option key={group.groupId} value={group.groupId}>
                            Group - {group.groupName} ({group.totalStudents}{" "}
                            students)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label>Students Present * </label>
                      <input
                        type="number"
                        value={session.numberOfStudents}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          const inputValue = e.target.value;
                          if (inputValue === "") {
                            updateSession(index, "numberOfStudents", "");
                            return;
                          }
                          const group = availableGroups.find(
                            (g) => g.groupId === session.groupId
                          );
                          const max = group?.totalStudents || 0;

                          if (value <= max) {
                            updateSession(index, "numberOfStudents", value);
                          }
                          if (value > max) {
                            toast.error(
                              `You cannot enter more than ${max} students for this group.`
                            );
                            return;
                          }
                        }}
                        min="0"
                        max={
                          availableGroups.find(
                            (g) => g.groupId === session.groupId
                          )?.totalStudents || 0
                        }
                        required
                      />
                    </div>
                    <div>
                      <label>Session Date *</label>
                      <input
                        type="date"
                        value={session.sessionDate}
                        min={reportData.startDate}
                        max={(() => {
                          const today = new Date().toISOString().split("T")[0];
                          return reportData.endDate &&
                            reportData.endDate < today
                            ? reportData.endDate
                            : today;
                        })()}
                        onChange={(e) =>
                          updateSession(index, "sessionDate", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
            <div className="report-form-upload-container">
              <div className="report-form-upload-header">
                <Upload className="report-form-upload-icon" />
                <div>
                  <label
                    htmlFor="file-upload"
                    className="report-form-file-upload-label"
                  >
                    Upload Supporting Documents
                  </label>
                  <p className="report-form-upload-description">
                    Upload attendance register or other supporting documents
                  </p>
                </div>
              </div>
              <div className="report-form-file-input-with-name">
                <input
                  id="file-upload"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setSessionFiles(file);
                      toast.success(`Selected file: "${file.name}"`);
                    }
                  }}
                  accept=".pdf,.txt,.docx,.doc,.jpg,.jpeg,.png,.xlsx"
                />
                {reportData.hasAttendanceRegister &&
                  reportData.draftAttendanceRegisterFileName && (
                    <div className="file-selected-container">
                      <div className="report-form-selected-file">
                        <FileText size={16} />
                        <span>
                          {reportData.draftAttendanceRegisterFileName}
                        </span>
                        <CheckCircle
                          size={16}
                          className="report-form-file-success"
                        />
                      </div>
                    </div>
                  )}

                {sessionFiles && (
                  <div className="file-selected-container">
                    <div className="report-form-selected-file">
                      <FileText size={16} />
                      <span>{sessionFiles.name}</span>
                      <CheckCircle
                        size={16}
                        className="report-form-file-success"
                      />
                    </div>
                    <button
                      className="file-remove-btn"
                      onClick={() => {
                        setSessionFiles(null);
                        toast.success(`Removed "${sessionFiles.name}"`);
                      }}
                    >
                      <Trash2 size={25} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="report-form-navigation-buttons">
          <button
            onClick={() => setCurrentStep((prev) => prev - 1)}
            disabled={currentStep === 1}
            className="report-form-btn prev"
          >
            <ArrowLeft size={16} /> Previous
          </button>
          {currentStep === 4 && (
            <button onClick={saveDraft} className="report-form-btn draft">
              Save Draft
            </button>
          )}

          <button
            onClick={() => {
              if (currentStep === 4) {
                const selectedModules = (reportData.modules || []).filter((m) =>
                  reportData.moduleIds.includes(m.moduleId)
                );

                const sessionsWithDetails = reportData.sessions.map((s) => {
                  const group = availableGroups.find(
                    (g) => g.groupId === s.groupId
                  );
                  return {
                    ...s,
                    moduleCode: group?.moduleCode || "Unknown",
                    groupName: group?.groupName || "Unknown",
                  };
                });

                const channelActivities = {};
                Object.entries(selectedChannels).forEach(
                  ([channelName, data]) => {
                    if (data.show && data.content?.trim()) {
                      channelActivities[channelName] = data.content;
                    }
                  }
                );

                const previewObject = {
                  moduleCode: selectedModules
                    .map((m) => m.moduleCode)
                    .join(", "),
                  startDate: reportData.startDate,
                  endDate: reportData.endDate,
                  weeklyActivity: reportData.weeklyActivity,
                  challenges: reportData.challenges,
                  suggestions: reportData.suggestions,
                  channelActivities: channelActivities,
                  sessions: sessionsWithDetails,
                };

                setPreviewData(previewObject);
                setShowReportPreview(true);
              } else {
                handleNext();
              }
            }}
            disabled={!canProceedToNext()}
            className="report-form-btn next"
          >
            {currentStep === 4 ? (
              <>
                <Eye size={16} /> Preview Report
              </>
            ) : (
              <>
                Next <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </motion.div>
      {showReportPreview && (
        <WeeklyReportPreview
          onSubmit={submitReport}
          onClose={() => setShowReportPreview(false)}
          report={previewData}
        />
      )}
    </div>
  );
};

export default DraftReportForm;
