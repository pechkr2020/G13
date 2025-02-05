import React,{useState,useEffect, ChangeEvent} from "react";
import {Link as RouterLink} from "react-router-dom"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { Box, FormControl, Paper } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Title } from "@material-ui/icons";
import {MuiPickersUtilsProvider,KeyboardDatePicker,KeyboardDateTimePicker} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { Snackbar } from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { Select } from "@material-ui/core";
import { MenuItem } from "@material-ui/core";

import { PaytypeInterface } from "../models/IPaytype";
import { PatientInterface } from "../models/IPatient";
import { ExaminationInterface } from "../models/IExamination";
import { CashierInterface } from "../models/ICashier";
import { PatientRightInterface } from "../models/IPatientRight";
import { BillInterface } from "../models/IBill";
import { BillitemInterface } from "../models/IBillItem";


const Alert = (props: AlertProps) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  };

const useStyles = makeStyles((theme: Theme) =>

    createStyles({

        root: { flexGrow: 1 },

        container: { marginTop: theme.spacing(2) },

        paper: { padding: theme.spacing(2), color: theme.palette.text.secondary },

        table: { minWidth: 20 },
        tableSpace: {
            marginTop: 20,
          },


    })

);

function BillCreate(){
    const classes = useStyles();
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [getp, Setgetp] = useState<Partial<PatientInterface>>({});
    const [total, setTotals] = useState<ExaminationInterface[]>([]);
    const [patients, setPatients] = useState<PatientInterface[]>([]);
    const [examinations, setExaminations] = useState<ExaminationInterface[]>([]);
    const [patientrights, setPatientRights] = useState<PatientRightInterface[]>([]);
    const [cashiers, setCashiers] = useState<CashierInterface>();
    const [paytypes,setPaytypes] = useState<PaytypeInterface[]>([]);
    const [billitems,setBillitems] = useState<Partial<BillitemInterface>[]>([]);
    const [bill, setBill] = useState<Partial<BillInterface>>(
        {}
    );

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [warning, setWarning] = useState(false);

    const apilUrl = "http://localhost:8080";
    const requesstOptions = {
        method : "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"},
    };
    
    const handleClose = (event?:React.SyntheticEvent, reason?:string) => {
        if (reason == "clickaway") {
            return ;
        }
        setSuccess(false);
        setError(false);
        setWarning(false);

    };

    const handleChange = (
        event: React.ChangeEvent<{ name?: string; value: unknown}>
    ) => {
        const name = event.target.name as keyof typeof bill;
        setBill({...bill,[name]: event.target.value,});
    };

    const handlePatientChange = (event: React.ChangeEvent<{name?: string; value: unknown}>) => {
        const name = event.target.name as keyof typeof getp;
        Setgetp({...getp, [name]: event.target.value, });
        setBillitems([])
    };

    const handleChangItem = (event: ChangeEvent<{name?: string, value: unknown}>) =>{
        let currentItem = [...billitems];
        if (Number(event.target.value)===0)
            return
        currentItem.push({
            ExaminationID : event.target.value as number
        })
        setBillitems(currentItem);
    }

    const handleDateChange = (date : Date | null) =>{
        console.log(date);
        setSelectedDate(date);
    };


    const getPatient = async () =>{
        fetch(`${apilUrl}/patients`, requesstOptions)
            .then((response) => response.json())
            .then((res) => {
                if (res.data){
                    setPatients(res.data);
                }
                else{
                    console.log("else");
                }
            });
    };

    const getPaytype = async () =>{
        fetch(`${apilUrl}/paytypes`, requesstOptions)
            .then((response) => response.json())
            .then((res) => {
                if (res.data){
                    setPaytypes(res.data);
                }
                else{
                    console.log("else");
                }
            });
    };

    console.log("3 Do")
    for (let i in billitems){
        console.log(billitems[i])
    }
    



    const getExamination = async () =>{
        fetch(`${apilUrl}/examinations`, requesstOptions)
            .then((response) => response.json())
            .then((res) => {
                if (res.data){
                    setExaminations(res.data);
                }
                else{
                    console.log("else");
                }
            });
    };
    
   
    const getExaminationByID = async() => {
        const apiUrl = "http://localhost:8080/examination/" + getp.ID;
        const requestOptions = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"},
        }

        fetch(apiUrl, requestOptions)
        .then((response) => response.json())
        .then((res) => {
            console.log(res.data);
                if(res.data) {
                    setExaminations(res.data)
                } else {
                    console.log("else")
                }
            });
    } 

    const getPatientRight = async () =>{
        fetch(`${apilUrl}/patientrights`, requesstOptions)
            .then((response) => response.json())
            .then((res) => {
                if (res.data){
                    setPatientRights(res.data);
                }
                else{
                    console.log("else");
                }
            });
    };

    const getCashier = async () =>{
        let uid = localStorage.getItem("uid");
        console.log(uid);
        fetch(`${apilUrl}/cashier/${uid}`, requesstOptions)
            .then((response) => response.json())
            .then((res) => {
                bill.CashierID = res.data.ID
                if (res.data){
                    setCashiers(res.data);
                }
                else{
                    console.log("else");
                }
            });
    };

    useEffect(() => {
        getPatient();
        getPaytype();
        getPatientRight();
        getCashier();
    } , []);
    


    const convertType = (data: string | number | undefined) => {
        let val = typeof data === "string" ? parseInt(data) : data;
        return val;
    };

    function submit(){
        let data = {
            PatientRightID: convertType(bill.PatientRightID),
            PaytypeID :convertType(bill.PaytypeID),
            CashierID : convertType(bill.CashierID),
            BillTime: selectedDate,
            BillItems : billitems,
        };

        const requesstOptionsPost = {
            method : "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"},
            body: JSON.stringify(data),
        };

        fetch(`${apilUrl}/bills`, requesstOptionsPost)
            .then((response) => response.json())
            .then((res) => {
                if (res.billDuplicate){
                    setWarning(true);
                }
                if(res.data) {
                    setSuccess(true);
                    console.log(res.data);
                }
                else{
                    setError(true);
                }
            });
    }

    
    return (


        <Container className={classes.container} maxWidth="md">
            <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    บันทึกข้อมูลสำเร็จ
                </Alert>
            </Snackbar>
            <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">
                    บันทึกข้อมูลไม่สำเร็จ
                </Alert>
            </Snackbar>
            <Snackbar open={warning} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="warning">
                    มีการบันทึกใบแจ้งค่าใช้จ่าย สำหรับผลการรักษานี้แล้ว กรุณาเลือกผลการรักษาใหม่
                </Alert>
            </Snackbar>
            <Paper className={classes.paper} >
                <Box display="flex">
                    <Box flexGrow={1}>
                        <Typography
                            component="h2"

                            variant="h6"

                            color="primary"

                            gutterBottom
                        >
                            ใบแจ้งค่าใช้จ่าย
                        </Typography>
                        
                    </Box>
                </Box>
                <Divider />
                <Grid container spacing={2} className={classes.root}>
                    <Grid item xs={3}>
                        <Grid item xs={10} >
                            <FormControl fullWidth variant="outlined" size="small">
                            <p>คนไข้</p>
                            <Select
                                value={getp.ID}
                                onChange={handlePatientChange}
                                defaultValue = {0}
                                inputProps={{
                                    name: "ID",
                                }}
                            >
                                <MenuItem value={0} key={0}>
                                    กรุณาเลือกคนไข้
                                </MenuItem>
                                {patients.map((item: PatientInterface) => (
                                    <MenuItem value={item.ID} key={item.ID}>
                                        {item.Firstname} {item.Lastname}
                                    </MenuItem>
                                ))}
                            </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={10}>
                            <FormControl fullWidth variant="outlined" size="small">    
                            <p>สิทธิ์การรักษา</p>
                            <Select
                                value={bill.PatientRightID}
                                onChange={handleChange}
                                defaultValue = {0}
                                inputProps={{
                                    name: "PatientRightID",
                                }}
                            >
                                <MenuItem value={0} key={0}>
                                    กรุณาเลือกสิทธิ์การรักษา
                                </MenuItem>
                                {patientrights.map((item: PatientRightInterface) => (
                                    <MenuItem value={item.ID} key={item.ID}>
                                        {item.Name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        </Grid>
                        <Grid item xs={10}>
                            <FormControl fullWidth variant="outlined" size="small">     
                                <p>เจ้าหน้าที่การเงิน</p>
                                <Select
                                    native
                                    disabled
                                    value={bill.CashierID}
                                    onChange={handleChange}
                                    inputProps={{
                                        name: "CashierID",
                                    }}
                                >
                                    <option value={cashiers?.ID} key={cashiers?.ID}>
                                        {cashiers?.Name}
                                    </option>
                                </Select>
                            </FormControl>    
                        </Grid>
                        <Grid item xs={10}>
                            <p>กรอกค่าใช้จ่าย</p>
                            <TextField id="standard-basic" variant="standard" />
                        
                        </Grid>

                        <Button style={{ float: "left" }}
                                variant="contained"
                                onClick={submit}
                                color="primary">
                                บันทึก
                            </Button>

                            <Button style={{ float: "left",margin:"0px 0px 0px 20px"}}
                                variant="contained"
                                color="primary">
                                ล้าง
                            </Button>
                    

                    </Grid>
                    <Grid item xs={3}>
                        <Grid item xs={10}>
                        <FormControl fullWidth variant="outlined" size="small">
                            <p>ใบผลการรักษา</p>
                            <Select 
                                onChange={handleChangItem}
                                onOpen={getExaminationByID}
                                defaultValue = {0}
                                inputProps={{
                                    name: "ExaminationID",
                                }}
                            >
                                <MenuItem value={0} key={0}>
                                    กรุณาเลือกผลการรักษา
                                </MenuItem>
                                {examinations.map((item: ExaminationInterface) => (
                                    <MenuItem value={item.ID} key={item.ID}>
                                        {item.Treatment}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        </Grid>
                        <Grid item xs={10}>
                            <FormControl fullWidth variant="outlined" size="small">
                                <p>ประเภทการชำระเงิน</p>
                                <Select 
                                    value={bill.PaytypeID}
                                    onChange={handleChange}
                                    defaultValue = {0}
                                    inputProps={{
                                        name: "PaytypeID",
                                    }}
                                >
                                    <MenuItem value={0} key={0}>
                                        เลือกประเภทการชำระ
                                    </MenuItem>
                                    {paytypes.map((item: PaytypeInterface) => (
                                        <MenuItem value={item.ID} key={item.ID}>
                                            {item.Type}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={10}>
                            <p>วันและเวลา</p>
                            <form className={classes.container} noValidate>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDateTimePicker
                                name="WatchedTime"
                                value={bill.BillTime}
                                onChange={handleDateChange}
                                minDate={new Date("2018-01-01T00:00")}
                                format="yyyy/MM/dd hh:mm a"
                                />
                            </MuiPickersUtilsProvider>
                            </form>
                        </Grid>
                        <Grid item xs={10}>
                            <p>เบอร์โทรศัพท์</p>
                            <TextField id="standard-basic" variant="standard" />
                        
                        </Grid>
                        
                    
                        </Grid>

                        <Grid item xs={6}>

                            <Grid item xs={12}>
                                <TableContainer component={Paper} className={classes.tableSpace}>
                                    <Table className={classes.table} aria-label="simple table">
                                        <TableHead>
                                        <TableRow>
                                            <TableCell align="center" width="10%">
                                            ใบผลการรักษา
                                            </TableCell>
                                            <TableCell align="center" width="10%">
                                            การรักษา
                                            </TableCell>
                                            <TableCell align="center" width="10%">
                                            ค่าใช้จ่ายทั้งหมด
                                            </TableCell>
                                        </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {billitems.map((row:Partial<BillitemInterface>, index)=>{
                                                return ( 
                                                <TableRow key={index}>
                                                    <TableCell align="center">{row.ExaminationID}</TableCell>
                                                    <TableCell align="center">{examinations.find(p=>p.ID === row.ExaminationID)?.Treatment}</TableCell>
                                                    <TableCell align="center">{examinations.find(p=>p.ID === row.ExaminationID)?.Treatment_cost}</TableCell>
                                                </TableRow>
                                                );
                                            })}
                                        
                                        </TableBody>
                                    </Table>
                                </TableContainer>  
                            </Grid>

                            <Grid item xs={12}>
                            <TableContainer component={Paper} className={classes.tableSpace}>
                                    <Table className={classes.table} aria-label="simple table">
                                        <TableHead>
                                        <TableRow>
                                            <TableCell align="center" width="10%">
                                            ใบผลการรักษา
                                            </TableCell>
                                            <TableCell align="center" width="10%">
                                            รหัสยา
                                            </TableCell>
                                            <TableCell align="center" width="10%">
                                            ค่าใช้จ่ายทั้งหมด
                                            </TableCell>
                                        </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {billitems.map((row:Partial<BillitemInterface>, index)=>{
                                                return ( 
                                                <TableRow key={index}>
                                                    <TableCell align="center">{row.ExaminationID}</TableCell>
                                                    <TableCell align="center">{examinations.find(p=>p.ID === row.ExaminationID)?.Medicine}</TableCell>
                                                    <TableCell align="center">{examinations.find(p=>p.ID === row.ExaminationID)?.Medicine_cost}</TableCell>
                                                </TableRow>
                                                );
                                            })}
                                            
                                        </TableBody>
                                    </Table>
                                </TableContainer>    

                        </Grid>

                    </Grid>
                    
                  
                    
                    

                </Grid>
            </Paper>
        </Container>
    );
}

export default BillCreate;
