import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Upload, Search } from "lucide-react";
import api from "../services/api";

// Defines the structure of documents returned by the search API.
type Document = {
  document_id: number;
  major_head: string;
  minor_head: string;
  document_date: string;
  document_remarks: string;
  upload_time: string;
  total_count: number;
};

const Dashboard = () => {
  // Stores the five documents displayed in the dashboard table.
  const [documents, setDocuments] = useState<Document[]>([]);

  // Stores the total number of documents returned by the API.
  const [totalDocuments, setTotalDocuments] = useState(0);

  // Tracks the API request status and any loading errors.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetches dashboard document data when the component first loads.
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // Requests the latest five documents without applying search filters.
        const response = await api.post("searchDocumentEntry", {
          major_head: "",
          minor_head: "",
          from_date: "",
          to_date: "",
          tags: [],
          uploaded_by: "",
          start: 0,
          length: 5,
          filterId: "",
          search: { value: "" },
        });

        // Extracts the document list from the API response.
        const result = response.data.data;

        // Updates the document list and total document count.
        if (Array.isArray(result)) {
          setDocuments(result);
          setTotalDocuments(result[0]?.total_count ?? 0);
        }
      } catch (error) {
        // Handles errors while fetching dashboard data.
        console.error("Dashboard error:", error);
        setError("Unable to load dashboard data.");
      } finally {
        // Ends the loading state after the request completes.
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  return (
    <div className="space-y-6">
      {/* Dashboard heading and description */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500">Document Management Overview</p>
      </div>

      {/* Displays an error if dashboard data cannot be loaded */}
      {error && <p className="text-red-600">{error}</p>}

      {/* Dashboard summary cards and navigation shortcuts */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Displays the total document count */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <FileText className="mb-3 text-blue-600" />
          <p className="text-sm text-slate-500">Total Documents</p>
          <h2 className="text-3xl font-bold">
            {loading ? "..." : totalDocuments}
          </h2>
        </div>

        {/* Navigates to the document upload page */}
        <Link
          to="/upload"
          className="rounded-xl border bg-white p-6 shadow-sm hover:border-blue-500"
        >
          <Upload className="mb-3 text-green-600" />
          <h2 className="font-semibold">Upload Document</h2>
          <p className="text-sm text-slate-500">Add a new document</p>
        </Link>

        {/* Navigates to the document search page */}
        <Link
          to="/search"
          className="rounded-xl border bg-white p-6 shadow-sm hover:border-blue-500"
        >
          <Search className="mb-3 text-purple-600" />
          <h2 className="font-semibold">Search Documents</h2>
          <p className="text-sm text-slate-500">Find and manage documents</p>
        </Link>
      </div>

      {/* Displays the five documents fetched for the dashboard */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Documents</h2>

        {/* Shows loading, empty, or document table based on API results */}
        {loading ? (
          <p>Loading documents...</p>
        ) : documents.length === 0 ? (
          <p className="text-slate-500">No documents found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="p-3">Document ID</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Subcategory</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>

              <tbody>
                {/* Renders one table row for each returned document */}
                {documents.map((doc) => (
                  <tr key={doc.document_id} className="border-b">
                    <td className="p-3">{doc.document_id}</td>
                    <td className="p-3">{doc.major_head}</td>
                    <td className="p-3">{doc.minor_head}</td>
                    <td className="p-3">
                      {new Date(doc.document_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Navigates to the search page to view all matching documents */}
        <Link
          to="/search"
          className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
        >
          View All Documents
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
