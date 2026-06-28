import { sql } from "../config/db.js";

export const getProducts = async (req, res) => {
  try {
    const allProducts = await sql`
            SELECT * FROM products
            ORDER BY created_at DESC;
        `;

    console.log("Succesfully retrieved products!");

    res.status(200).json({
      success: true,
      data: allProducts,
      message: "Succesfully fetched data.",
    });
  } catch (error) {
    console.log("getProducts Error");
    res.status(500).json({
      success: false,
      message: "SERVER ERROR: failed to retrieve all products",
    });
  }
};

export const createProduct = async (req, res) => {
  const { name, price, image } = req.body;

  if (!name || !price || !image) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const newProduct = await sql`
            INSERT INTO products (name, price, image)
            VALUES (${name},${price},${image})
            RETURNING *
        `;

    console.log(
      "Succesfully created new product: " + JSON.stringify(newProduct[0].name),
    );

    res.status(201).json({
      success: true,
      data: newProduct[0], // json is returned wrapped in a list so need to access via index
      message: "New product created",
    });
  } catch (error) {
    console.log("createProduct error", error);
    res.status(500).json({
      success: false,
      message: "SERVER ERROR: " + error.message,
    });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const fetchedProduct = await sql`
            SELECT * FROM products where id=${id}
        `;

    res.status(200).json({
      success: true,
      data: fetchedProduct[0],
      message: "Succesfully retrieved product",
    });
  } catch (error) {
    console.log("getProduct Error", error);
    res.status(500).json({
      success: false,
      message: "SERVER ERROR: failed to retrieve product",
    });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, image } = req.params;

  try {
    const updatedProduct = await sql`
            UPDATE products
            SET name=${name}, price=${price}, image=${image}
            WHERE id=${id}
            RETURNING *
        `;

    if (updatedProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    console.log("Succesfully updated product");
    res.status(200).json({
      success: true,
      data: updatedProduct[0],
      message: "Succesfully updated product",
    });
  } catch (error) {
    console.log("updateProduct error", error);
    res.status(500).json({
      success: false,
      message: "SERVER ERROR: " + error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await sql`
            DELETE FROM products WHERE id=${id}
            RETURNING *
        `;

    if (deletedProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: deletedProduct[0],
      message: "Succesfully deleted product",
    });
  } catch (error) {
    console.log("Error in deleteProduct", error);
    res.status(500).json({
      success: false,
      message: "SERVER ERROR: " + error.message,
    });
  }
};
