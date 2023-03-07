import express from "express";

declare module "express" {
    interface Request {
        omdb_api_key?: string;
    }
}
