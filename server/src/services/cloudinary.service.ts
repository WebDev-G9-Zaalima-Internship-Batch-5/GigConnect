import { v2 as cloudinary, UploadApiOptions } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

interface CloudinaryUploadResponse {
  secure_url: string;
  url: string;
  public_id: string;
  [key: string]: any;
}

interface CloudinaryDeleteResourcesResponse {
  deleted: {
    [publicId: string]: string; // Key is the public ID, value is 'deleted'
  };
  partial: boolean;
}

/**
 * Uploads a file to Cloudinary from a local path.
 * @param {object} options - Options for the upload.
 * @param {string} options.localFilePath - The path to the local file to upload.
 * @param {string} [options.publicId=null] - The public ID for the uploaded asset. If null, a random public ID is generated.
 * @param {string} [options.folderPath="GigConnect"] - The folder in Cloudinary to upload the asset to.
 * @returns {Promise<CloudinaryUploadResponse | null>} The Cloudinary response object on success, or null on failure.
 */
const uploadOnCloudinary = async ({
  localFilePath,
  publicId = null,
  folderPath = "GigConnect",
}: {
  localFilePath: string;
  publicId?: string | null;
  folderPath?: string;
}): Promise<CloudinaryUploadResponse | null> => {
  try {
    if (!localFilePath) return null;

    if (!fs.existsSync(localFilePath)) {
      console.warn(`File does not exist: ${localFilePath}`);
      return null;
    }

    const options: UploadApiOptions = {
      resource_type: "auto",
      overwrite: true,
      invalidate: true,
    };

    if (publicId) {
      options.public_id = publicId;
    }

    if (folderPath) {
      options.asset_folder = folderPath;
    }

    const response = await cloudinary.uploader.upload(localFilePath, options);

    // Remove the locally saved temp file.
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return response || null;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    // Remove the locally saved temp file as the upload failed.
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

/**
 * Deletes a file from Cloudinary using its public ID.
 * @param {object} options - Options for the deletion.
 * @param {string[]} options.publicIds - An array of public IDs of the files to delete.
 * @param {string} [options.resourceType="image"] - The resource type of the file (e.g., "image", "video", "raw").
 * @returns {Promise<object|null>} The Cloudinary deletion response on success, or null on failure.
 */
const deleteFromCloudinary = async ({
  publicIds,
  resourceType = "image",
}: {
  publicIds: string[];
  resourceType?: "image" | "video" | "raw";
}): Promise<object | null> => {
  try {
    const options = {
      resource_type: resourceType,
      invalidate: true, // Invalidate CDN cache for the deleted file
    };

    const response: CloudinaryDeleteResourcesResponse =
      await cloudinary.api.delete_resources(publicIds, options);

    if (response.deleted && Object.keys(response.deleted).length > 0) {
      return response;
    }

    return null;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
