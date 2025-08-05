const Log = require("../models/Log");
const Product = require("../models/Product");

const autoLogger = async (req, res, next) => {
  const changeMethods = ["POST", "PUT", "PATCH", "DELETE"];
  if (!changeMethods.includes(req.method)) return next();

  let oldProduct = null;

  
  if (
    (req.method === "DELETE" ||
      req.method === "PUT" ||
      req.method === "PATCH") &&
    req.params.id
  ) {
    try {
      oldProduct = await Product.findById(req.params.id).lean();
    } catch (err) {
      console.error("Error fetching old product for logging:", err);
    }
  }

  res.on("finish", async () => {
    try {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const userName = req.user?.name || "Unknown User";
        const userRole = req.user?.role || "Unknown Role";

        let action = "";
        if (req.method === "POST") action = "Created/Added";
        if (req.method === "PUT" || req.method === "PATCH") action = "Updated";
        if (req.method === "DELETE") action = "Deleted";

        const endpointParts = req.originalUrl.split("/");
        const resourceName = endpointParts[2] || "Resource";

        let details = "";

        if (resourceName === "products") {
          if (req.method === "POST" && res.locals?.createdProduct) {
            const p = res.locals.createdProduct;
            details = `Added product: ${
              p.productName || "Unknown Product"
            } (ID: ${p._id})`;
          } else if (req.method === "DELETE") {
            const pName = req.headers["x-product-name"];
            if (pName) {
              details = `Deleted product: ${pName} (ID: ${req.params.id})`;
            } else if (oldProduct) {
              details = `Deleted product: ${
                oldProduct.productName || "Unknown Product"
              } (ID: ${oldProduct._id})`;
            } else {
              details = `Deleted product with ID: ${req.params.id}`;
            }
          } else if (req.method === "PUT" || req.method === "PATCH") {
            if (oldProduct) {
              details = `Updated product: ${
                oldProduct.productName || "Unknown Product"
              } (ID: ${oldProduct._id})`;
            } else {
              details = `Updated product with ID: ${req.params.id}`;
            }
          }
        }

        if (!details) {
          details = JSON.stringify(req.body);
        }

        await Log.create({
          userId: req.user?._id || null,
          userName,
          userRole,
          method: req.method,
          endpoint: req.originalUrl,
          action: `${action} ${resourceName}`,
          details,
        });
      }
    } catch (err) {
      console.error("Auto logging error:", err);
    }
  });

  next();
};

module.exports = autoLogger;
