import "./style.css";

const TopBanner = () => {
  return (
    <div className="top-banner-container">
      <h3 className="top-banner-text">
        All products include{" "}
        <span style={{ color: "red" }}>free shipping!</span>
      </h3>
    </div>
  );
};

export default TopBanner;
