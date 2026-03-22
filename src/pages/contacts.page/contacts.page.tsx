export const ContactsPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Contact Us</h1>

      <div style={styles.grid}>
        
        {/* LEFT - Contact Info */}
        <div style={styles.card}>
          <h2 style={styles.subHeading}>Get in Touch</h2>

          <p><strong>📍 Address:</strong><br />Baneshwor, Kathmandu, Nepal</p>

          <p><strong>📞 Phone:</strong><br />
            <a href="tel:+9779864638141" style={styles.link}>
              +977 9864638141
            </a>
          </p>

          <p><strong>📧 Email:</strong><br />
            <a href="mailto:peoplescommerce@gmail.com" style={styles.link}>
              peoplescommerce@gmail.com
            </a>
          </p>

          <p><strong>🕒 Working Hours:</strong><br />Sun–Fri, 9 AM – 6 PM</p>

          <p>
            <strong>🌐 Facebook:</strong><br />
            <a
              href="https://www.facebook.com/peoplesreviewweekly/"
              target="_blank"
              rel="noreferrer"
              style={styles.link}
            >
              Visit our page
            </a>
          </p>
        </div>

        {/* RIGHT - Contact Form */}
        <div style={styles.card}>
          <h2 style={styles.subHeading}>Send a Message</h2>

          <form style={styles.form}>
            <input style={styles.input} type="text" placeholder="Your Name" required />
            <input style={styles.input} type="email" placeholder="Your Email" required />
            <input style={styles.input} type="text" placeholder="Phone (optional)" />

            <select style={styles.input}>
              <option>General Inquiry</option>
              <option>Product Inquiry</option>
              <option>Complaint</option>
            </select>

            <textarea
              style={{ ...styles.input, height: "100px" }}
              placeholder="Your Message"
              required
            ></textarea>

            <button type="submit" style={styles.button}>
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* MAP */}
      <div style={styles.mapContainer}>
        <iframe
          title="map"
          src="https://www.google.com/maps?q=27.675340,85.343344&z=15&output=embed"
          width="100%"
          height="300"
          style={styles.map}
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "50px 20px",
    fontFamily: "Arial",
    backgroundColor: "#f4f6f8",
  },
  heading: {
    textAlign: "center",
    fontSize: "36px",
    marginBottom: "40px",
    color: "#222",
  },
  subHeading: {
    marginBottom: "15px",
    color: "#333",
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "30px",
    justifyContent: "center",
    marginBottom: "40px",
  },
  card: {
    flex: "1 1 350px",
    maxWidth: "500px",
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  button: {
    padding: "12px",
    backgroundColor: "#e63946",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  link: {
    color: "#0077cc",
    textDecoration: "none",
  },
  mapContainer: {
    maxWidth: "1000px",
    margin: "0 auto",
  },
  map: {
    border: "0",
    borderRadius: "10px",
  },
};