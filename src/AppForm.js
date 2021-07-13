import React, { useEffect, useState, useRef } from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Button, Typography, IconButton, Snackbar } from "@material-ui/core/"
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
      // height: ;
    },
  },
  input: {
    display: "none",
  },
  subtitle1: {
    background: "red",
    border: "1px solid red",
  },
  firstSection: {
    margin: "auto",
    width: "70%",
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
    // e.preventDefault()
    reader.onload = () => {
      if (reader.readyState === 2) {
        setimgSrc(reader.result)
        console.log("done")
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

  let verifyNid = async (e) => {
    e.preventDefault()
    let fileFront = await toBase64(file1)
    let fileBack = await toBase64(file2)
    let f1 = fileFront.replace(/^data:image\/(png|jpeg);base64,/, "")
    let f2 = fileBack.replace(/^data:image\/(png|jpeg);base64,/, "")
    console.log(f1)
    console.log({ f2 })

    // console.log(imgFile)

    let { data } = await verifyNID({
      document_type: "egy_nid",
      data: {
        front_img: f1,
        back_img: f2,
        bundle_key: "ad17eb22b22c4916855a301679da1573",
      },
    })
    console.log(data)
    settransaction_id(data.transaction_id)
  }

  let upload = async (e) => {
    if (imgFile === "" || selfieImg === "") {
      return setOpen(true)
    }
    e.preventDefault(e)
    convert()
    let fileImg = imgFile.replace(/^data:image\/(png|jpeg);base64,/, "")
    let { data } = await facematchApi({
      transaction_id,
      first_img: fileImg,
      bundle_key: "ad17eb22b22c4916855a301679da1573",
    })
    console.log(data)
  }

  return (
    <article className={classes.root}>
      <form>
        <section className={classes.firstSection}>
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
        </section>
      </form>

      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          Please take a selfie first
        </Alert>
      </Snackbar>
    </article>
  )
}
