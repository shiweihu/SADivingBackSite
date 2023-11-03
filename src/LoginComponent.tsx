
import React, { useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword, User } from "firebase/auth";
import firebaseAPP from './firebaseConfig';
import { Box, Button, TextField } from '@mui/material';
import { LoginOutlined } from "@mui/icons-material"

export default function LoginComponent({ onUserChanged }: { onUserChanged: (user: User) => void }) {


    const [emailAddress,setEmailAddresss] = React.useState<string>("");
    const [password,setPassword] = React.useState<string>("");

    const loginhandle = (event: React.SyntheticEvent) => {
        const auth = getAuth(firebaseAPP)
        signInWithEmailAndPassword(auth,emailAddress,password).then((result)=>{
            onUserChanged(result.user)
        }).catch((error)=>{

        })

    }

    return (

        <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="100vh">
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={1}>
                <TextField type="email" value={emailAddress} label="email address:" variant="outlined" onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setEmailAddresss(event.target.value);
                }} />
                <TextField type="password" value={password} label="password:" variant="outlined" onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setPassword(event.target.value);
                }} />
                <Button component="label" variant="contained" startIcon={<LoginOutlined />} onClick={loginhandle}>
                    Login
                </Button>
            </Box>
        </Box>
    );
}

