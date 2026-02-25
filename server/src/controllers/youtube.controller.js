import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import axios from "axios";

const searchVideos = asyncHandler(async (req, res) => {
    const { query } = req.query;

    console.log(`YouTube search query: ${query}`);

    if (!query) {
        throw new ApiError(400, "Query parameter is required");
    }

    const API_KEY = process.env.YOUTUBE_API_KEY;
    const BASE_URL = "https://www.googleapis.com/youtube/v3/search";

    if (!API_KEY) {
        throw new ApiError(500, "YouTube API Key is missing in server configuration");
    }

    try {
        const response = await axios.get(BASE_URL, {
            params: {
                part: "snippet",
                q: query,
                type: "video",
                maxResults: 6,
                key: API_KEY
            }
        });

        const items = response.data.items || [];
        console.log(`YouTube found ${items.length} videos for: ${query}`);

        res.status(200).json({
            success: true,
            data: items
        });
    } catch (error) {
        console.error("YouTube API Error Details:", error.response ? error.response.data : error.message);
        throw new ApiError(500, "Failed to fetch videos from YouTube");
    }
});

export default {
    searchVideos
};
