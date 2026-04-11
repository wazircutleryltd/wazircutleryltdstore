"use client";

import { useState, useEffect } from "react";
import { useAllNewsletterSubscribers, useDeleteNewsletterSubscriber } from "@/lib/supabase-hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { LoadingState, ErrorState, NoDataState } from "../common/StateComponents";

export default function NewsletterClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [reloadToken, setReloadToken] = useState(0);

  const { data: subscribers, isLoading: subscribersLoading, error } = useAllNewsletterSubscribers(reloadToken);
  const { deleteNewsletterSubscriber, isLoading: isDeleting } = useDeleteNewsletterSubscriber();

  useEffect(() => {
    if (error) {
      toast.error('Failed to fetch subscribers.');
    }
  }, [error]);

  const filteredSubscribers = subscribers?.filter(subscriber => {
    return subscriber.email.toLowerCase().includes(searchTerm.toLowerCase());
  }) || [];

  const handleDeleteSubscriber = async (subscriberId) => {
    if (confirm("Are you sure you want to delete this subscriber?")) {
      try {
        await deleteNewsletterSubscriber(subscriberId);
        setReloadToken((t) => t + 1);
        toast.success('Subscriber deleted successfully!');
      } catch (error) {
        console.error("Error deleting subscriber:", error);
        toast.error('Failed to delete subscriber. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#2C2C2C] mb-4">Newsletter Subscribers</h2>
          <p className="text-[#2C2C2C] opacity-80">
            Manage your newsletter subscribers.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-[#2C2C2C]">Subscriber Search</CardTitle>
          <CardDescription className="text-[#2C2C2C] opacity-80">
            Search for subscribers by email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-[#2C2C2C]">All Subscribers</CardTitle>
          <CardDescription className="text-[#2C2C2C] opacity-80">
            A list of all your newsletter subscribers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Subscription Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribersLoading ? (
                <TableRow>
                  <TableCell colSpan={3}>
                    <LoadingState message="Fetching subscribers..." minHeight="h-48" />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={3}>
                    <ErrorState message="Could not load subscribers." minHeight="h-48" />
                  </TableCell>
                </TableRow>
              ) : filteredSubscribers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3}>
                    <NoDataState 
                        message="No subscribers" 
                        description="Your newsletter audience is waiting to grow." 
                        minHeight="h-48" 
                    />
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                  <TableCell>
                    <div className="font-medium">{subscriber.email}</div>
                  </TableCell>
                  <TableCell>{new Date(subscriber.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white text-red-600 hover:text-red-700 border border-[#C0C0C0] hover:bg-gray-50"
                      onClick={() => handleDeleteSubscriber(subscriber.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
