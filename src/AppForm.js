import React, { useEffect, useState, useRef } from "react"
import { makeStyles } from "@material-ui/core/styles"
import {
  Button,
  Typography,
  IconButton,
  Snackbar,
  CircularProgress,
} from "@material-ui/core/"
import MuiAlert from "@material-ui/lab/Alert"
import PhotoCamera from "@material-ui/icons/PhotoCamera"
import { verifyNID, facematchApi } from "./apis"
import img from "./pic.svg"

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}
const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  divContainer: {
    color: "#eeeeee",
    fontWeight: "400",
    fontSize: "16px",
    padding: "10px 18px 10px 10px",
    position: "absolute",
    top: "60px",
    left: "20px",
    width: "20%",
    background: "#c51162",
    borderRadius: "4px",
    textAlign: "left",
  },
  list: {
    marginBottom: "5px",
  },
  input: {
    display: "none",
  },
  firstSection: {
    margin: "60px 420px",
    width: "50%",
    background: "#0F181C",
    padding: "1% 3%",
    "box-shadow": "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
    // border: "1px solid white",
  },
  firstSection_div: {
    // marginLeft: "150px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontWeight: "bold",
    margin: "20px",
    // background: "red",
  },
}))
export default function AppForm() {
  const classes = useStyles()
  const [imgCap, setimgCap] = useState("")
  const [imgSrc, setimgSrc] = useState(img)
  const [imgSrc1, setimgSrc1] = useState(img)
  const [file1, setfile1] = useState("")
  const [file2, setfile2] = useState("")
  const [selfieImg, setselfieImg] = useState("")
  const [imgFile, setimgFile] = useState("")
  const [open, setOpen] = React.useState(false)
  const [openSuccess, setOpenSuccess] = React.useState(false)
  const [loading1, setloading1] = useState(false)
  const [loading2, setloading2] = useState(false)
  const [errorMsg, seterrorMsg] = useState("")
  const [successMsg, setsuccessMsg] = useState("")

  const [transaction_id, settransaction_id] = useState("")

  var vidRef = useRef()

  var imgRef = useRef()

  //   var canvas = useRef()

  //   let cwidth = 200
  //   let cheight = 200

  var imageCapture

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return
    }

    setOpen(false)
  }

  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return
    }

    setOpenSuccess(false)
  }
  useEffect(() => {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function (stream) {
          vidRef.current.srcObject = stream
          vidRef.current.classList.remove("hidden")

          getCapabilities(stream)
        })
        .catch(function (err) {
          console.log(err.message)
          console.log("Something went wrong!")
        })
    }
  }, [imageCapture])

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })

  let getCapabilities = (stream) => {
    imageCapture = new ImageCapture(stream.getVideoTracks()[0])
    setimgCap(imageCapture)
  }

  let handleFile = (e) => {
    setfile1(e.target.files[0])
    let reader = new FileReader()
    reader.onload = () => {
      if (reader.readyState === 2) {
        setimgSrc(reader.result)
      }
    }
    reader.readAsDataURL(e.target.files[0])
  }

  let handleFile1 = (e) => {
    setfile2(e.target.files[0])
    console.log(e.target.files[0])
    let reader = new FileReader()
    // e.preventDefault()
    reader.onload = () => {
      if (reader.readyState === 2) {
        setimgSrc1(reader.result)
        console.log("done")
      }
    }
    reader.readAsDataURL(e.target.files[0])
  }
  //capture selfie photo
  let capture = (e) => {
    e.preventDefault()
    imgCap
      .takePhoto()
      .then((blob) => {
        console.log("Took photo:", blob)
        imgRef.current.src = URL.createObjectURL(blob)
        imgRef.current.classList.remove("hidden")
        let myImg = blob
        setselfieImg(myImg)
      })
      .catch(function (error) {
        console.log("takePhoto() error: ", error)
      })
  }

  let convert = () => {
    var reader = new FileReader()
    reader.readAsDataURL(selfieImg)
    reader.onloadend = function () {
      var base64data = reader.result
      setimgFile(base64data)
      console.log(base64data)
    }
  }

  //verify NID to standards

  let verifyNid = async (e) => {
    if (file1 === "" || file2 === "") {
      seterrorMsg("please upload your national id")
      setOpen(true)
      return
    }
    e.preventDefault()
    try {
      setloading1(true)

      let fileFront = await toBase64(file1)
      let fileBack = await toBase64(file2)
      let f1 = fileFront.replace(/^data:image\/(png|jpeg);base64,/, "")
      let f2 = fileBack.replace(/^data:image\/(png|jpeg);base64,/, "")

      let { data } = await verifyNID({
        document_type: "egy_nid",
        data: {
          front_img: f1,
          back_img: f2,
          bundle_key: "ad17eb22b22c4916855a301679da1573",
        },
      })
      setloading1(false)
      console.log(data)
      settransaction_id(data.transaction_id)
      setsuccessMsg("document verified successfully")
      setOpenSuccess(true)
    } catch (err) {
      setloading1(false)
      if (err.response.data.error_code === 5001) {
        seterrorMsg(
          "insuficcent bundle, Please recharge your bundle and try again.",
        )
      }
      console.log("error", err.response.data)
    }
  }

  let upload = async (e) => {
    if (imgFile === "" || selfieImg === "") {
      seterrorMsg("Please take a selfie first")
      setOpen(true)
      return
    }
    if (transaction_id === "") {
      seterrorMsg("please verify your national id first")
      setOpen(true)
      return
    }
    e.preventDefault(e)
    convert()
    let fileImg = imgFile.replace(/^data:image\/(png|jpeg);base64,/, "")
    try {
      setloading2(true)
      let { data } = await facematchApi({
        transaction_id,
        first_img: fileImg,
        bundle_key: "ad17eb22b22c4916855a301679da1573",
      })
      console.log(data)
      setloading2(false)
    } catch (err) {
      setloading2(false)
      if (err.response.data.error_code === 5001) {
        seterrorMsg(
          "insuficcent bundle, Please recharge your bundle and try again.",
        )
      }
      console.log("error", err.response.data)
    }
  }

  return (
    <article className={classes.root}>
      <div className={classes.divContainer}>
        <ul>
          <li className={classes.list}>
            make sure the image be captured in a well-lit environment
          </li>
          <li className={classes.list}>
            the entire document should be clear, and no fields should be hidden
            by other objects (Ex: fingers)
          </li>
          <li className={classes.list}>
            make sure there are no glares or shadows on the document.
          </li>
          <li className={classes.list}>
            make sure the face on the document is clear and not obstructed.
          </li>
          <li className={classes.list}>
            Check that no parts of the document are damaged (Broken, torn,
            erased, etc.)
          </li>
          <li className={classes.list}>
            Ensure the document is as clean as possible (No marks, ink spots,
            etc.)
          </li>
          <li className={classes.list}>
            Make sure the document is not tilted or skewed in the image.
          </li>
        </ul>
      </div>

      <form className={classes.firstSection}>
        <section>
          <Typography
            variant="h4"
            align="center"
            color="textPrimary"
            gutterBottom
            className={classes.header}
          >
            Facematch Form
          </Typography>
          <Typography variant="subtitle1" align="left" color="textSecondary">
            Step 1: upload the front picture of your national id card:
          </Typography>
          <div className={classes.firstSection_div}>
            <img src={imgSrc} width="250" height="150" alt="" />
            <input
              onChange={handleFile}
              type="file"
              name="filename1"
              accept="image/*"
              className={classes.input}
              id="icon-button-file"
            />
            <label htmlFor="icon-button-file">
              <Button
                variant="contained"
                color="primary"
                component="span"
                align="center"
              >
                Upload
              </Button>
            </label>
            {/* <Typography variant="subtitle2">
              ` -make sure the image be captured in a well-lit environment -the
              entire document should be clear, and no fields should be hidden by
              other objects (Ex: fingers) -Make sure there are no glares or
              shadows on the document. -Make sure the face on the document is
              clear and not obstructed. -Check that no parts of the document are
              damaged (Broken, torn, erased, etc.) -Ensure the document is as
              clean as possible (No marks, ink spots, etc.) -Make sure the
              document is not tilted or skewed in the image. -If the document
              has two sides, make sure to send each side in its designated
              field.`
            </Typography> */}
          </div>
          <Typography variant="subtitle1" align="left" color="textSecondary">
            Step 2: upload the back picture of your national id card:
          </Typography>
          <div className={classes.firstSection_div}>
            <img src={imgSrc1} width="250" height="150" alt=""></img>
            <input
              onChange={handleFile1}
              type="file"
              name="filename2"
              accept="image/*"
              className={classes.input}
              id="icon-button-file-2"
            />
            <label htmlFor="icon-button-file-2">
              <Button variant="contained" color="primary" component="span">
                Upload
              </Button>
            </label>
          </div>
          <Typography variant="subtitle1" color="textSecondary" align="left">
            Step 3: verify the document:
          </Typography>
          <div>
            <Button
              onClick={verifyNid}
              variant="contained"
              color="secondary"
              disabled={imgSrc === "" || imgSrc1 === "" ? true : false}
              // style={{ marginLeft: "85%" }}
            >
              Verify
            </Button>
            {loading1 && (
              <div style={{ margin: "auto" }}>
                {" "}
                <CircularProgress color="secondary" />
              </div>
            )}
          </div>
          <Typography variant="subtitle1" color="textSecondary" align="left">
            Step 4: Take a selfie
          </Typography>
          <div className={classes.firstSection_div}>
            <video
              //   style={{ background: "red" }}
              ref={vidRef}
              autoPlay={true}
              id="videoElement"
              className="hidden"
              width="300px"
              height="300px"
            ></video>
            <img
              id="img"
              ref={imgRef}
              className="hidden"
              width="300px"
              height="220px"
              alt=""
              style={{
                marginLeft: "20px",
                borderRadius: "5px",
                // border: "2px solid white",
              }}
            />
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="button"
              onClick={capture}
            >
              <PhotoCamera />
            </IconButton>
          </div>
          <Button
            variant="contained"
            color="secondary"
            onClick={upload}
            style={{ marginLeft: "80%" }}
          >
            Submit
          </Button>
          {loading2 && (
            <div style={{ margin: "auto" }}>
              {" "}
              <CircularProgress color="secondary" />
            </div>
          )}
        </section>
      </form>

      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {errorMsg}
        </Alert>
      </Snackbar>
      <Snackbar
        open={openSuccess}
        autoHideDuration={2000}
        onClose={handleCloseSuccess}
      >
        <Alert onClose={handleCloseSuccess} severity="sucess">
          {successMsg}
        </Alert>
      </Snackbar>
    </article>
  )
}
