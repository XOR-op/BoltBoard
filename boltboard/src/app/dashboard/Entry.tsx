import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {defaultEndpoint, defaultShortenEndpoint, homePath, loginPath} from "../Const";

const EntryPage = () => {
    const navigate = useNavigate();
    const [redirectTo, setRedirectTo] = useState<string | null>(null);

    useEffect(() => {
        const probeUrl = defaultEndpoint + '/traffic';
        const timeout = 1000; // Timeout in milliseconds

        Promise.race([
            fetch(probeUrl),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Connection timed out')), timeout)
            )
        ])
            .then((response: any) => {
                if (response.status === 200) {
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
