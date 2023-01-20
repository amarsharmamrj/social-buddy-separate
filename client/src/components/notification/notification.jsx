const Notification = ({noti: noti}) => {
    return (
        <div className="noti">
            <p>{noti.type}</p>
            <p>{noti.text}</p>
        </div>
    )
}

export default Notification