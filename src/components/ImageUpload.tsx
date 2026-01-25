import React, { useState } from "react";
import { uploadImage } from "@/lib/imagekit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, X, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
    className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, label, className }) => {
    const [uploading, setUploading] = useState(false);
    const { toast } = useToast();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith("image/")) {
            toast({
                title: "Invalid file type",
                description: "Please upload an image file.",
                variant: "destructive",
            });
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "File too large",
                description: "Image size should be less than 5MB.",
                variant: "destructive",
            });
            return;
        }

        setUploading(true);
        try {
            const result: any = await uploadImage(file);
            onChange(result.url);
            toast({
                title: "Success",
                description: "Image uploaded successfully.",
            });
        } catch (error: any) {
            console.error("Upload error:", error);
            toast({
                title: "Upload failed",
                description: error.message || "Something went wrong while uploading.",
                variant: "destructive",
            });
        } finally {
            setUploading(false);
        }
    };

    const removeImage = () => {
        onChange("");
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {label && <Label>{label}</Label>}

            <div className="flex items-center gap-4">
                {value ? (
                    <div className="relative w-40 h-40 rounded-xl overflow-hidden group border border-border">
                        <img src={value} alt="Preview" className="w-full h-full object-cover" />
                        <button
                            onClick={removeImage}
                            className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="w-40 h-40 rounded-xl border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center bg-muted/30">
                        <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest text-center px-2">No Image Selected</p>
                    </div>
                )}

                <div className="flex-1 space-y-2">
                    <div className="relative">
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={uploading}
                            className="hidden"
                            id="image-upload-input"
                        />
                        <Label
                            htmlFor="image-upload-input"
                            className={`flex items-center justify-center gap-2 h-12 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer text-sm font-bold uppercase tracking-widest text-primary ${uploading ? "pointer-events-none opacity-50" : ""}`}
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4" />
                                    {value ? "Change Image" : "Upload Image"}
                                </>
                            )}
                        </Label>
                    </div>
                    <p className="text-[10px] text-muted-foreground px-1 uppercase font-bold tracking-tighter italic">Recommended: 1200x800px or larger</p>

                    <div className="pt-2">
                        <Label className="text-[10px] font-black uppercase opacity-50 mb-1 block">Or use URL</Label>
                        <Input
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder="https://..."
                            className="h-10 rounded-lg text-xs"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageUpload;
