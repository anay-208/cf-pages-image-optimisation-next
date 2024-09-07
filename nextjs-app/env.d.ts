declare namespace NodeJS {
    interface ProcessEnv {
        // All of these should be put in .env file or as env variables
        IMAGE_OPTIMIZATION_TOKEN?: string;
        // CF_ZONE_URI should be the uri where the app is hosted e.g. https://cfimagestest.anayparaswani.dev/
        CF_ZONE_URI?: string;
    }
}