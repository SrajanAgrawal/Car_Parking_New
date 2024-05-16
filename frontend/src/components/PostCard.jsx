
import { Card } from "flowbite-react"


const PostCard = ({ post }) => {
    return (
        <>
            <div>
                <Card className="max-w-sm" imgSrc={post.image} horizontal>
                    <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {post.title}
                    </h5>
                    <p className="font-normal text-gray-700 dark:text-gray-400">
                        {post.content.slice(0, 100)}
                    </p>
                </Card>
            </div>
        </>
    )
}

export default PostCard