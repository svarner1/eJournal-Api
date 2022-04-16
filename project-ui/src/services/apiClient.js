import axios from "axios"

class ApiClient {
    constructor(remoteHostUrl) {
        this.remoteHostUrl = remoteHostUrl
        this.token = null
        this.tokenName = "final_project_token"
    }

    setToken(token) {
        this.token = token
        localStorage.setItem(this.tokenName, token)
    }

    async request({ endpoint, method = `GET`, data = {} }) {
        const url = `${this.remoteHostUrl}/${endpoint}`

        const headers = {
            "Content-Type": "applications/json",
            Authorization: this.token ? `Bearer ${this.token}` : "",
        }

        try {
            const res = await axios({ url, method, data, headers })
            return { data: res.data, error: null }
        } catch (error) {
            console.error("APIclient.makeRequest.error:")
            console.error({ errorResponse: error.response })
            const message = error?.response?.data?.error?.message
            return { data: null, error: message || String(error) }
          }
        }
      
        async fetchUserFromToken() {
            return await this.request({ endpoint: `auth/me`, method: `GET` })
        }
        
        async signupUser(credentials) {
            return await this.request({ endpoint: `auth/register`, method: `POST`, data: credentials })
        }

        async loginUser(credentials) {
            return await this.request({ endpoint: `auth/login`, method: `POST`, data: credentials })
        }

        async logoutUser() {
            this.setToken(null)
            localStorage.setItem(this.tokenName, "")
        }

}

const API = new ApiClient(process.env.REACT_APP_REMOTE_HOST_URL || "http://localhost:3001")

export default API