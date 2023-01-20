import Footer from "./footer"
import Header from "./header"

const Template = (props) => {
    return (
        <>
            <Header />
            {props.children}
            {/* <Footer /> */}
        </>
    )
}

export default Template