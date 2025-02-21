import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const prompts = await Prompt.find({ creator: params.id }).populate(
      "creator"
    );
    console.log("API prompts:", prompts); // Add this line

    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    console.error("API error:", error); // Add this line
    return new Response("Failed to fetch all prompts", { status: 500 });
  }
};
