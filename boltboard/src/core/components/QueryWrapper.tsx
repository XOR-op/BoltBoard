import Button from "@mui/material/Button";
import React from "react";
import {ErrorBoundary} from "react-error-boundary";
import {useQueryErrorResetBoundary} from "react-query";
import Loader from "./Loader";
import Result from "./Result";

type QueryWrapperProps = {
    children: React.ReactNode;
};

const QueryWrapper = ({children}: QueryWrapperProps) => {
    const {reset} = useQueryErrorResetBoundary();

    return (
        <ErrorBoundary
            onReset={reset}
            fallbackRender={({resetErrorBoundary}) => (
                <Result
                    extra={
                        <Button onClick={() => resetErrorBoundary()} variant="contained">
                            {"Try Again"}
                        </Button>
                    }
                    status="error"
                    subTitle={"Something went wrong!"}
                    title={"Oops!"}
                />
            )}
        >
            <React.Suspense fallback={<Loader/>}>{children}</React.Suspense>
        </ErrorBoundary>
    );
};

export default QueryWrapper;
