import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Shield, FileText, Upload, Download, Trash2, Lock } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface Document {
  id: string;
  file_name: string;
  document_type: string;
  file_url: string;
  uploaded_at: string;
}

const Documents = () => {
  const [user, setUser] = useState<User | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [documentType, setDocumentType] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) navigate("/auth");
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) navigate("/auth");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) fetchDocuments();
  }, [user]);

  const fetchDocuments = async () => {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", user?.id)
      .order("uploaded_at", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load documents.",
      });
    } else {
      setDocuments(data || []);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !documentType) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select a document type before uploading.",
      });
      return;
    }

    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${user?.id}/${documentType}_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from("documents").upload(fileName, file, { upsert: true });

    if (uploadError) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: uploadError.message,
      });
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("documents").getPublicUrl(fileName);

    const { error: dbError } = await supabase.from("documents").insert({
      user_id: user?.id,
      file_name: file.name,
      document_type: documentType,
      file_url: publicUrl,
    });

    if (dbError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save document information.",
      });
    } else {
      toast({
        title: "Document Uploaded",
        description: `${file.name} has been securely stored.`,
      });
      fetchDocuments();
      setDocumentType("");
    }

    setUploading(false);
  };

  const deleteDocument = async (doc: Document) => {
    const pathParts = doc.file_url.split("/");
    const fileName = pathParts.slice(-2).join("/"); // extract user_id/filename
    if (!fileName) return;

    const { error: storageError } = await supabase.storage.from("documents").remove([fileName]);

    if (storageError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete file from storage.",
      });
      return;
    }

    const { error: dbError } = await supabase.from("documents").delete().eq("id", doc.id);

    if (dbError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete document.",
      });
    } else {
      toast({
        title: "Document Deleted",
        description: `${doc.file_name} has been removed.`,
      });
      fetchDocuments();
    }
  };

  const getDocumentIcon = (type: string) => <FileText className="w-8 h-8 text-primary" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">SAFETRIP</h1>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-2">Document Vault</h2>
            <p className="text-muted-foreground">Securely store your important travel documents</p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Upload Document
              </CardTitle>
              <CardDescription>Keep your important documents safe and accessible</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Document Type</label>
                  <Select value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aadhar">Aadhar Card</SelectItem>
                      <SelectItem value="pan">PAN Card</SelectItem>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="driving_license">Driving License</SelectItem>
                      <SelectItem value="voter_id">Voter ID</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label
                    htmlFor="file-upload"
                    className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
                  >
                    <div className="text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {uploading ? "Uploading..." : "Click to upload or drag and drop"}
                      </span>
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      accept=".pdf,.jpg,.jpeg,.png"
                      disabled={uploading || !documentType}
                    />
                  </label>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="w-4 h-4" />
                  <span>All documents are encrypted and securely stored</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <h3 className="text-2xl font-bold mb-6">Your Documents</h3>
            {documents.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No documents uploaded yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {documents.map((doc) => (
                  <Card key={doc.id}>
                    <CardContent className="flex items-center justify-between pt-6">
                      <div className="flex items-center gap-4">
                        {getDocumentIcon(doc.document_type)}
                        <div>
                          <h4 className="font-semibold">{doc.file_name}</h4>
                          <p className="text-sm text-muted-foreground capitalize">
                            {doc.document_type.replace("_", " ")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => window.open(doc.file_url, "_blank")}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => deleteDocument(doc)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Documents;