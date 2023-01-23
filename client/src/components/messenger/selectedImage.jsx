import moment from 'moment'
import { useRef } from 'react'
import { useEffect } from 'react'
import { IconButton, Tooltip } from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel';

const SelectedImage = (props) => {
    // const dummyImage = "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    const scrollRef = useRef()

    // const handleCloseImagePreview = () => {
    //     props.setImageSelected("")
    //     props.setIsImageSelected(false)
    // }
    
    useEffect(() => {
        scrollRef?.current?.scrollIntoView({behavior: "smooth"})
    }, [props.isImageSelected])
    return (
        <>
        {
            props.isImageSelected ? (
                <div ref={scrollRef} className="selected-image-preview">
                    <img src={props.imageSelected} alt="" />
                    <Tooltip title="Remove">
                    <IconButton className="cancel-selected-image" onClick={props.handleCloseImagePreview}>
                        <CancelIcon sx={{color: "#1976d2", height: "1.7rem", width: "1.7rem"}} />
                    </IconButton>
                    </Tooltip>
                </div>
                ) : ("")
        }
        </>
    )
}

export default SelectedImage