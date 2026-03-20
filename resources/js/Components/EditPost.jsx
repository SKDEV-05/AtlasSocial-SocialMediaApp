import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Input } from "@/Components/ui/input";
import { Loader2 } from "lucide-react";

export default function EditPost({ post, open, onOpenChange }) {
    const { auth } = usePage().props;
    const [body, setBody] = useState(post.body);
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    React.useEffect(() => {
        setBody(post.body);
        setImage(null);
    }, [post]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append('body', body);
        if (image) {
            formData.append('image', image);
        }
        formData.append('_method', 'PUT'); // Spoofing PUT for file upload support

        router.post(route('posts.update', post.id), formData, {
            forceFormData: true,
            onSuccess: () => {
                setIsLoading(false);
                onOpenChange(false);
            },
            onError: () => {
                setIsLoading(false);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Post</DialogTitle>
                    <DialogDescription>
                        Make changes to your post here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="body">Content</Label>
                        <Textarea
                            id="body"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="image">Image (Optional)</Label>
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
