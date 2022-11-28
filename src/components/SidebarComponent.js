import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { 
    UserCircle, FileX, SignOut,
    FileText, BookOpen
 } from "phosphor-react";
import { Link } from 'react-router-dom';

export default function SidebarComponent(){
    
    return (
        <Sidebar 
            backgroundColor={"#0d2244"}
        >
            <Menu>
                <SubMenu label="Reports" style={{color: "white", backgroundColor:"#0d2244"}}>
                    <MenuItem routerLink={<Link to="/library" />} style={{color: "white", backgroundColor:"#0d2244"}}> 
                        <div style={style.link}>
                            <BookOpen size={24} style={{paddingRight: '5px'}}></BookOpen>
                            Library 
                        </div>
                    </MenuItem>
                    <MenuItem routerLink={<Link to="/errorReports" />} style={{color: "white", backgroundColor:"#0d2244"}}> 
                        <div style={style.link}>
                            <FileX size={24} style={{paddingRight: '5px'}}></FileX>
                            Error Reports 
                        </div>
                    </MenuItem>
                    <MenuItem routerLink={<Link to="/dataReports" />} style={{color: "white", backgroundColor:"#0d2244"}}> 
                        <div style={style.link}>
                            <FileText size={24} style={{paddingRight: '5px'}}></FileText>
                            Data Reports 
                        </div>
                    </MenuItem>
                </SubMenu>
                <SubMenu label="Practitioner Data" style={{color: "white", backgroundColor:"#0d2244"}}>
                    <MenuItem routerLink={<Link to="/practitionerSearch" />} style={{color: "white", backgroundColor:"#0d2244"}}>
                        <div style={style.link}>
                            <UserCircle size={24} style={{paddingRight: '5px', color: "white"}}/> 
                            Pratitioner Search
                        </div>
                    </MenuItem>
                </SubMenu>
                <MenuItem routerLink={<Link to="/" />} style={{color: "white", backgroundColor:"#0d2244"}}>
                    <div style={style.link}>
                        <SignOut size={24} style={{paddingRight: '5px', color: "white"}}/> 
                        Log Out
                    </div>
                </MenuItem>
            </Menu>
        </Sidebar>
    )
}

const style = {
    link: {
        display: 'flex',
        alignItems: 'center'
    }
}