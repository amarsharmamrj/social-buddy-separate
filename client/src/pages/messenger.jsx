import { Box } from "@mui/system"
import { useEffect, useRef } from "react";
import { lazy, Suspense } from "react";
// import MessengerMobileScreen from "./messenger-mobile-screen";
// import MessengerOtherScreen from "./messenger-other-screen"
const MessengerMobileScreen = lazy(() => import("./messenger-mobile-screen"))
const MessengerOtherScreen = lazy(() => import("./messenger-other-screen"))

const screenWidth = window.innerWidth;
 
const Messenger = () => {
    return (
        <Box className="messenger-container">
            <Suspense fallbak={<p>Loading..</p>}>
                {
                    screenWidth < 800 ? (
                        <MessengerMobileScreen />
                    ) : (
                        <MessengerOtherScreen />
                    )
                }
            </Suspense>
        </Box>
    )
}

export default Messenger;