import React, { useState, useRef } from 'react';
import { usePage, router } from '@inertiajs/react';
import TextareaAutosize from 'react-textarea-autosize';
import { Image as ImageIcon, X, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { useDropzone } from 'react-dropzone';

export default function CreatePost() {
    const { auth } = usePage().props;
    const [body, setBody] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 1
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!body.trim() && !image) return;

        setIsSubmitting(true);
        router.post(route('posts.store'), { 
            body, 
            image,
            userId: auth.user.id 
        }, {
            onSuccess: () => {
                setBody("");
                setImage(null);
                setPreview(null);
                setIsSubmitting(false);
            },
            onError: () => setIsSubmitting(false)
        });
    };

    const removeImage = (e) => {
        e.stopPropagation();
        setImage(null);
        setPreview(null);
    };

    return (
        <Card className="mb-8 border-border/50 shadow-sm overflow-hidden">
            <CardContent className="p-4">
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-4">
                        <Avatar className="h-10 w-10 mt-1">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${auth.user.name}`} />
                            <AvatarFallback>{auth.user.name[0]}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 space-y-4">
                            <TextareaAutosize
                                minRows={2}
                                placeholder={`What's on your mind, ${auth.user.name}?`}
                                className="w-full resize-none bg-transparent text-lg placeholder:text-muted-foreground/60 focus:outline-none"
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                            />

                            <AnimatePresence>
                                {(preview || isDragActive) && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="relative rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/25 bg-muted/10 min-h-[100px] flex items-center justify-center"
                                        {...getRootProps()}
                                    >
                                        <input {...getInputProps()} />
                                        {preview ? (
                                            <div className="relative w-full">
                                                <img src={preview} alt="Preview" className="w-full max-h-[300px] object-contain rounded-lg" />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-md"
                                                    onClick={removeImage}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="text-center p-8 text-muted-foreground">
                                                <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                                <p className="text-sm">Drop image here or click to upload</p>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex items-center justify-between pt-2 border-t">
                                <div className="flex gap-2">
                                    <div {...getRootProps()} className="cursor-pointer">
                                        <input {...getInputProps()} />
                                        <Button type="button" variant="ghost" size="sm" className="text-muted-foreground hover:text-primary gap-2">
                                            <ImageIcon className="h-4 w-4" />
                                            <span className="hidden sm:inline">Photo</span>
                                        </Button>
                                    </div>
                                </div>
                                <Button 
                                    type="submit" 
                                    disabled={(!body.trim() && !image) || isSubmitting}
                                    className="gap-2"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                    Post
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
