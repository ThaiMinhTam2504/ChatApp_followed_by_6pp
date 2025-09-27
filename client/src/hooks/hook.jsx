import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const useErrors = (errors = []) => {
    useEffect(() => {
        errors.forEach(({ isError, error, fallback }) => {

            if (isError) {
                if (fallback) fallback()
                else toast.error(error?.data?.message || error.message || "Something went wrong")
            }
        })
    }, [errors])
}


const useAsyncMutation = (mutationHook) => {

    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState(null)

    const [mutate] = mutationHook()

    const excecuteMutation = async (toastMessage, ...args) => {
        setIsLoading(true)
        const toastId = toast.loading(toastMessage || "Updating data...")
        try {
            const res = await mutate(...args)
            if (res.data) {
                toast.success(res.data.message || "Updated successfully", {
                    id: toastId
                })
                setData(res.data)
            } else {
                toast.error(res?.error?.data?.message || "Something went wrong.", {
                    id: toastId
                })
            }
        } catch (err) {
            console.log(err)
            toast.error("Something went wrong.", {
                id: toastId
            })
        } finally {
            setIsLoading(false)
        }
    }

    return [excecuteMutation, isLoading, data]
}


export { useErrors, useAsyncMutation }