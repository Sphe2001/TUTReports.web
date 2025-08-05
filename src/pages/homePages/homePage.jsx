import { useRef, useState, useEffect } from "react";
import NavigationBar from "../navigationPages/navigationBar";
import "./homePage.css";
import { motion } from "framer-motion";
import aboutImage from "../../assets/about-image.jpg";
import ImageSlideshow from "./ImageSlideshow";
import { FaArrowUp } from "react-icons/fa";

const features = [
  {
    icon: "🛡️",
    title: "Easy and Secure Report Submission",
    description:
      "Submit reports quickly with built-in security ensuring your data is protected.",
  },
  {
    icon: "⏰",
    title: "Automated Reminders and Notifications",
    description:
      "Stay on track with smart notifications for upcoming deadlines and report statuses.",
  },
  {
    icon: "📂",
    title: "Centralized Access for ICT Departments",
    description:
      "All your reporting tools and data in one place, accessible by authorized departments.",
  },
  {
    icon: "🔍",
    title: "Improved Transparency and Accountability",
    description:
      "Gain full visibility into report statuses and ensure team accountability.",
  },
];

const faqData = [
  {
    question: "Who can use the Lecturer Report System?",
    answer:
      "The system is designed for academic staff and authorized personnel across departments to submit and manage reports efficiently.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. The system uses built-in security protocols to protect all submitted data and maintain confidentiality.",
  },
  {
    question: "Can I access reports from multiple devices?",
    answer:
      "Yes, the system is web-based and accessible securely from any authorized device with internet access.",
  },
  {
    question: "How do I get notified about upcoming deadlines?",
    answer:
      "Smart notifications and automated reminders will keep you on track for all submission deadlines.",
  },
];

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="faq-item">
      <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        {question}
        <span className={`faq-icon ${isOpen ? "open" : ""}`}>▼</span>
      </button>
      {isOpen && <p className="faq-answer">{answer}</p>}
    </div>
  );
};

const HomePage = () => {
  const aboutRef = useRef(null);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const handleLearnMoreClick = (e) => {
    e.preventDefault();
    if (aboutRef.current) {
      aboutRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(() => {
    const handleScroll = () => {
      const isScrollable = document.body.scrollHeight > window.innerHeight;
      setShowTopBtn(isScrollable && window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="home-container">
      <NavigationBar />

      <section className="welcome-bg-section">
        <ImageSlideshow />
        <motion.h2
          className="welcome-section"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Welcome to The Lecturer Report System
        </motion.h2>
        <motion.p
          className="welcome-subtitle"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        >
          Streamline your weekly submissions
        </motion.p>

        <a
          href="#about"
          className="learn-more-btn"
          onClick={handleLearnMoreClick}
        >
          Learn More
        </a>
      </section>

      {/* About Section */}
      <section className="about-home-section" id="about" ref={aboutRef}>
        <div className="about-layout">
          <div className="about-info">
            <h2 className="about-title">About the Lecturer Report System</h2>
            <p className="about-description">
              The Lecturer Report System is designed to simplify and streamline
              weekly academic reporting. It helps staff manage submissions
              efficiently while enhancing transparency and accountability across
              departments.
            </p>
          </div>
          <div className="about-image-wrapper">
            <img
              src={aboutImage}
              alt="Illustration of system use"
              className="about-section-img"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="features-title">Features</h2>
        <div className="features-cards">
          {features.map(({ icon, title, description }, idx) => (
            <div key={idx} className="feature-card">
              <div className="feature-icon">{icon}</div>
              <h3 className="feature-title">{title}</h3>
              <p className="feature-description">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqData.map(({ question, answer }, index) => (
            <FAQItem key={index} question={question} answer={answer} />
          ))}
        </div>
      </section>
      {showTopBtn && (
        <button
          className="back-to-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
        >
          <FaArrowUp />
        </button>
      )}
    </div>
  );
};

export default HomePage;
