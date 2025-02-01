const express=require("express");
const Image=require("../models/product")






const loginRoute = require("./login");
const singupRoute = require("./signup");



const userController=require("../controllers/user")

const CartDetails = require("./cart");
const { CartGet } = require("../controllers/cartdisplay");
const { CartPut } = require("../controllers/cartremove");
const { authenticateToken } = require("../utils/authMiddeleware");
const { NotifyGet } = require("../controllers/NotifyGet");
const DashboardGet = require("../controllers/DashboardGet");
const { NotifyRemove } = require("../controllers/Notifyremove");
const multer = require("multer");

const router=express.Router();

router.route("/cart").post(authenticateToken,CartDetails);
router.get("/users",authenticateToken,userController.getUsers);
router.route("/cartget").get(authenticateToken,CartGet)
router.route("/cartput").post(authenticateToken,CartPut)
router.route("/notifyremove").post(authenticateToken,NotifyRemove)
router.route("/notify").get(authenticateToken,NotifyGet)
router.route("/dashimages").get(authenticateToken,DashboardGet)

// router.route("/image").get(authenticateToken,AdminGEt)
router.use("/auth",loginRoute)
router.use("/user", singupRoute);
//admin

const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/"));  // Make sure the path is correct
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });



router.post("/upload", upload.single("image"), async (req, res) => {
  const { title, description, amount } = req.body;
  const image = new Image({
    title,
    description,
    amount,
    image: `uploads/${req.file.filename}`,  // Use relative path for image
  });
  await image.save();
  res.status(201).json(image);
});

router.get("/images", authenticateToken, async (req, res) => {
  try {
    const images = await Image.find();
    // Images should now have the correct relative path
    res.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).send({ message: "Error fetching images", error });
  }
});


router.put("/images/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { title, description, amount } = req.body;
  const updateData = { title, description, amount };
  if (req.file) {
    updateData.image = req.file.path;
  }
  const updatedImage = await Image.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  res.json(updatedImage);
});

router.delete("/images/:id", async (req, res) => {
  const { id } = req.params;
  await Image.findByIdAndDelete(id);
  res.json({ message: "Image deleted" });
});



module.exports=router;