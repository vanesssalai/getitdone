import Header from "./Header"
import Footer from "./Foorter"

export default function Format({userID, content}) {
    return (
        <div>
            <Header userID={userID}/>
                <main>
                    {content}
                </main>
            <Footer />
        </div>
    )
}