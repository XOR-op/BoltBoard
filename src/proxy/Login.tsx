import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import LoadingButton from "@material-ui/lab/LoadingButton";
import {useFormik} from "formik";
import * as Yup from "yup";
import BoxedLayout from "../core/components/BoxedLayout";
import {useAuth} from "../auth/contexts/AuthProvider";
import {useLocalStorage} from "../core/hooks/useLocalStorage";
import {useNavigate} from "react-router-dom";

const Login = () => {
    const {isLoggingIn, login} = useAuth();
    const navigate = useNavigate();
    const [_authKey, setAuthKey] = useLocalStorage<string>("authkey", "");
    const [_endPoint, setEndpoint] = useLocalStorage<string>("endpoint", "");


    const handleLogin = (email: string, password: string) => {
        setEndpoint(email);
        setAuthKey(password);
        login(email, password).then(() => {
            navigate(`/${process.env.PUBLIC_URL}/admin`, {replace: true})
        });
    };

    const formik = useFormik({
        initialValues: {
            email: "http://127.0.0.1:18086",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string(),
            password: Yup.string()
        }),
        onSubmit: (values) => handleLogin(values.email, values.password),
    });

    return (
        <Grid container component="main" sx={{height: "100vh"}}>
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    backgroundRepeat: "no-repeat",
                    bgcolor: "background.default",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />
            <Grid item xs={12} sm={8} md={5} component={Paper} square>
                <BoxedLayout>
                    <Typography component="h1" variant="h5">
                        {'Sign in'}
                    </Typography>
                    <Box
                        component="form"
                        marginTop={3}
                        noValidate
                        onSubmit={formik.handleSubmit}
                    >
                        <TextField
                            margin="normal"
                            variant="filled"
                            required
                            fullWidth
                            id="email"
                            label={'API Endpoint'}
                            name="email"
                            autoComplete="email"
                            autoFocus
                            disabled={isLoggingIn}
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                        <TextField
                            margin="normal"
                            variant="filled"
                            required
                            fullWidth
                            name="password"
                            label={'API Key'}
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            disabled={isLoggingIn}
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                        />

                        <LoadingButton
                            type="submit"
                            fullWidth
                            loading={isLoggingIn}
                            variant="contained"
                            sx={{mt: 3}}
                        >
                            {'Sign in'}
                        </LoadingButton>
                    </Box>
                </BoxedLayout>
            </Grid>
        </Grid>
    );
};

export default Login;
