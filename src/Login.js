import React, { useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import {
  TextField,
  Button,
  Typography,
  Snackbar,
  CircularProgress,
} from "@material-ui/core"
import MuiAlert from "@material-ui/lab/Alert"
import { loginApi } from "./apis"
import { useHistory } from "react-router-dom"

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}
const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      marginTop: theme.spacing(4),
      width: "80%",
      padding: "10px",
      align: "center",
    },
  },
  container: {
    background: "#0F181C",
    width: "400px",
    height: "400px",
    paddingTop: "40px",
    margin: "auto",
    "box-shadow": "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
  },
  btn: {
    marginTop: "30px",
  },
  head: {
    "font-weight": 500,
    margin: "50px",
  },
}))
export default function Login() {
  let history = useHistory()

  const [uname, setuname] = useState("Username")
  const [password, setpassword] = useState("Password")
  const [loading, setloading] = useState(false)
  const [open, setOpen] = React.useState(false)
  const [errMsg, seterrMsg] = React.useState("")
  const classes = useStyles()
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return
    }

    setOpen(false)
  }

  let submit = async () => {
    try {
      setloading(true)
      let { data } = await loginApi({
        username: uname,
        password,
        grant_type: "password",
        client_id: "BlAIFsnr4dOj0aaGiRP7Eb60WdR1b69fP4Zdbg2y",
        client_secret:
          "1xjEH6X633Oo2H0IRoGKVqFellnMUQl4QAcSH4ttbVa2SHDciSEgNBvJPaRAY37yy2ILwiCtO5rCMIhejEieUSImZeELXMBDV3igsfrFsKgC4uZCdHBBEEgNt53HlXhO",
      })

      setloading(false)
      localStorage.setItem("token", data.access_token)
      localStorage.setItem("refresh", data.refresh_token)
      history.replace("/Form")
    } catch (err) {
      console.log(err.response.data)
      console.log(err.response.status)
      setloading(false)
      setOpen(true)
      seterrMsg("Username or password is incorrect")
    }
  }
  return (
    <>
      <header>
        <Typography
          variant="h4"
          color="secondary"
          align="center"
          className={classes.head}
        >
          Welcome back, please login 😊
        </Typography>
      </header>
      <article className={classes.container}>
        <Typography variant="h5" color="secondary" align="center">
          Login Form
        </Typography>
        <form className={classes.root} noValidate>
          <TextField
            error={uname === "" ? true : false}
            required
            id="standard-required"
            label="Required"
            defaultValue="Username"
            onChange={(e) => setuname(e.target.value)}
          />
          <TextField
            error={password === "" ? true : false}
            required
            id="standard-required"
            label="Required"
            defaultValue="Password"
            onChange={(e) => setpassword(e.target.value)}
          />

          <Button
            disabled={uname === "" || password === "" || loading ? true : false}
            variant="contained"
            color="primary"
            onClick={submit}
            className={classes.btn}
          >
            Login
          </Button>
          {loading && (
            <div style={{ margin: "auto" }}>
              {" "}
              <CircularProgress color="secondary" />
            </div>
          )}
        </form>
        <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error">
            {errMsg}
          </Alert>
        </Snackbar>
      </article>
    </>
  )
}
