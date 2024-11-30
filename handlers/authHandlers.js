import { azureCosmosSQLUsers } from "../config/AzureCosmosConfig.js";
import { doesEmailExist } from "../utils/doesEmailExist.js";
import bcrypt from "bcrypt";
export const signUpHandler = async (req, res) => {
  const { email, password } = req.body;

  try {
    const newUser = {
      email,
      password,
      viewedArticles: [],
      private: true,
    };
    const { resource: createdUser } = await azureCosmosSQLUsers.create(newUser);
    res.status(201).json({
      message: "User registered successfully",
      userId: createdUser.id,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Internal Server Error");
  }
};
export const loginHandler = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { resources: users } = await azureCosmosSQLUsers.query(
      "SELECT * FROM c WHERE c.email = @email",
      [{ name: "@email", value: email }]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      ok: true,
      message: "Login successful",
      userId: user.id,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const checkEmailHandler = async (req, res) => {
  const { email } = req.params;

  try {
    const emailExists = await doesEmailExist(email);
    res.status(200).json({ emailExists });
  } catch (error) {
    console.error("Error checking email:", error);
    res.status(500).send("Internal Server Error");
  }
};
