import { create } from 'zustand'
import { axiosInstance } from '../utils/axios'
import toast from 'react-hot-toast'


const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isLoggingIn: false,
    isSigningUp: false,
    isUpdatingProfile: false,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check-auth')
            set({ authUser: res.data })
        } catch (error) {
            console.error(error)
            set({authUser: null})
        }
        finally{
            set({isCheckingAuth: false})
        }

    },
    signup: async (data) => {
        set({ isSigningUp: true })
        try {
            const response = await axiosInstance.post("/auth/register", data);
            toast.success("user created successfully");
            return response.data
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Error Creating User")
            throw error;
        }
        finally {
            set({ isSigningUp: false })
        }
    },
    login: async (data) => {
        set({ isLoggingIn: true })
        try {
            const response = await axiosInstance.post("/auth/login", data)
            toast.success("Logged in Successfully");
            set({authUser: response.data})
            return response.data
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Error Logging In")
            throw error;
        }
        finally {
            set({ isLoggingIn: false })
        }
    },
    logout : async () => {
        try {
            const response = await axiosInstance.post("/auth/logout")
            set({authUser: null})
            toast.success("Logged out Successfully");
            return response.data
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Error Logging Out")
        }
    },
    updateAssistant: async (data) =>{
        set({isUpdatingProfile: true})
        try {
            const response = await axiosInstance.post("/auth/update-assistant", data)
            set({authUser: response.data})
            toast.success("Profile Updated Successfully");
            return response.data
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Error Updating Profile")
            throw error;
        }
        finally{
            set({isUpdatingProfile: false})
        }
    },

    askAssistant: async (data) => {
        try {
            const response = await axiosInstance.post("/auth/askassistant", data)
            return response.data
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Error Asking Assistant")
            throw error;
        }
    }
}))

export default useAuthStore