
import React from "react"
import HomePage from "./pages/main/home/page"
import Layout from "./pages/main/home/layout"
import AppLayout from "./pages/main/layout"

export default function MainPage() {

    return (
        <AppLayout>
            <Layout>
                <HomePage />
            </Layout>
        </AppLayout>
    )
};
