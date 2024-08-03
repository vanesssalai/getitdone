import Header from "./Header"
import Footer from "./Foorter"

export default function Format({ userID, content }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header userID={userID} />
            <main className="flex-grow">
                {content}
            </main>
            <Footer />
        </div>
    );
}