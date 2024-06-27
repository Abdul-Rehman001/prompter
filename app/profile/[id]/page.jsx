"use client";
import Loading from "./../loading.jsx";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import Profile from "@components/Profile";

const UserProfile = ({ params }) => {
  const searchParams = useSearchParams();
  const userName = searchParams.get("name");

  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add this line

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true); // Set loading to true when starting to fetch
      try {
        const response = await fetch(`/api/users/${params?.id}/posts`);
        const data = await response.json();
        setUserPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false); // Set loading to false when done
      }
    };

    if (params?.id) fetchPosts();
  }, [params.id]);

  if (isLoading) return <Loading />;

  return (
    <Profile
      name={userName}
      desc={`Welcome to ${userName}'s personalized profile page. Explore ${userName}'s exceptional prompts and be inspired by the power of their imagination`}
      data={userPosts}
    />
  );
};

export default UserProfile;
