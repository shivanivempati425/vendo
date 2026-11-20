import StoreLayout from "@/components/store/StoreLayout";
import { Show, SignIn } from "@clerk/nextjs";

export const metadata = {
    title: "vendo. - Store Dashboard",
    description: "vendo. - Store Dashboard",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <Show when="signed-in">
                <StoreLayout>
                    {children}
                </StoreLayout>
            </Show>
            <Show when="signed-out">
                <div className="min-h-screen flex items-center justify-center">
                    <SignIn fallbackRedirectUrl="/store" routing="hash" />
                </div>
            </Show>

        </>
    );
}
