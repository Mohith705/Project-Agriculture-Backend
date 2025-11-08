import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Agriculture Machinery Marketplace API",
            version: "1.0.0",
            description: "API documentation for Agriculture Machinery Marketplace"
        },
        servers: [{ url: "/api" }]
    },
    apis: ["./src/routes/*.js"] // scans all route files for JSDoc
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
