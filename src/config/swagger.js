import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Agriculture Machinery Marketplace API",
            version: "1.0.0"
        },
        servers: [{ url: "/api" }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            },
            schemas: {
                Listing: {
                    type: "object",
                    required: ["machineName", "machineType", "condition", "price", "location", "images", "contactNumber"],
                    properties: {
                        machineName: { type: "string", example: "John Deere 5050D" },
                        machineType: { type: "string", enum: ["Tractor", "Harvester", "Tiller", "Plough", "Seeder", "Sprayer", "Other"], example: "Tractor" },
                        condition: { type: "string", enum: ["Good", "Fair"], example: "Good" },
                        price: { type: "number", example: 450000 },
                        location: { type: "string", example: "Hyderabad, Telangana" },
                        description: { type: "string", example: "Well maintained tractor, single owner." },
                        images: {
                            type: "object",
                            properties: {
                                front: { type: "string", example: "https://img-host.com/front.jpg" },
                                back: { type: "string", example: "https://img-host.com/back.jpg" },
                                left: { type: "string", example: "https://img-host.com/left.jpg" },
                                right: { type: "string", example: "https://img-host.com/right.jpg" }
                            }
                        },
                        video: { type: "string", example: "https://video-host.com/test.mp4" },
                        contactNumber: { type: "string", example: "+91 9876543210" },
                        status: { type: "string", enum: ["pending_review", "approved", "rejected", "deleted"], example: "pending_review" }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ["./src/routes/*.js"]
};


const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
