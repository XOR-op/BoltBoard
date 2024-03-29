import * as Sentry from "@sentry/react";
import React from "react";
import {QueryClient, QueryClientProvider} from "react-query";
import AppRoutes from "./AppRoutes";
import Loader from "./core/components/Loader";
import QueryWrapper from "./core/components/QueryWrapper";
import SettingsProvider from "./core/contexts/SettingsProvider";


// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 0,
            suspense: true,
        },
    },
});

function App() {

    return (
        <React.Suspense fallback={<Loader/>}>
            <Sentry.ErrorBoundary fallback={"An error has occurred"}>
                <QueryClientProvider client={queryClient}>
                    <SettingsProvider>
                        <QueryWrapper>
                            <AppRoutes/>
                        </QueryWrapper>
                    </SettingsProvider>
                </QueryClientProvider>
            </Sentry.ErrorBoundary>
        </React.Suspense>
    );
}

export default App;
