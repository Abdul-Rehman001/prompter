"use client";
import { useState, useEffect } from "react";
import PromptCard from "./PromptCard";
import Loader from "./Loader";
const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Chat states
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");

  // Search states
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  const fetchPosts = async () => {
    const response = await fetch("/api/prompt");
    const data = await response.json();
    setAllPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i"); // 'i' flag for case-insensitive search
    return allPosts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);
    const searchResult = filterPrompts(tagName);
    setSearchedResults(searchResult);
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Sending request with prompt:", chatInput);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: chatInput }),
      });
      console.log("Received response:", response);
      const data = await response.json();
      console.log("Parsed data:", data);
      setChatResponse(data.response);
    } catch (error) {
      console.error("Error:", error);
      setChatResponse("An error occurred while processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderResponse = (response) => {
    if (!Array.isArray(response) || response.length === 0) {
      return <p>{response || "No response received."}</p>;
    }

    const linkify = (text) => {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      return text.split(urlRegex).map((part, index) =>
        urlRegex.test(part) ? (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {part}
          </a>
        ) : (
          part
        )
      );
    };

    return (
      <ul className="list-disc pl-5">
        {response.map((point, index) => (
          <li key={index} className="mb-2">
            {linkify(point.replace(/^[*-]\s*|\s*[*-]$/g, "").trim())}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>
      <p className="font-semibold text-sm flex justify-center align-middle text-emerald-900/50 block">
        Scroll down to test your prompt or Click here
        <a
          className="text-emerald-700 font-bold px-2"
          href="https://chatgpt.com/"
        >ChatGpt</a>
      </p>

      {/* All Prompts */}

      {searchText ? (
        <PromptCardList
          data={searchedResults}
          handleTagClick={handleTagClick}
        />
      ) : (
        <PromptCardList data={allPosts} handleTagClick={handleTagClick} />
      )}

      {/* Google Gemini Section */}
      <div className="mt-16 w-full mb-10">
        <h2 className="bg-gradient-to-r from-emerald-300 to-emerald-800 bg-clip-text text-transparent text-xl font-bold mb-4">
          Test your prompt with Google Gemini
        </h2>
        <form onSubmit={handleChatSubmit} className="flex flex-col space-y-4">
          <textarea
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Enter your prompt here..."
            className="w-full p-2 border border-emerald-300 rounded-lg"
            rows="4"
          />
          <button
            type="submit"
            className="shadow bg-gradient-to-r from-emerald-500 to-emerald-900 text-white px-4 py-2 rounded-lg "
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Submit to Gemini"}
          </button>
        </form>
        {isLoading ? (
          <div className="mt-4 flex justify-center">
            <Loader />
          </div>
        ) : chatResponse ? (
          <div className="mt-4 p-4 border-2 border-emerald-200 backdrop-blur-sm shadow-md rounded-lg max-h-96 overflow-auto mb-10">
            <h3 className="font-bold mb-2 text-emerald-600">
              Gemini Response:
            </h3>
            {renderResponse(chatResponse)}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default Feed;
