import React, {useRef, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import useFetch from "use-http";
import {Redirect, useHistory} from 'react-router-dom'
import UploadModal from "./UploadModal";



const useStyles = makeStyles((theme) => ({
    root: {
        transform: 'translateZ(0px)',
        flexGrow: 1,
    },
    exampleWrapper: {
        position: 'static',
        marginTop: theme.spacing(3),
        height: 0,
    },
    radioGroup: {
        margin: theme.spacing(1, 0),
    },
    speedDial: {
        position: 'absolute',
        '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
            bottom: theme.spacing(2),
            right: theme.spacing(2),
        },
        '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
            top: theme.spacing(2),
            left: theme.spacing(2),
        },
    },
    input: {
        display: 'none'
    }
}));

const actions = [
    {icon: <PhotoCameraIcon/>, name: 'Scan'},
    {icon: <CloudUploadIcon/>, name: 'Upload'},
];

export function ImportFile() {
    const {get, post, response, loading, error} = useFetch('document')
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    let history = useHistory();
    const [uploadModalOpen, setUploadModalOpen] = useState(false);


    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClick = () => {
        let input = document.getElementById("doc-upload");
        input.click()
    }

    const onChange = (event) => {
        let file = event.target.files[0];
        setUploadModalOpen(true)

        let data = new FormData()
        data.append('file', file)
        if (data instanceof FormData) {
            sendData(data)
        }
    }

    async function sendData(data) {
        let id = await post('', data)
        
            setUploadModalOpen(false);
        if (response.ok) {

            history.push('../entry/' + id.id['$oid'])
        }
    }

    return (
        <div className={classes.root}>
            <div  className={classes.exampleWrapper}>
                <SpeedDial
                    ariaLabel="Import new File"
                    className={classes.speedDial}
                    icon={<SpeedDialIcon/>}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    open={open}
                >
                    {actions.map((action) => (
                        <SpeedDialAction
                            key={action.name}
                            icon={action.icon}
                            tooltipTitle={action.name}
                            onClick={handleClick}
                        />
                    ))}
                </SpeedDial>
                <input accept="application/pdf,image/*" onChange={onChange} className={classes.input}
                       id="doc-upload"
                       type="file"/>
            </div>
            <UploadModal
                open={uploadModalOpen}
                setOpen={setUploadModalOpen}
            ></UploadModal>
        </div>
    );
}
