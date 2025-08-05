import aboutImage from "../../assets/about-image.jpg";
import "./aboutPage.css";

const AboutPage = () => (
  <main className="about-section">
    <div className="about-layout">
      <div className="about-info">
        <h1 className="about-title">About the Lecturer Report System</h1>
        <p className="about-description">
          The Lecturer Report System is designed to simplify and streamline
          weekly academic reporting. It helps staff manage submissions
          efficiently while enhancing transparency and accountability across
          departments.
        </p>
        <ul className="about-features">
          <li>🛡️ Easy, secure report submission</li>
          <li>⏰ Automated reminders and notifications</li>
          <li>📂 Centralized access for departments</li>
          <li>🔍 Improved transparency and accountability</li>
        </ul>
      </div>
      <div className="about-image-wrapper">
        <img
          src={aboutImage}
          alt="Illustration of system use"
          className="about-section-img"
        />
      </div>
    </div>
  </main>
);

export default AboutPage;
