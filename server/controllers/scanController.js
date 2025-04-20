// Define controller logic here
exports.handleScan = async (req, res) => {
    const { imageBase64 } = req.body; // You’ll send this from frontend
  
    try {
      // Later, we’ll send this image to Groq or do analysis here
      const dummyResult = {
        food: "Pasta",
        calories: 400,
      };
  
      res.status(200).json({ message: "Scan successful", result: dummyResult });
    } catch (error) {
      res.status(500).json({ message: "Error scanning image", error: error.message });
    }
  };
  