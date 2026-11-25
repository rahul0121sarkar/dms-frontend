import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../services/api";

// Upload validation schema.
// Validates document fields and restricts uploads to PDF and supported image formats.
const uploadSchema = z.object({
  documentDate: z.string().min(1, "Select a document date"),
  category: z.string().min(1, "Select a category"),
  subCategory: z.string().min(1, "Select a name or department"),
  remarks: z.string().min(1, "Enter remarks"),
  file: z
    .custom<FileList>(
      (files) => files instanceof FileList && files.length > 0,
      { message: "Please select a file" },
    )
    .refine(
      (files) =>
        ["application/pdf", "image/jpeg", "image/png", "image/webp"].includes(
          files[0]?.type,
        ),
      "Only PDF and image files are allowed",
    ),
});

// TypeScript type inferred from the Zod validation schema.
type UploadFormData = z.infer<typeof uploadSchema>;

// Reusable Tailwind CSS classes for form inputs.
const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

// Upload document component.
// Handles document details, tag selection, form validation, and file uploads.

function UploadDocument() {
  // Tracks upload status and displays success or error messages.
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // Stores existing tags retrieved from the backend and tags selected by the user.
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Tracks the loading state while fetching existing tags.
  const [tagsLoading, setTagsLoading] = useState(false);

  // React Hook Form configuration with Zod validation.
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
  });

  // Watches the selected category to display the appropriate subcategory options.
  const category = watch("category");

  // Fetches existing document tags from the backend when the component loads.
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setTagsLoading(true);

        const response = await api.post("documentTags", {
          term: "",
        });

        console.log("Available tags response:", response.data);

        // Extracts the tag list from the API response.
        const tagList = response.data.data;

        // Supports tag responses containing either strings or objects with tag_name.
        if (Array.isArray(tagList)) {
          setAvailableTags(
            tagList
              .map((item: unknown) => {
                if (typeof item === "string") return item;

                if (
                  item &&
                  typeof item === "object" &&
                  "tag_name" in item &&
                  typeof item.tag_name === "string"
                ) {
                  return item.tag_name;
                }

                return "";
              })
              .filter(Boolean),
          );
        }
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      } finally {
        setTagsLoading(false);
      }
    };

    fetchTags();
  }, []);

  // Adds a new tag to the selected tags list while preventing duplicates.
  const addTag = (value = tagInput) => {
    const newTag = value.trim();

    if (
      newTag &&
      !tags.some((tag) => tag.toLowerCase() === newTag.toLowerCase())
    ) {
      setTags((prev) => [...prev, newTag]);
    }

    setTagInput("");
  };

  // Removes a selected tag from the document.
  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  // Filters existing tags based on the user's input
  // and excludes tags that have already been selected.
  const filteredTags = availableTags.filter(
    (tag) =>
      tag.toLowerCase().includes(tagInput.toLowerCase()) &&
      !tags.some((selected) => selected.toLowerCase() === tag.toLowerCase()),
  );

  // Handles form submission, prepares multipart data, and uploads the document.
  const onSubmit = async (data: UploadFormData) => {
    try {
      setUploading(true);
      setMessage("");

      // Creates FormData to send the file and document metadata together.
      const formData = new FormData();

      // Attaches the selected document file.
      formData.append("file", data.file[0]);

      // Converts document metadata into JSON for the backend API.
      formData.append(
        "data",
        JSON.stringify({
          major_head: data.category,
          minor_head: data.subCategory,
          document_date: data.documentDate,
          document_remarks: data.remarks,
          tags: tags.map((tag) => ({ tag_name: tag })),
          user_id: "nitin",
        }),
      );

      // Sends the document and its metadata to the backend.
      const response = await api.post("saveDocumentEntry", formData);

      console.log("Upload response:", response.data);
      setMessage("Document uploaded successfully!");
    } catch (error) {
      // Handles upload failures and displays an error message.
      console.error("Upload failed:", error);
      setMessage("Document upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Upload form UI: Collects document information and displays validation feedback.
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Upload Document
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Add a new document to the document management system.
        </p>
      </div>

      {/* Form submission is handled through React Hook Form and Zod validation. */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        {/* Document date field. */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Document Date
          </label>
          <input
            type="date"
            {...register("documentDate")}
            className={inputClass}
          />
          <p className="mt-1 text-sm text-red-500">
            {errors.documentDate?.message}
          </p>
        </div>

        {/* Main category selection: Personal or Professional. */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Category
          </label>
          <select {...register("category")} className={inputClass}>
            <option value="">Select category</option>
            <option value="Personal">Personal</option>
            <option value="Professional">Professional</option>
          </select>
          <p className="mt-1 text-sm text-red-500">
            {errors.category?.message}
          </p>
        </div>

        {/* Subcategory selection: Displays names or departments based on the selected category. */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            {category === "Personal"
              ? "Name"
              : category === "Professional"
                ? "Department"
                : "Name / Department"}
          </label>
          <select
            {...register("subCategory")}
            className={inputClass}
            disabled={!category}
          >
            <option value="">Select an option</option>

            {category === "Personal" && (
              <>
                <option value="Self">Self</option>
                <option value="Family">Family</option>
              </>
            )}

            {category === "Professional" && (
              <>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="IT">IT</option>
                <option value="Administration">Administration</option>
              </>
            )}
          </select>
          <p className="mt-1 text-sm text-red-500">
            {errors.subCategory?.message}
          </p>
        </div>

        {/* Tag input section: Allows users to search, select, and add document tags. */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Document Tags
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="Search existing tags or enter a new tag"
              className={inputClass}
            />

            <button
              type="button"
              onClick={() => addTag()}
              className="rounded-lg bg-blue-600 px-4 text-sm text-white hover:bg-blue-700 cursor-pointer"
            >
              Add
            </button>
          </div>

          {/* Displays existing tag suggestions matching the user's input. */}
          <div className="mt-3 flex flex-wrap gap-2">
            {tagsLoading && (
              <p className="text-sm text-gray-500">Loading existing tags...</p>
            )}

            {filteredTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => addTag(tag)}
                className="rounded-full border border-gray-300 px-3 py-1 text-sm hover:bg-blue-50 cursor-pointer"
              >
                + {tag}
              </button>
            ))}
          </div>

          {/* Displays selected tags as removable chips. */}
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="font-bold cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Remarks
          </label>
          <textarea
            {...register("remarks")}
            rows={3}
            placeholder="Enter document remarks..."
            className={inputClass}
          />
          <p className="mt-1 text-sm text-red-500">{errors.remarks?.message}</p>
        </div>

        {/* File selection field: Accepts PDF, JPG, PNG, and WEBP files. */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Upload File
          </label>
          <input
            type="file"
            accept=".pdf,image/jpeg,image/png,image/webp"
            {...register("file")}
            className={inputClass}
          />
          <p className="mt-1 text-sm text-red-500">{errors.file?.message}</p>
          <p className="mt-1 text-xs text-gray-500">
            Accepted formats: PDF, JPG, PNG and WEBP.
          </p>
        </div>

        {/* Submission section: Displays upload progress and API response messages. */}
        <div className="flex justify-end border-t border-gray-100 pt-4">
          <button
            type="submit"
            disabled={uploading}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50 cursor-pointer"
          >
            {uploading ? "Uploading..." : "Submit Document"}
          </button>
          {message && <p className="text-sm">{message}</p>}
        </div>
      </form>
    </div>
  );
}

export default UploadDocument;
