import "./App.css";
import React from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
function App() {
  const [file, setFile] = React.useState();
  const [img, setImg] = React.useState([]);
  const [imgKey, setImgKey] = React.useState();
  const [showSavedImages, setShowSavedImages] = React.useState(false);
  const handleChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };
  React.useEffect(() => {
    axios.get("http://localhost:3000/list").then((res) => {
      setImgKey(res.data);
    });
  });
  React.useEffect(() => {
    imgKey?.map((l) => {
      axios.get(`http://localhost:3000/download/${l}`).then((res) => {
        try {
          if (!img.includes(res.data)) {
            setImg([...img, res.data]);
          }
        } catch (error) {
          console.log("ERROR:", error);
        }
      });
    });
  }, [imgKey]);
  console.log(imgKey);
  const handleFileUpload = () => {
    console.log("file", file);
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post("http://localhost:3000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log("res", res);
      });
  };
  console.log("img", img);

  return (
    <div className="App">
      <div class="drag-area">
        <div class="icon">
          <i class="fas fa-cloud-upload-alt"></i>
        </div>
        <header>S3 File Uploader</header>
        <input type="file" onChange={(e) => handleChange(e)} />
        <Button
          style={{ backgroundColor: "#90cafa", color: "#fff" }}
          onClick={handleFileUpload}
        >
          Upload
        </Button>
      </div>
      <Button
        style={{ margin: "26px", backgroundColor: "#90cafa", color: "#fff" }}
        variant="outlined"
        onClick={() => setShowSavedImages(!showSavedImages)}
      >
        {showSavedImages ? "Hide Saved Files" : "Show Saved Files"}
      </Button>
      <Box sx={{ p: 2, border: "2px dashed #90cafa" }}>
        {showSavedImages
          ? img.map((pic, key) => (
              <a
                key={key}
                href={pic}
                style={{
                  padding: "20px",
                  color: "#90cafa",
                  fontSize: "bold",
                  textDecoration: "none",
                }}
              >
                <b>{pic?.split("/")[3]}</b>
              </a>
            ))
          : null}
      </Box>
    </div>
  );
}

export default App;
