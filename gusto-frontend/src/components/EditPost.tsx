import { useParams } from "react-router-dom";
import { getPostById } from "../utils/postStorage";
import Addpost from "../pages/Post";


export default function EditPost() {

    const { id } = useParams();
    const post = getPostById(Number(id));

    return(
        <Addpost type="edit" editImg={post?.image} editTitle={post?.title} editDes={post?.description} editsteps={post?.steps} editID={post?.id}/>
    );
}