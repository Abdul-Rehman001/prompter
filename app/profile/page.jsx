import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router"; // Use 'next/router' instead of 'next/navigation'

import Profile from "@components/Profile";

const MyProfile = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      if (typeof window !== "undefined" && session?.user?.id) {
        try {
          const response = await fetch(`/api/users/${session.user.id}/posts`);
          if (!response.ok) {
            throw new Error("Failed to fetch posts");
          }
          const data = await response.json();
          console.log("Fetched posts:", data);
          setPosts(data);
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      }
    };

    fetchPosts();
  }, [session]);

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };

  const handleDelete = async (post) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );

    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, {
          method: "DELETE",
        });

        const filteredPosts = posts.filter((p) => p._id !== post._id);
        setPosts(filteredPosts);
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  return (
    <Profile
      name="My"
      desc="Welcome to your personalized profile page"
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;
