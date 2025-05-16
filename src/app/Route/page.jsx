"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import logingGif from "../../assets/images/rabit.gif";

export default function Route() {
    const router = useRouter();
    const [showLoader, setShowLoader] = useState(false);

    useEffect(() => {
        const checkAndRedirect = () => {
            try {
                const supervisorName = localStorage.getItem("SupervisiorName");
                const user_paid = localStorage.getItem("user_paid");

                if (user_paid === "No") {
                    router.push("/Price");
                    return;
                }

                if (supervisorName === "N/A") {
                    // Show loading GIF for 3 seconds before navigating to dashboard
                    setShowLoader(true);
                    setTimeout(() => {
                        router.push("/dashboard");
                    }, 3000);
                } else {
                    router.push("/SelectDataEntryOrDataView");
                }
            } catch (error) {
                console.error("Error during redirection:", error);
                router.push("/dashboard");
            }
        };

        checkAndRedirect();
    }, [router]);

    if (showLoader) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <img src={logingGif.src} alt="Loading..." className="w-44 h-40 mb-6" />
                <h2 className="text-xl font-semibold text-gray-700">Please wait for a moment</h2>
                <p className="text-gray-500 mt-2">We're preparing your dashboard...</p>
            </div>
        );
    }

    return null;
}
