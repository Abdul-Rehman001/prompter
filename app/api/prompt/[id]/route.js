import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

// GET (read)
export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const prompt = await Prompt.findById(params.id).populate("creator");
    if (!prompt) {
      console.log(`Prompt not found with id: ${params.id}`);
      return new Response("Prompt not found", { status: 404 });
    }
    console.log("API prompt fetched:", prompt._id);

    return new Response(JSON.stringify(prompt), { status: 200 });
  } catch (error) {
    console.error("API error in GET:", error);
    return new Response("Failed to fetch prompt", { status: 500 });
  }
};

// PATCH (update)
export const PATCH = async (request, { params }) => {
  try {
    const { prompt, tag } = await request.json();
    await connectToDB();

    const existingPrompt = await Prompt.findById(params.id);
    if (!existingPrompt) {
      console.log(`Prompt not found for update with id: ${params.id}`);
      return new Response("Prompt not found", { status: 404 });
    }

    existingPrompt.prompt = prompt;
    existingPrompt.tag = tag;

    await existingPrompt.save();
    console.log("Prompt updated:", existingPrompt._id);
    return new Response(JSON.stringify(existingPrompt), { status: 200 });
  } catch (error) {
    console.error("API error in PATCH:", error);
    return new Response("Failed to update prompt", { status: 500 });
  }
};

// DELETE (delete)
export const DELETE = async (request, { params }) => {
  try {
    await connectToDB();

    const deletedPrompt = await Prompt.findByIdAndDelete(params.id);
    if (!deletedPrompt) {
      console.log(`Prompt not found for deletion with id: ${params.id}`);
      return new Response("Prompt not found", { status: 404 });
    }

    console.log("Prompt deleted:", params.id);
    return new Response("Prompt deleted successfully", { status: 200 });
  } catch (error) {
    console.error("API error in DELETE:", error);
    return new Response("Failed to delete the Prompt", { status: 500 });
  }
};
