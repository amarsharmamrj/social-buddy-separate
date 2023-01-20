import { Box } from "@mui/system"
import { lazy, Suspense } from "react";
// import MessengerMobileScreen from "./messenger-mobile-screen";
// import MessengerOtherScreen from "./messenger-other-screen"
const MessengerMobileScreen = lazy(() => import("./messenger-mobile-screen"))
const MessengerOtherScreen = lazy(() => import("./messenger-other-screen"))

const screenWidth = window.innerWidth;

const Messenger = () => {
    return (
        <Box className="messenger-container">
            {/* for screens other than mobile */}
            {/* <Box sx={{ display: { xs: "none", sm: "none", md: "block", lg: "block", xl: "block" } }}>
                <MessengerOtherScreen />
            </Box> */}
            {/* for mobile */}
            {/* <Box sx={{ display: { xs: "block", sm: "block", md: "none", lg: "none", xl: "none" } }}>
                <MessengerMobileScreen />
            </Box> */}
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