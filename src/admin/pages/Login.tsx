import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import {useFormik} from "formik";
import * as Yup from "yup";
import BoxedLayout from "../../core/components/BoxedLayout";
import {useLocalStorage} from "../../core/hooks/useLocalStorage";
import {useNavigate} from "react-router-dom";
import {homePath} from "../../app/Const";

const Login = () => {
    const navigate = useNavigate();
    const [_api_key, setApiKey] = useLocalStorage<string>("api-key", "");
    const [_url, setUrl] = useLocalStorage<string>("url", "");


    const handleLogin = (url: string, api_key: string) => {
        setUrl(url);
        setApiKey(api_key);
        navigate(homePath, {replace: true});
    };

    const formik = useFormik({
        initialValues: {
            url: "localhost:18086",
            'api-key': "",
        },
        validationSchema: Yup.object({
            url: Yup.string(),
            'api-key': Yup.string()
        }),
        onSubmit: (values) => handleLogin(values.url, values['api-key']),
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
                            id="url"
                            label={'API Endpoint'}
                            name="url"
                            autoComplete="url"
                            autoFocus
                            value={formik.values.url}
                            onChange={formik.handleChange}
                            error={formik.touched.url && Boolean(formik.errors.url)}
                            helperText={formik.touched.url && formik.errors.url}
                            InputProps={{disableUnderline: true}}
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
                            value={formik.values['api-key']}
                            onChange={formik.handleChange}
                            error={formik.touched['api-key'] && Boolean(formik.errors['api-key'])}
                            helperText={formik.touched['api-key'] && formik.errors['api-key']}
                            InputProps={{disableUnderline: true}}
                        />

                        <LoadingButton
                            type="submit"
                            fullWidth
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
