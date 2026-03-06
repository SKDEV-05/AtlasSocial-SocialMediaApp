import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Head } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/Components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog"
import { Separator } from "@/Components/ui/separator";

export default function DesignSystem() {
    return (
        <AuthenticatedLayout header="Design System">
            <Head title="Design System" />

            <div className="space-y-10 pb-10">
                
                {/* Colors */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold">Colors</h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="space-y-2">
                            <div className="h-20 rounded-lg bg-primary shadow-sm"></div>
                            <p className="font-medium">Primary</p>
                        </div>
                        <div className="space-y-2">
                            <div className="h-20 rounded-lg bg-secondary shadow-sm"></div>
                            <p className="font-medium">Secondary</p>
                        </div>
                        <div className="space-y-2">
                            <div className="h-20 rounded-lg bg-accent shadow-sm"></div>
                            <p className="font-medium">Accent</p>
                        </div>
                        <div className="space-y-2">
                            <div className="h-20 rounded-lg bg-muted shadow-sm"></div>
                            <p className="font-medium">Muted</p>
                        </div>
                        <div className="space-y-2">
                            <div className="h-20 rounded-lg bg-destructive shadow-sm"></div>
                            <p className="font-medium">Destructive</p>
                        </div>
                    </div>
                </section>

                <Separator />

                {/* Buttons */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold">Buttons</h2>
                    <div className="flex flex-wrap gap-4">
                        <Button>Default</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="destructive">Destructive</Button>
                        <Button variant="link">Link</Button>
                        <Button variant="premium">Premium</Button>
                    </div>
                    <div className="flex flex-wrap gap-4 items-center">
                        <Button size="sm">Small</Button>
                        <Button size="default">Default</Button>
                        <Button size="lg">Large</Button>
                        <Button size="icon">Icon</Button>
                    </div>
                </section>

                <Separator />

                {/* Inputs */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold">Inputs</h2>
                    <div className="grid md:grid-cols-2 gap-4 max-w-2xl">
                        <Input placeholder="Default Input" />
                        <Input placeholder="Disabled Input" disabled />
                        <Input type="email" placeholder="Email" />
                        <Input type="password" placeholder="Password" />
                    </div>
                </section>

                <Separator />

                {/* Badges */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold">Badges</h2>
                    <div className="flex gap-2">
                        <Badge>Default</Badge>
                        <Badge variant="secondary">Secondary</Badge>
                        <Badge variant="outline">Outline</Badge>
                        <Badge variant="destructive">Destructive</Badge>
                        <Badge variant="success">Success</Badge>
                        <Badge variant="warning">Warning</Badge>
                    </div>
                </section>

                <Separator />

                {/* Avatars */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold">Avatars</h2>
                    <div className="flex gap-4 items-end">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-14 w-14">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </div>
                </section>

                <Separator />

                {/* Cards */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold">Cards</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Card Title</CardTitle>
                                <CardDescription>Card Description</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>This is the content of the card.</p>
                            </CardContent>
                            <CardFooter>
                                <Button>Action</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </section>

                <Separator />

                {/* Dialog */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold">Dialog / Modal</h2>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">Open Dialog</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Are you sure?</DialogTitle>
                                <DialogDescription>
                                    This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button type="submit">Confirm</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </section>

            </div>
        </AuthenticatedLayout>
    );
}
