import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import {useFormik} from "formik";
import * as Yup from "yup";
import BoxedLayout from "../../core/components/BoxedLayout";
import {useAuth} from "../../auth/contexts/AuthProvider";
import {useLocalStorage} from "../../core/hooks/useLocalStorage";
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
            navigate(`/admin`, {replace: true})
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
                            InputProps={{ disableUnderline: true }}
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
                            InputProps={{ disableUnderline: true }}
                        />

                        <LoadingButton
                            type="submit"
                            fullWidth
                            loading={isLoggingIn}
                            variant="contained"
                            disableElevation={true}
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
