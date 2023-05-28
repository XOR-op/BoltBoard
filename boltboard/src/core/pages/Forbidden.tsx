import Button from "@mui/material/Button";
import {Link as RouterLink} from "react-router-dom";
import {ReactComponent as ForbiddenSvg} from "../assets/403.svg";
import Result from "../components/Result";

const Forbidden = () => {
    return (
        <Result
            extra={
                <Button
                    color="secondary"
                    component={RouterLink}
                    to={`/`}
                    variant="contained"
                >
                    {"Back"}
                </Button>
            }
            image={<ForbiddenSvg/>}
            maxWidth="sm"
            subTitle={""}
            title={"Forbidden"}
        />
    );
};

export default Forbidden;
