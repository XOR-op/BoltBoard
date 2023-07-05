import React from "react";
import { GroupRpcData } from "../misc/structure";
import { Box, Card, CardActionArea, CardContent, List, Typography } from "@mui/material";

export interface AllGroupData {
	arr: GroupRpcData[];
}

const GroupList = (data: AllGroupData) => {
	return (
		<Box>
			<List dense={true}>

				{data.arr.map(entry => (
					<Card sx={{ display: "flex", justifyContent: "space-between" }}>
						<CardActionArea sx={{ cursor: "pointer" }}>
							<CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
								<Typography variant="h6" sx={{ textAlign: "left" }}>
									{entry.name}
								</Typography>
								<Typography variant="subtitle1" sx={{ textAlign: "right" }}>
									{entry.selected}
								</Typography>
							</CardContent>
						</CardActionArea>
					</Card>
				))}
			</List>
		</Box>
	);
};

export default GroupList;
