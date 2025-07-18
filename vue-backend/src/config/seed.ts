import { pool } from "./database";
import { mockData, users } from "./data/mock-data";

const seedData = async () => {
  const connection = await pool.getConnection();

  try {
    // Begin transaction
    await connection.beginTransaction();

    // Extract unique categories and assign IDs
    const categories = [
      ...new Set(mockData.map((product: any) => product.category)),
    ].map((name: any, index: any) => ({
      id: index + 1,
      name,
    }));

    // Seed categories
    console.log("Seeding categories...");
    for (const category of categories) {
      await connection.execute(
        "INSERT IGNORE INTO categories (id, name, created_at, updated_at) VALUES (?, ?, ?, ?)",
        [
          category.id,
          category.name,
          new Date().toISOString(),
          new Date().toISOString(),
        ]
      );
    }
    console.log("Categories seeded successfully");

    // Create a category map for quick lookup
    const categoryMap = new Map(categories.map((cat) => [cat.name, cat.id]));

    // Seed products
    console.log("Seeding products...");
    for (const product of mockData) {
      const categoryId = categoryMap.get(product.category);
      if (!categoryId) {
        throw new Error(`Category not found for product: ${product.title}`);
      }

      await connection.execute(
        `INSERT INTO products (
          id, title, description, price, category_id, 
          is_active, rating, num_reviews, discount, popular, onSale, 
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product.id,
          product.title,
          product.description,
          product.price,
          categoryId,
          product.is_active ? 1 : 0,
          product.rating,
          product.num_reviews,
          product.discount,
          product.popular ? 1 : 0,
          product.onSale ? 1 : 0,
          product.created_at,
          product.updated_at,
        ]
      );

      // Insert product images
      if (product.images && product.images.length > 0) {
        for (const imageUrl of product.images) {
          await connection.execute(
            "INSERT INTO product_images (product_id, image_url, created_at) VALUES (?, ?, ?)",
            [product.id, imageUrl, new Date().toISOString()]
          );
        }
      }
    }
    console.log("Products seeded successfully");


    // Insert users
    console.log("Seeding users...");
    for (const user of users) {
      await connection.execute(
        "INSERT IGNORE INTO users (id, name, email, password, phone, address, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          user.id,
          user.name,
          user.email,
          user.password,
          user.phone,
          user.address,
          user.created_at,
          user.updated_at,
        ]
      );
    }
    console.log("Users seeded successfully");

    // Commit transaction
    await connection.commit();
    console.log("🎉 Seeding completed successfully");
  } catch (error) {
    // Rollback transaction on error
    await connection.rollback();
    console.error("❌ Error seeding data:", error);
    throw error;
  } finally {
    connection.release();
  }
};

// Run the seeder
const runSeeder = async () => {
  try {
    await seedData();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

if (require.main === module) {
  runSeeder();
}

export { seedData };
