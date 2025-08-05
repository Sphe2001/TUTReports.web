import "./homePage.css";

const ImageSlideshow = () => {
  return (
    <div className="slideshow">
      <img src={require("../../assets/image1.png")} alt="Slide 1" />
      <img src={require("../../assets/maincamp.jpg")} alt="Slide 2" />
      <img src={require("../../assets/emalcamp.jpg")} alt="Slide 3" />
      <img src={require("../../assets/soshacamp.jpg")} alt="Slide 4" />
    </div>
  );
};

export default ImageSlideshow;
