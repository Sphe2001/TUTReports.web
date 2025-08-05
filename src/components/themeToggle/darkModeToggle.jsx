import { useEffect, useState } from "react";
import { ReactComponent as Sun } from "../../assets/Sun.svg";
import { ReactComponent as Moon } from "../../assets/Moon.svg";
import "./darkModeToggle.css";

const DarkModeToggle = () => {
 const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.setAttribute("data-theme", "dark");
      setIsDarkMode(true);
    } else {
      document.body.setAttribute("data-theme", "light");
      setIsDarkMode(false);
    }
  }, []);

  const toggleTheme = (e) => {
    const checked = e.target.checked;
    setIsDarkMode(checked);

    if (checked) {
      document.body.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className='dark_mode'>
            <input
                className='dark_mode_input'
                type='checkbox'
                id='darkmode-toggle'
                onChange={toggleTheme}
                checked={isDarkMode}
            />
            <label className='dark_mode_label' for='darkmode-toggle'>
                <Sun />
                <Moon />
            </label>
        </div>
  );
};

export default DarkModeToggle;
