import { createTheme } from "@material-ui/core/styles"

let darkTheme = createTheme({
  palette: {
    type: "dark",

    primary: {
      main: "#303f9f",
    },
    secondary: {
      main: "#c51162",
    },
  },
})

export default darkTheme
