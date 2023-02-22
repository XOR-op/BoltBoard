import React from 'react'
import {Grid} from "@material-ui/core";
import ProxyWidget from "./ProxyWidget";
import Typography from "@material-ui/core/Typography";


export interface ProxyGroupProps {
    list: string[],
    name: string,
    selected: string
}

const ProxyGroup = ({list, name, selected}: ProxyGroupProps) => {
    return (
        <React.Fragment>
            <Typography gutterBottom component="div" variant="h3">
                {name}
            </Typography>
            <Grid container spacing={2}>
                {list.map(n =>
                    (<Grid item xs={6} md={3}>
                            <ProxyWidget name={n} type={'ok'} selected={n===selected}/>
                        </Grid>
                    ))}
            </Grid>
        </React.Fragment>
    )
        ;
}

export default ProxyGroup
