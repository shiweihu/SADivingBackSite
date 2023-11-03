import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { Box, Container, Divider, Tab, Tabs } from '@mui/material';
import firebaseAPP from './firebaseConfig';
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { LocationConfiguration } from './LocationConfiguration';
import { User } from "firebase/auth";
import LoginComponent from './LoginComponent';
import { FeedBackData } from './FeedBackData';
import InforWindow from './InforWindow';
import { LocationConfigurationpack } from './LocationConfigurationpack';

function App() {
  const [tabIndex, setTabIndex] = React.useState<string>("");
  const [tabList, setTabList] = React.useState<LocationConfigurationpack[]>([]);
  const [feedbackList, setFeedbackList] = React.useState<FeedBackData[]>([]);
  const [currentUser, setCurrentUser] = React.useState<User>()


  useEffect(()=>{

    if(tabList.length !== 0 && tabIndex === ""){
      setTabIndex(tabList[0].name)
    }
    
  },[tabList])

  useEffect(() => {
    if (currentUser !== undefined) {
      // 获取Firestore的引用
      const db = getFirestore(firebaseAPP);
      const localConfigrations = new Map<string, LocationConfigurationpack>()
      const fetchData = async () => {
        const querySnapshot = await getDocs(collection(db, "locations"));
        querySnapshot.forEach((doc) => {
          const locationData = doc.data() as LocationConfiguration;
          locationData.id = doc.id
          if (localConfigrations.has(locationData.name)) {
            const item = localConfigrations.get(locationData.name)
            item?.locationConfigurations.push(locationData)
          } else {
            // 初始化一个 LocationConfigurationpack 实例
            const newLocationConfigurationpack:LocationConfigurationpack ={
              locationConfigurations: [],
              latitude:locationData.latitude,
              longitude:locationData.longitude,
              name:locationData.name
            };
            newLocationConfigurationpack.locationConfigurations.push(locationData)
            localConfigrations.set(locationData.name,newLocationConfigurationpack)
          }
        });
        setTabList(Array.from(localConfigrations.values()))
      }
      const fetchCommentData = async () => {
        const queryFeedback = await getDocs(collection(db, "feedback"));
        const locFeedBackList:FeedBackData[] = []
        queryFeedback.forEach((doc)=>{
          const feedbackData = doc.data() as FeedBackData;
          locFeedBackList.push(feedbackData)
        })
        setFeedbackList(locFeedBackList)
      }
      fetchData();
      fetchCommentData()

    }
  }, [currentUser]);

  const feedBackset = feedbackList.filter((value,index)=>{
    return value.id === tabIndex
  })

  const selectedLocation = tabList.find((config,index)=>{
    return config.name === tabIndex
  })

  return (
    currentUser !== undefined ? (
      <Box display="flex" flexDirection="row" gap={1} height={"100vh"}>
        <Box height="100%" alignItems="center" display="flex" flexDirection="row">
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={tabIndex}
            onChange={(event: React.SyntheticEvent, newValue: string) => {
              setTabIndex(newValue)
            }}
            aria-label="Locations"
            sx={{ borderRight: 1, borderColor: 'divider' }}
          >
            {
              tabList.map((value, index) => (
                <Tab label={value.name} value={value.name} />
              ))
            }
          </Tabs>
        </Box>
        {
          selectedLocation !== undefined && <InforWindow locationConfig={selectedLocation} FeedBackDataSet={feedBackset} noticeUpdate={(key,config)=>{
            var updatedTabList = [...tabList];  
            if(config === undefined){
                //delete 
                updatedTabList = updatedTabList.map((value1)=>{
                  const deleteIndex = value1.locationConfigurations.findIndex((value2)=>{
                    return value2.id === key
                 })
                 if(deleteIndex !== -1){
                   value1.locationConfigurations.splice(deleteIndex,1)
                 }
                 return value1
                })
              }else{
                const item = updatedTabList.find((value)=>{
                  return value.name === config.name
                })
                const originalIndex = item?.locationConfigurations.findIndex((value)=>{
                  return value.id === key
                })
                if(originalIndex !== undefined  && originalIndex !== -1){
                  item?.locationConfigurations.splice(originalIndex,1,config)
                }else{
                  item?.locationConfigurations.push(config)
                }
              }
              setTabList(updatedTabList)
          }}/>
        }
      </Box>) :
      (<LoginComponent onUserChanged={(user: User) => (
        setCurrentUser(user)
      )} />)
  );
}

export default App;
