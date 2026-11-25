import { useState } from "react";
import api from "../services/api";

// Defines the structure of a document returned by the search API.
type Document = {
  document_id: number;
  major_head: string;
  minor_head: string;
  file_url: string;
  document_date: string;
  document_remarks: string;
  upload_time: string;
  uploaded_by: string;
  total_count: number;
};

function SearchDocuments() {
  // Stores the documents returned by the search API.
  const [documents, setDocuments] = useState<Document[]>([]);

  // Tracks the search request status and any errors.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Stores the document currently selected for preview.
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null,
  );

  // Opens the document URL in a new browser tab for downloading or viewing.
  const downloadDocument = (doc: Document) => {
    const link = document.createElement("a");
    link.href = doc.file_url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  };

  // Stores the values entered in the document search filters.
  const [filters, setFilters] = useState({
    category: "",
    subCategory: "",
    fromDate: "",
    toDate: "",
    tag: "",
  });

  // Updates the corresponding filter whenever the user changes an input.
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // Sends the selected filters to the API and updates the search results.
  const searchDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      // Converts frontend filter values into the API's expected request format.
      const payload = {
        major_head: filters.category,
        minor_head: filters.subCategory,
        from_date: filters.fromDate,
        to_date: filters.toDate,
        tags: filters.tag ? [{ tag_name: filters.tag }] : [],
        uploaded_by: "",
        start: 0,
        length: 10,
        filterId: "",
        search: {
          value: "",
        },
      };

      // Calls the document search endpoint.
      const response = await api.post("searchDocumentEntry", payload);

      console.log("Search response:", response.data);

      // Extracts the document list from the API response.
      const result = response.data.data;

      // Updates the results only when the API returns an array.
      if (Array.isArray(result)) {
        setDocuments(result);
      } else {
        setDocuments([]);
      }
    } catch (err) {
      // Displays an error if the search request fails.
      console.error("Search failed:", err);
      setError("Unable to fetch documents.");
    } finally {
      // Stops the loading state after the request completes.
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      {/* Page heading and description */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Search Documents
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Find documents using categories, dates and tags.
        </p>
      </div>

      {/* Search filters: category, subcategory, tag and date range */}
      <div className="mb-6 grid gap-4 rounded-xl border bg-white p-5 md:grid-cols-3">
        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
          className="rounded-lg border p-3"
        >
          <option value="">All Categories</option>
          <option value="Personal">Personal</option>
          <option value="Professional">Professional</option>
          <option value="Company">Company</option>
        </select>

        <input
          name="subCategory"
          value={filters.subCategory}
          onChange={handleChange}
          placeholder="Name / Department"
          className="rounded-lg border p-3"
        />

        <input
          name="tag"
          value={filters.tag}
          onChange={handleChange}
          placeholder="Search by tag"
          className="rounded-lg border p-3"
        />

        <div>
          <label className="mb-1 block text-sm text-gray-600">From date</label>
          <input
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-600">To date</label>
          <input
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />
        </div>

        {/* Starts the document search request */}
        <button
          onClick={searchDocuments}
          disabled={loading}
          className="rounded-lg bg-blue-600 p-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Searching..." : "Search Documents"}
        </button>
      </div>

      {/* Displays search errors */}
      {error && <p className="mb-4 text-red-600">{error}</p>}

      {/* Displays the documents returned by the API */}
      <div className="space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.document_id}
            className="flex flex-col justify-between gap-3 rounded-xl border bg-white p-5 md:flex-row md:items-center"
          >
            <div>
              <h3 className="font-semibold text-gray-800">{doc.minor_head}</h3>
              <p className="text-sm text-gray-500">
                {doc.major_head} · {doc.document_remarks}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {new Date(doc.document_date).toLocaleDateString()} · Uploaded by{" "}
                {doc.uploaded_by}
              </p>
            </div>

            {/* Document actions: preview or open the file URL */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedDocument(doc)}
                className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer"
              >
                Preview
              </button>

              <button
                onClick={() => downloadDocument(doc)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 cursor-pointer"
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state shown when no documents are available */}
      {!loading && documents.length === 0 && (
        <p className="py-8 text-center text-sm text-gray-500">
          No documents found. Try searching with different filters.
        </p>
      )}

      {/* Preview modal for the selected document */}
      {selectedDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-4">
              <div>
                <h2 className="font-semibold text-gray-800">
                  Document Preview
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedDocument.minor_head}
                </p>
              </div>

              <button
                onClick={() => setSelectedDocument(null)}
                className="rounded-lg px-3 py-1 text-xl text-gray-500 hover:bg-gray-100 cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Renders PDFs and supported image formats in the preview modal */}
            <div className="min-h-[400px] flex-1 overflow-auto bg-gray-100 p-4">
              {selectedDocument.file_url.toLowerCase().includes(".pdf") ? (
                <iframe
                  src={selectedDocument.file_url}
                  title="PDF Preview"
                  className="h-[65vh] w-full rounded-lg bg-white"
                />
              ) : /\.(png|jpe?g|webp|gif)(\?|$)/i.test(
                  selectedDocument.file_url,
                ) ? (
                <img
                  src={selectedDocument.file_url}
                  alt={selectedDocument.minor_head}
                  className="mx-auto max-h-[65vh] max-w-full rounded-lg object-contain"
                />
              ) : (
                <p className="py-20 text-center text-gray-600">
                  Preview is not available for this file type.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchDocuments;
