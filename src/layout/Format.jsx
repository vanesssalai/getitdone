import Header from "./Header"
import Footer from "./Foorter"

export default function Format({content}) {
    return (
        <div>
            <Header />
                <main>
                    {content}
                </main>
            <Footer />
        </div>
    )
}