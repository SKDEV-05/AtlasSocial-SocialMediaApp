import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Head, router } from "@inertiajs/react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/Components/ui/card";
import { Users, FileText, MessageSquare, Trash2, AlertTriangle, Pencil } from "lucide-react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import EditPost from "@/Components/EditPost";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboard({ stats, posts }) {
  const [editingPost, setEditingPost] = React.useState(null);

  const handleDeletePost = (id) => {
    router.delete(route('admin.posts.delete', id), {
      preserveScroll: true,
    });
  };

  return (
    <AuthenticatedLayout header="Admin Dashboard">
      {editingPost && (
        <EditPost 
          post={editingPost} 
          open={!!editingPost} 
          onOpenChange={(open) => !open && setEditingPost(null)} 
        />
      )}
      <Head title="Admin Dashboard" />

      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-blue-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.users}</div>
              <p className="text-xs text-blue-100/80">Active platform users</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">
                Total Posts
              </CardTitle>
              <FileText className="h-4 w-4 text-purple-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.posts}</div>
              <p className="text-xs text-purple-100/80">Content shared by users</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">
                Total Messages
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-green-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.messages}</div>
              <p className="text-xs text-green-100/80">Private conversations</p>
            </CardContent>
          </Card>
        </div>

        {/* Post Management */}
        <Card className="shadow-md border-border/50">
          <CardHeader>
            <CardTitle>Post Management</CardTitle>
            <CardDescription>View and manage all user posts.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>A list of recent posts.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Content</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Likes</TableHead>
                  <TableHead>Posted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col gap-2">
                        <span className="truncate max-w-[300px] block" title={post.body}>
                          {post.body}
                        </span>
                        {post.image && (
                          <div className="h-12 w-12 rounded overflow-hidden bg-muted">
                            <img 
                              src={`/storage/${post.image}`} 
                              alt="Post attachment" 
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user.name}`} />
                          <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{post.user.name}</span>
                          <span className="text-xs text-muted-foreground">{post.user.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="rounded-full">
                        {post.likes_count}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                    </TableCell>
                    <TableCell className="text-right flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setEditingPost(post)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                              <AlertTriangle className="h-5 w-5 text-destructive" />
                              Delete Post
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this post? This action cannot be undone and will permanently remove the post from the platform.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeletePost(post.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
