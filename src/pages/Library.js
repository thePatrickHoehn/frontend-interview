import React, { useEffect, useState } from 'react'
import { parse } from 'json2csv'

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {Checkbox, FormControlLabel, TextField, Button} from "@mui/material";

export default function Library() {

    const [filterInput, setFilterInput] = useState("")
    const [filteredRostersArray, setFilteredRostersArray] = useState([])
    const [showOnlyLiveRosters, setShowOnlyLiveRosters] = useState(false)
    const [prefixes, setPrefixes] = useState([])


    useEffect(() => {
        getPrefixDetails()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        filteredRosters()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterInput, showOnlyLiveRosters])

    const getPrefixDetails = async() => {
        fetch('http://localhost:8080/prefixDetails')
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                setPrefixes(data)
                const alphaExamplePrefixes = data.sort((a, b)=>{
                    if(a.prefix < b.prefix) { return -1; }
                    if(a.prefix > b.prefix) { return 1; }
                    return 0;
                })
                if (!filterInput) setFilteredRostersArray(alphaExamplePrefixes)
                else filteredRosters()
            })
    }

    const handleStatusUpdateClick = async(prefixToUpdate) => {
        // when using json server you can update an object by using its id
        const approvalStatus = prefixToUpdate.approved === "true" ? "false" : "true"
        await fetch(`http://localhost:8080/prefixDetails/${prefixToUpdate.id}`, {
            method: 'PATCH',
            headers: {
              Accept: 'application.json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({approved: `${approvalStatus}`})
          })
        await getPrefixDetails()
    }

    const handleDeleteMappingClick = async(prefixToUpdate) => {
         // when using json server you can update an object by using its id
        await fetch(`http://localhost:8080/prefixDetails/${prefixToUpdate.id}`, {
            method: 'DELETE',
            headers: {
              Accept: 'application.json',
              'Content-Type': 'application/json'
            }
          })
        await getPrefixDetails()
    }

    const determineStatus = (approved) => {
        return approved === "true" ? "Disable" : "Enable"
    }

    const OptionsButton = (props) => {
        const prefix = props.prefix
        const [open, setOpen] = React.useState(false);
        const [anchorEl, setAnchorEl] = React.useState(null);
    
        const handleOptionsClick = (event) => {
            setAnchorEl(event.currentTarget);
            setOpen(!open);
        }

        const handleClose = () => {
            setAnchorEl(null);
            setOpen(false)
          };
    
        return (
            <>
                <Button id={prefix.name+'-options'} variant="contained" sx={Styles.button} onClick={(event)=>handleOptionsClick(event)}>Options</Button >
                <Menu
                    anchorEl={anchorEl}
                    anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                    }}
                    transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                    }}
                    open={open}
                    onClose={handleClose}
                >
                    <MenuItem data-qa='delete-mapping' onClick={()=>handleDeleteMappingClick(prefix)}>Delete Mapping</MenuItem>
                    <MenuItem data-qa='enable-mapping' onClick={()=>handleStatusUpdateClick(prefix)}>{determineStatus(prefix.approved)}</MenuItem>
                    
                </Menu>
                </>
        )
    }

    const createRosterItem = () => {
        return filteredRostersArray.map((prefix) => {
            return (
                <div id={prefix.name + '-' + prefix.type} key={prefix.name + '$$' + prefix.type} style={Styles.rosterItem}>
                    <div style={Styles.rosterItemSection}>
                        <p style={Styles.label}>Name: </p>
                        <p data-qa='prefix' style={Styles.rosterName}>{prefix.name}</p>
                    </div>
                    <div style={Styles.statusSection}>
                        <p style={Styles.label}>Live: </p>
                        <p data-qa='live' style={Styles.rosterName}>{prefix.approved === "true" ? 'yes' : 'no'}</p>
                    </div>
                    <OptionsButton data-qa='options' prefix={prefix} />
                </div>
            )
        })
    }

    const filteredRosters = () => {
        let newArray = []
        prefixes.forEach((prefixDetail) => {
            if(!showOnlyLiveRosters){
                if (prefixDetail.prefix.toUpperCase().includes(filterInput.toUpperCase().replace(' ', '_'))) {
                    newArray.push(prefixDetail)
                }
            }
            else {
                if (prefixDetail.prefix.toUpperCase().includes(filterInput.toUpperCase().replace(' ', '_')) && prefixDetail.approved) {
                    newArray.push(prefixDetail)
                }
            }
            setFilteredRostersArray(newArray)
        });
    }
    
    function exportCsv() {
        const date = new Date()
        const filename = `${date.getMonth()+1}-${date.getDate()}-${date.getFullYear()}_OrderlyRosterStatus.csv`
        const data = parse(filteredRostersArray)

        const e = document.createElement('a')
        e.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data))
        e.setAttribute('download', filename)
        e.click(); e.remove()
    }
    
    return (
        <div style={Styles.outerDiv}>
            <div style={Styles.container}>
                <div style={Styles.rosterTitleDiv}>
                    <div style={Styles.rosterTitleDivLeft}>
                        <TextField id='name-filter' size='small' label='Filter By File Name' value={filterInput} sx={{minWidth: '300px'}} onChange={(e) => {setFilterInput(e.target.value)}}/>
                        <FormControlLabel control={<Checkbox id='live-rosters' onChange={()=>setShowOnlyLiveRosters(!showOnlyLiveRosters)}/>} label='Show Live Rosters Only' sx={{marginLeft: '2rem'}} />
                    </div>
                    <Button id='export-csv' variant="contained" sx={Styles.csvButton} onClick={() => exportCsv()}>Export CSV</Button >
                </div>
                <div id="library-roster-prefix-list" style={Styles.rosterList}>
                    {createRosterItem()}
                </div>
            </div>
        </div>
    )
}

export const Styles = {
    outerDiv:{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
    container:{
      width: '100%',
      height: 'calc(100vh - 164px)',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
    },
    rosterTitleDiv:{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    rosterTitleDivLeft:{
      display: 'flex',
      marginTop: '60px',
      marginRight: '40px',
      flexDirection: 'row',
      alignItems: 'center',
    },
    csvButton:{
      marginTop: 'px',
      marginRight: '80px',
      marginBottom: '5px',
      height: '50px',
      backgroundColor: '#0d2244'
    },
    rosterList:{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      paddingLeft: '60px',
      paddingRight: '60px',
      overflowY: 'scroll'
  
    },
    rosterItem:{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor: 'black',
      borderRadius: '6px',
      padding: '15px',
      margin: '10px',
      position: 'relative',
      backgroundColor: 'white'
    },
    rosterItemSection:{
      display: 'flex',
      alignItems: 'center',
    },
    statusSection:{
      display: 'flex',
      alignItems: 'center',
      position: 'absolute',
      left: '50%'
    },
    label:{
      color: "#0C2244",
      fontSize: '18px',
      margin: '0px',
      marginRight: '5px'
    },
    rosterName:{
      fontSize: "24px",
      color: "#0C2244",
      margin: '0px'
    },
    optionsButton: {
        display: 'flex',
    }, 
    button: {
        margin: '5px',
        backgroundColor: '#0d2244'
    }
  }