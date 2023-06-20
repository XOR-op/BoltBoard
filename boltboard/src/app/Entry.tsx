import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {defaultEndpoint, defaultShortenEndpoint, homePath, loginPath} from "./Const";
import {checkConnection} from "../misc/request";

const EntryPage = () => {
    const navigate = useNavigate();
    const [redirectTo, setRedirectTo] = useState<string | null>(null);

    useEffect(() => {
        const probeUrl = defaultEndpoint + '/traffic';
        const timeout = 1000; // Timeout in milliseconds

        checkConnection(probeUrl, timeout)
            .then(ok => {
                if (ok) {
                    setRedirectTo(homePath);
                } else {
                    setRedirectTo(loginPath)
                }
            })
            .catch(_ => {
                setRedirectTo(loginPath);
            });
    }, [setRedirectTo]);

    if (redirectTo) {
        window.localStorage.setItem("url", JSON.stringify(defaultShortenEndpoint))
        console.log("Redirect to " + redirectTo)
        navigate(redirectTo, {replace: true})
    }

    return <div>Loading...</div>;
}
export default EntryPage;
