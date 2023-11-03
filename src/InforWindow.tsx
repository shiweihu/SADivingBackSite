import React, { useEffect, useState } from 'react';
import { LocationConfiguration } from './LocationConfiguration';
import { FeedBackData } from './FeedBackData';
import { LocationConfigurationpack } from './LocationConfigurationpack';
import Box from '@mui/material/Box';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import firebaseAPP from './firebaseConfig';
import { getFirestore } from 'firebase/firestore';
import { doc, updateDoc, deleteDoc, collection, addDoc } from "firebase/firestore";
import Snackbar from '@mui/material/Snackbar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';




export default function InforWindow({ FeedBackDataSet, locationConfig, noticeUpdate }: { FeedBackDataSet: FeedBackData[], locationConfig: LocationConfigurationpack, noticeUpdate: (key: string, locConfig: LocationConfiguration | undefined) => void }) {





    return (
        <Box display="flex" flexDirection="column">
            <Box display="flex" flexDirection="row" marginTop={3}>
                {FeedBackDataSet.length !== 0 && <MyPieChart FeedBackDataSet={FeedBackDataSet} />}
                {FeedBackDataSet.length !== 0 && <MyTable FeedBackDataSet={FeedBackDataSet} />}
            </Box>
            <Box>
                <EditConfigrationView locationConfig={locationConfig} noticeUpdate={noticeUpdate} />
            </Box>
        </Box>
    )
}


function EditConfigrationView({ locationConfig, noticeUpdate }: { locationConfig: LocationConfigurationpack, noticeUpdate: (key: string, locConfig: LocationConfiguration | undefined) => void }) {
    const [tabIndex, setTabIndex] = React.useState(0);

    useEffect(() => {
        setTabIndex(0)
    }, [locationConfig])

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };
    function a11yProps(index: number) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const selectedConfig = locationConfig.locationConfigurations.find((value, index) => {
        return index === tabIndex
    })

    return (
        <Box display="flex" flexDirection="column">
            <Tabs value={tabIndex} onChange={handleChange} variant="scrollable" scrollButtons="auto" >
                {locationConfig.locationConfigurations.map((value, index) => (
                    <Tab label={"senario " + (index + 1)} {...a11yProps(index)} />
                ))}
                <Tab iconPosition="start" label="Add" icon={<AddCircleOutlineIcon />} ></Tab>
            </Tabs>
            <Box>
                {selectedConfig !== undefined && <ConfigrationView basicInfo={{ numSenario: locationConfig.locationConfigurations.length, name: locationConfig.name, latitude: locationConfig.latitude, longitude: locationConfig.longitude }} config={selectedConfig} noticeUpdate={noticeUpdate} />}
                {selectedConfig === undefined && <ConfigrationView basicInfo={{ numSenario: locationConfig.locationConfigurations.length, name: locationConfig.name, latitude: locationConfig.latitude, longitude: locationConfig.longitude }} config={undefined} noticeUpdate={noticeUpdate} />}
            </Box>
        </Box>
    )

}

interface BasicInfo {
    name: string,
    latitude: number,
    longitude: number,
    numSenario: number
}


function ConfigrationView({ config, basicInfo, noticeUpdate }: { config: LocationConfiguration | undefined, basicInfo: BasicInfo, noticeUpdate: (key: string, locConfig: LocationConfiguration | undefined) => void }) {


    const [goodSwellHeight, setGoodSwellHeight] = useState(config?.GoodSwellHeight || 0);
    const [normalSwellHeight, setNormalSwellHeight] = useState(config?.NormalSwellHeight || 0);
    const [goodSwellPeriod, setGoodSwellPeriod] = useState(config?.GoodSwellPeriod || 0);
    const [normalSwellPeriod, setNormalSwellPeriod] = useState(config?.NormalSwellPeriod || 0);
    const [goodTide, setGoodTide] = useState(config?.GoodTide || 0);
    const [normalTide, setNormalTide] = useState(config?.NormalTide || 0);
    const [goodWindDirection, setGoodWindDirection] = useState(config?.GoodWindDirection || '');
    const [normalWindDirection, setNormalWindDirection] = useState(config?.NormalWindDirection || '');
    const [goodWindSpeed, setGoodWindSpeed] = useState(config?.GoodWindSpeed || 0);
    const [normalWindSpeed, setNormalWindSpeed] = useState(config?.NormalWindSpeed || 0);


    const [updateConfig, setUpdateConfig] = useState(false);
    const [deleteConfig, setDeleteConfig] = useState(false);
    const [addConfig, setAddConfig] = useState(false);

    const [openSnakeBar, setOpenSnakeBar] = React.useState(false);
    const [snakeBarMessage, setSnakeBarMessage] = React.useState("");


    const handleCloseSnackBar = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnakeBar(false);
    };

    useEffect(() => {
        // 当 config 改变时，重新初始化 state 的值
        setGoodSwellHeight(config?.GoodSwellHeight || 0);
        setNormalSwellHeight(config?.NormalSwellHeight || 0);
        setGoodSwellPeriod(config?.GoodSwellPeriod || 0);
        setNormalSwellPeriod(config?.NormalSwellPeriod || 0);
        setGoodTide(config?.GoodTide || 0);
        setNormalTide(config?.NormalTide || 0);
        setGoodWindDirection(config?.GoodWindDirection || '');
        setNormalWindDirection(config?.NormalWindDirection || '');
        setGoodWindSpeed(config?.GoodWindSpeed || 0);
        setNormalWindSpeed(config?.NormalWindSpeed || 0);
    }, [config])



    useEffect(() => {
        const db = getFirestore(firebaseAPP);
        const updateData = async () => {
            const locationRef = doc(db, "locations", config!.id);
            const newConfig = {
                GoodSwellHeight: goodSwellHeight,
                GoodSwellPeriod: goodSwellPeriod,
                GoodTide: goodTide,
                GoodWindDirection: goodWindDirection,
                GoodWindSpeed: goodWindSpeed,
                NormalSwellHeight: normalSwellHeight,
                NormalSwellPeriod: normalSwellPeriod,
                NormalTide: normalTide,
                NormalWindDirection: normalWindDirection,
                NormalWindSpeed: normalWindSpeed,
                name: config!.name,
                latitude: config!.latitude,
                longitude: config!.longitude
            }
            await updateDoc(locationRef, newConfig);
            const newLocationConfiguration = newConfig as LocationConfiguration
            newLocationConfiguration.id = config!.id
            return newLocationConfiguration

        }
        if (updateConfig) {
            if (checkDirectionFormat(goodWindDirection) && checkDirectionFormat(normalWindDirection)) {
                updateData().then(locConfig => {
                    noticeUpdate(locConfig.id, locConfig)
                    setOpenSnakeBar(true)
                    setSnakeBarMessage("Update successfully")
                })
            } else {
                setOpenSnakeBar(true)
                setSnakeBarMessage("Update failure")
            }
            setUpdateConfig(false)
        }

    }, [updateConfig])

    useEffect(() => {
        const db = getFirestore(firebaseAPP);
        const addData = async () => {
            const newConfig = {
                GoodSwellHeight: goodSwellHeight,
                GoodSwellPeriod: goodSwellPeriod,
                GoodTide: goodTide,
                GoodWindDirection: goodWindDirection,
                GoodWindSpeed: goodWindSpeed,
                NormalSwellHeight: normalSwellHeight,
                NormalSwellPeriod: normalSwellPeriod,
                NormalTide: normalTide,
                NormalWindDirection: normalWindDirection,
                NormalWindSpeed: normalWindSpeed,
                name: basicInfo.name,
                latitude: basicInfo.latitude,
                longitude: basicInfo.longitude
            }
            const docRef = await addDoc(collection(db, "locations"), newConfig);
            const newLocationConfiguration = newConfig as LocationConfiguration
            newLocationConfiguration.id = docRef.id
            return newLocationConfiguration
        }
        if (addConfig) {
            addData().then(locConfig => {
                noticeUpdate(locConfig.id, locConfig)
            })
            setAddConfig(false)
        }

    }, [addConfig])
    useEffect(() => {
        const db = getFirestore(firebaseAPP);
        const deleteData = async () => {
            await deleteDoc(doc(db, "locations", config!.id));
            return config!.id
        }
        if (deleteConfig) {
            deleteData().then(configID => {
                noticeUpdate(configID, undefined)
            })
            setDeleteConfig(false)
        }

    }, [deleteConfig])








    return (
        <Box display="flex" flexDirection="column" sx={{ maxWidth: 600 }}>
            <TableContainer component={Paper} >
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Parameter</TableCell>
                            <TableCell align="left">DESIRABLE</TableCell>
                            <TableCell align="left">AVERAGE</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                Swell Height
                            </TableCell>
                            <TableCell align="left">
                                <TextField value={goodSwellHeight} onChange={(event) => {
                                    setGoodSwellHeight(Number(event.target.value))
                                }} label="Good Swell Hight" variant="outlined" type='number' />
                            </TableCell>
                            <TableCell align="left">
                                <TextField value={normalSwellHeight} onChange={(event) => {
                                    setNormalSwellHeight(Number(event.target.value))
                                }} label="Normal Swell Hight" variant="outlined" type='number' />
                            </TableCell>
                        </TableRow>

                        <TableRow
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                Swell Period
                            </TableCell>
                            <TableCell align="left">
                                <TextField value={goodSwellPeriod} onChange={(event) => {
                                    setGoodSwellPeriod(Number(event.target.value))
                                }} label="Good Swell Period" variant="outlined" type='number' />
                            </TableCell>
                            <TableCell align="left">
                                <TextField value={normalSwellPeriod} onChange={(event) => {
                                    setNormalSwellPeriod(Number(event.target.value))
                                }} label="Normal Swell Period" variant="outlined" type='number' />
                            </TableCell>
                        </TableRow>

                        <TableRow
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                Tide
                            </TableCell>
                            <TableCell align="left">
                                <TextField value={goodTide} onChange={(event) => {
                                    setGoodTide(Number(event.target.value))
                                }} label="Good Tide" variant="outlined" type='number' />
                            </TableCell>
                            <TableCell align="left">
                                <TextField value={normalTide} onChange={(event) => {
                                    setNormalTide(Number(event.target.value))
                                }} label="Normal Tide" variant="outlined" type='number' />
                            </TableCell>
                        </TableRow>

                        <TableRow
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                Wind Speed
                            </TableCell>
                            <TableCell align="left">
                                <TextField value={goodWindSpeed} onChange={(event) => {
                                    setGoodWindSpeed(Number(event.target.value))
                                }} label="Good Wind Speed" variant="outlined" type='number' />
                            </TableCell>
                            <TableCell align="left">
                                <TextField value={normalWindSpeed} onChange={(event) => {
                                    setNormalWindSpeed(Number(event.target.value))
                                }} label="Normal Wind Speed" variant="outlined" type='number' />
                            </TableCell>
                        </TableRow>

                        <TableRow
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                Wind Direction
                            </TableCell>
                            <TableCell align="left">
                                <TextField error={!checkDirectionFormat(goodWindDirection)} value={goodWindDirection} onChange={(event) => {
                                    const inputValue = event.target.value;
                                    setGoodWindDirection(inputValue);
                                }} label="Good Wind Speed" variant="outlined" helperText="Values must be directional values" />
                            </TableCell>
                            <TableCell align="left">
                                <TextField error={!checkDirectionFormat(normalWindDirection)} value={normalWindDirection} onChange={(event) => {
                                    const inputValue = event.target.value;
                                    setNormalWindDirection(inputValue);
                                }} label="Normal Wind Speed" variant="outlined" helperText="Values must be directional values" />
                            </TableCell>
                        </TableRow>

                    </TableBody>
                </Table>
            </TableContainer>
            {config !== undefined && <Box marginTop={1} display="flex" flexDirection="row" justifyContent="end" paddingRight={2}>
                <Button variant="contained" sx={{ marginRight: 2 }} onClick={(event) => {
                    setUpdateConfig(true)
                }}>Update</Button>

                {basicInfo.numSenario >= 2 && <Button variant="contained" onClick={(event) => {
                    setDeleteConfig(true)
                }}>Delete</Button>}
            </Box>}
            {config === undefined && <Box marginTop={1} display="flex" flexDirection="row" justifyContent="end" paddingRight={2}>
                <Button variant="contained" sx={{ marginRight: 2 }} onClick={(event) => {
                    setAddConfig(true)
                }}>Add</Button>
            </Box>}
            <Snackbar
                open={openSnakeBar}
                autoHideDuration={6000}
                onClose={handleCloseSnackBar}
                message={snakeBarMessage}
            />
        </Box>
    )
}

function ExtendsView({row,index,setOpen,setDialogText}:{row:FeedBackData,index:number,setOpen:(aa:boolean)=>void,setDialogText:(text:string)=>void}){

    const [extend, setExtend] = React.useState(false);
    const tansferEvaluateToString = (evaluate: number) => {
        if (evaluate === 1) {
            return "Normal"
        } else if (evaluate === 2) {
            return "Good"
        } else {
            return "Bad"
        }
    }
    return (
        <React.Fragment>
        <TableRow
            key={index}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
            <TableCell >
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setExtend(!extend)}
                >
                    {extend ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </TableCell>
            <TableCell component="th" scope="row">
                {tansferEvaluateToString(row.evaluate)}
            </TableCell>
            <TableCell align="left">
                {tansferEvaluateToString(row.condition)}
            </TableCell>

            <TableCell align="left">{new Date(row.submitTime).toLocaleString()}</TableCell>
            <TableCell align="left" onClick={(event) => {
                setDialogText(row.comment)
                setOpen(true)
            }} >
                <Typography variant="body1" noWrap style={{ maxWidth: 700, overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.comment}</Typography>
            </TableCell>
        </TableRow>
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={extend} timeout="auto" unmountOnExit>
                    <Box display="flex" flexDirection="row" justifyContent="space-between"  >
                        <Typography variant="body1" >Swell Height:{row.swellHeight}</Typography>
                        <Typography variant="body1" >Swell Period:{row.swellPeriod}</Typography>
                        <Typography variant="body1" >Wind Speed:{row.windSpeed}</Typography>
                        <Typography variant="body1" >Wind Direction:{row.windDirection}</Typography>
                        <Typography variant="body1" >Tide:{row.tide}</Typography>
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    </React.Fragment>
    )

}

function checkDirectionFormat(str: string) {
    const inputValue = str;
    const directionValues = inputValue.split(',').map((value) => value.trim());
    const validDirectionPattern = /^(N|S|W|WE|E|ES|SW|NW|NNE|NNW|ENE|WNW|ESE|SSE|SSW|NNE)$/;
    return directionValues.every((value) => validDirectionPattern.test(value)) || str === "";
}

function MyTable({ FeedBackDataSet }: { FeedBackDataSet: FeedBackData[] }) {
    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
    };

   

    const [dialogText, setDialogText] = React.useState("");


    return (
        <Box>
            <TableContainer sx={{ minHeight: 200, maxHeight: 500,minWidth:800}}  component={Paper}>
                <Table size="medium" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>User Feedback</TableCell>
                            <TableCell>Prediction</TableCell>
                            <TableCell align="left">Time</TableCell>
                            <TableCell align="left">Comment</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {FeedBackDataSet.map((row, index) => (
                            <ExtendsView row={row} index={index} setOpen={setOpen} setDialogText={setDialogText} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {dialogText}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

function MyPieChart({ FeedBackDataSet }: { FeedBackDataSet: FeedBackData[] }) {

    const calculateSum = (evaluate: number) => {
        return FeedBackDataSet.filter((feedback) => {
            return feedback.evaluate === evaluate
        }).length
    }
    return (<PieChart
        series={[
            {
                arcLabel: (item) => `${(item.value / FeedBackDataSet.length * 100).toFixed(0)}%`,
                arcLabelMinAngle: 45,
                data: [
                    { id: 0, value: calculateSum(0), label: 'Bad', color: 'red' },
                    { id: 1, value: calculateSum(1), label: 'Common', color: 'yellow' },
                    { id: 2, value: calculateSum(2), label: 'Good', color: 'green' },
                ],
            },
        ]}
        sx={{
            [`& .${pieArcLabelClasses.root}`]: {
                fill: 'black',
                fontWeight: 'bold',
            },
        }}
        width={400}
        height={200}
    />)
}