import react from "react";
import "./aboutme.css";
import selfPhoto from "../assets/images/selfPhoto.jpg";
import { InstagramEmbed } from "react-social-media-embed";

function AboutMe() {
  return (
    <div>
      <div className="about-me-container">
        <div className="self-photo-container">
          <img
            src={selfPhoto}
            alt="Katie Mossy Creations"
            className="self-photo"
          />
        </div>
        <p className="about-me-text">
          Welcome to Mossy Creations, where the beauty of nature, the allure of
          fantasy, and the intrigue of the macabre intertwine, guided by the
          vision of a dedicated artisan.
          <br />
          <br />
          As the driving force behind Mossy Creations, I am passionate about
          crafting pieces that embody the essence of the wild and the whimsical.
          With meticulous attention to detail and a deep appreciation for the
          transformative power of art, each creation is carefully handcrafted to
          evoke a sense of wonder and enchantment.
          <br />
          <br />
          From haunting terrariums to whimsical fairy gardens and captivating
          woodland decor, every Mossy Creation reflects my commitment to quality
          craftsmanship and artistic expression. These creations are not just
          decorative pieces but portals to otherworldly realms, where
          imagination reigns supreme.
          <br />
          <br />
          Collaboration is welcomed at Mossy Creations, as I am open to working
          with clients to bring their unique visions to life. However, at the
          heart of this venture lies the singular dedication and passion of one
          artist, bringing forth creations that resonate with the soul and spark
          the imagination.
          <br />
          <br />
          Whether you're seeking a unique statement piece or have a specific
          vision in mind, Mossy Creations is here to turn your dreams into
          reality. Join me on this journey into the heart of enchantment, where
          mossy marvels flourish and imagination knows no bounds.
          <br />
          <br />
          Welcome to Mossy Creations—a place where artistry thrives, guided by a
          shared love for the natural world and a passion for all things
          magical.
        </p>
      </div>
      <div className="insta-embed">
        <InstagramEmbed
          url="https://www.instagram.com/p/C6Unpn4uvTV/"
          width={328}
          captioned
        />
      </div>
    </div>
  );
}

export default AboutMe;
