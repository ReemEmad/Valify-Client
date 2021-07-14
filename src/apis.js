import axios from "axios"
import qs from "qs"
const instance = axios.create({
  baseURL: "http://localhost:5000",
})
let token = localStorage.getItem("token")
instance.defaults.headers.common["Authorization"] = `Bearer ${token}`

export let loginApi = async (obj) => {
  let result = await instance.post("/api/login", qs.stringify(obj), {
    headers: {
      "content-Type": "application/x-www-form-urlencoded",
    },
  })
  return result
}
export let verifyNID = async (obj) => {
  let result = await instance.post("/api/upload", obj)
  return result
}

export let facematchApi = async (obj) => {
  let result = await instance.post("/api/uploadConfirm", obj)
  return result
}

instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.log("error", error)

    if (error && error.response.status === 401) {
      localStorage.clear()
      window.location.replace("/")
    }
    return Promise.reject(error)
  },
)
