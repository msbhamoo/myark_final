import ImageKit from "imagekit-javascript";

export const imagekit = new ImageKit({
    publicKey: "public_UendSft2ebMyCy+kBX4jmul1xNA=",
    urlEndpoint: "https://ik.imagekit.io/myark",
    // Note: authenticationEndpoint is required for secure uploads from frontend.
    // For this demo, we can use the private key directly if really needed, 
    // but it's better to use an auth endpoint. 
    // However, given the user's request to "use" these keys, I'll provide a helper.
});

export const IK_CONFIG = {
    publicKey: "public_UendSft2ebMyCy+kBX4jmul1xNA=",
    urlEndpoint: "https://ik.imagekit.io/myark",
    privateKey: "private_RO2RIB5sE7+pkJm5NLxgxTh8P5M=", // STRONGLY ADVISED TO MOVE TO BACKEND
};

/**
 * Helper to upload a file to ImageKit
 * @param file The file to upload
 * @param fileName Optional filename
 * @returns Promise with the upload result
 */
export const uploadImage = async (file: File, fileName?: string) => {
    return new Promise((resolve, reject) => {
        // Usually we need a signature from a backend, but we'll try direct upload
        // since the user provided the private key (caution!!)
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            try {
                // Direct upload using fetch and ImageKit API if sdk-js doesn't support private key client-side (it shouldn't)
                // Actually, ImageKit JS SDK usually requires authenticationEndpoint.
                // We can simulate an authenticationEndpoint or just use direct API.

                const formData = new FormData();
                formData.append("file", file);
                formData.append("fileName", fileName || file.name);
                formData.append("publicKey", IK_CONFIG.publicKey);

                // This is highly insecure but requested:
                // Normally you'd sign this on a server.
                // We'll use a direct fetch to ImageKit's upload API.

                const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
                    method: "POST",
                    headers: {
                        "Authorization": "Basic " + btoa(IK_CONFIG.privateKey + ":"),
                    },
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error("Upload failed: " + await response.text());
                }

                const data = await response.json();
                resolve(data);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = (error) => reject(error);
    });
};
