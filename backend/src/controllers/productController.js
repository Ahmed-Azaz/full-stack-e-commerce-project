const mapProduct = (p) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    rating: p.rating,
    description: p.description,
    images: p.images || [],
    thumbnail: p.thumbnail || (p.images && p.images[0]) || "",
    brand: p.brand || "",
    category: p.category || "",
    stock: p.stock ?? 0
});

export const getProducts = async (req, res) => {
    console.log("HIT PRODUCTS ROUTE");
    try {
        const limit = req.query.limit || 100;
        const url = `https://dummyjson.com/products?limit=${limit}`;
        const response = await fetch(url);

        if (!response.ok) {
            return res.status(500).json({ message: "Failed to fetch products" });
        }

        const data = await response.json();
        const products = (data.products || []).map(mapProduct);

        return res.json({ products, total: data.total, skip: data.skip, limit: data.limit });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await fetch(`https://dummyjson.com/products/${id}`);

        if (!response.ok) {
            return res.status(404).json({ message: "Product not found" });
        }

        const data = await response.json();
        return res.json({ product: mapProduct(data) });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};