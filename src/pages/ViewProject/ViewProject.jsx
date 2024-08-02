import React, { useEffect } from "react";
import Format from "../../layout/Format";

export default function ViewProject() {
    const [project, setProject] = useState([]);
    useEffect(() => {
        fetchProject();
    }, []);

    const fetchProject = async () => {
        try {
            console.log("Sending request to:", `http://localhost:3000/api/projects/${userID}/${projectID}`);
            const response = await axios.get(`http://localhost:3000/api/projects/${userID}/${projectID}`);
            setProject(response.data);
        } catch (error) {
            console.error("Error fetching projects:", error.response ? error.response.data : error.message);
        }
    };
    return (
        <Format content={
            <>
            </>
        } />
    )
}