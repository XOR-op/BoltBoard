import Button from "@mui/material/Button";
import {Link as RouterLink} from "react-router-dom";
import Result from "../../core/components/Result";
import {ReactComponent as NotFoundSvg} from "../assets/404.svg";

const NotFound = () => {

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
            image={<NotFoundSvg/>}
            maxWidth="sm"
            subTitle={""}
            title={"Not Found"}
        />
    );
};

export default NotFound;
