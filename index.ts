import express from "express";
import type { Request, Response } from "express";

const app = express();

app.get("/", (request: Request, response: Response) =>
  response.send("Hello, world!"),
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`App started on ${new Date().toISOString()}`);
});
