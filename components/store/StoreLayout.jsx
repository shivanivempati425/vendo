 'use client'
import { useEffect, useState } from "react"
import Loading from "../Loading"
import SellerNavbar from "./StoreNavbar"
import SellerSidebar from "./StoreSidebar"
import { dummyStoreData } from "@/assets/assets"

const BYPASS_SELLER_CHECK = true

const StoreLayout = ({ children }) => {
    const [isSeller, setIsSeller] = useState(BYPASS_SELLER_CHECK)
    const [loading, setLoading] = useState(!BYPASS_SELLER_CHECK)
    const [storeInfo, setStoreInfo] = useState(
        BYPASS_SELLER_CHECK ? dummyStoreData : null
    )

    useEffect(() => {
        if (BYPASS_SELLER_CHECK) return

        const fetchIsSeller = async () => {
            try {
                const response = await fetch("/api/store/is-seller")
                const data = await response.json()

                setIsSeller(data.isSeller)
                setStoreInfo(data.storeInfo)
            } catch (error) {
                console.error("Failed to check seller status:", error)
                setIsSeller(false)
            } finally {
                setLoading(false)
            }
        }

        fetchIsSeller()
    }, [])

    if (loading) return <Loading />

    if (!isSeller) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
                <h1 className="text-2xl sm:text-4xl font-semibold text-slate-400">
                    You are not authorized to access this page
                </h1>
                <a href="/" className="bg-slate-700 text-white flex items-center gap-2 mt-8 p-2 px-6 max-sm:text-sm rounded-full">
                    Go to home →
                </a>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-screen">
            <SellerNavbar />
            <div className="flex flex-1 items-start h-full overflow-y-scroll no-scrollbar">
                <SellerSidebar storeInfo={storeInfo} />
                <div className="flex-1 h-full p-5 lg:pl-12 lg:pt-12 overflow-y-scroll">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default StoreLayout