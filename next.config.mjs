/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
            { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'i.pravatar.cc' }
        ],
        minimumCacheTTL: 60,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    devIndicators: {
        appIsrStatus: false,
        buildActivity: false,
    },

};

export default nextConfig;
