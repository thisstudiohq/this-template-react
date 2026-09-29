import fs from "node:fs";
import path from "node:path";
import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
	console.error(
		"Error: Missing Cloudinary credentials. Please ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set in your environment or .env file.",
	);
	process.exit(1);
}

cloudinary.config({
	cloud_name: cloudName,
	api_key: apiKey,
	api_secret: apiSecret,
	secure: true,
});

const TARGET_FOLDER =
	process.env.CLOUDINARY_FOLDER ||
	process.env.SANITY_STUDIO_CLOUDINARY_FOLDER ||
	"uploads";

async function uploadFile(filePath, customPublicId) {
	const options = {
		folder: TARGET_FOLDER,
		use_filename: true,
		unique_filename: false,
		overwrite: true,
		resource_type: "auto",
	};

	if (customPublicId) {
		options.public_id = customPublicId;
	}

	const result = await cloudinary.uploader.upload(filePath, options);

	return {
		filePath,
		publicId: result.public_id,
		secureUrl: result.secure_url,
		width: result.width,
		height: result.height,
		format: result.format,
		resourceType: result.resource_type,
	};
}

async function main() {
	const args = process.argv.slice(2);

	if (args.length === 0) {
		console.log("Usage: npm run cloudinary:upload <file-or-directory-path>");
		console.log(
			`All media files are automatically uploaded into Cloudinary folder: "${TARGET_FOLDER}"`,
		);
		return;
	}

	const targetPath = path.resolve(process.cwd(), args[0]);

	if (!fs.existsSync(targetPath)) {
		console.error(`File or directory not found: ${targetPath}`);
		process.exit(1);
	}

	const stat = fs.statSync(targetPath);
	const filesToUpload = [];

	const validExtensions = new Set([
		".jpg",
		".jpeg",
		".png",
		".webp",
		".avif",
		".gif",
		".mp4",
		".mov",
		".webm",
	]);

	if (stat.isDirectory()) {
		const files = fs.readdirSync(targetPath);
		for (const file of files) {
			const ext = path.extname(file).toLowerCase();
			if (validExtensions.has(ext)) {
				filesToUpload.push(path.join(targetPath, file));
			}
		}
	} else {
		filesToUpload.push(targetPath);
	}

	if (filesToUpload.length === 0) {
		console.log("No valid media files found to upload.");
		return;
	}

	console.log(
		`Uploading ${filesToUpload.length} file(s) to Cloudinary folder "${TARGET_FOLDER}"...`,
	);

	for (const file of filesToUpload) {
		try {
			const res = await uploadFile(file);
			console.log(`\n✔ Uploaded: ${path.basename(file)}`);
			console.log(`  Public ID: ${res.publicId}`);
			console.log(`  Secure URL: ${res.secureUrl}`);
			console.log(`  Type: ${res.resourceType}`);
			if (res.width && res.height) {
				console.log(`  Dimensions: ${res.width}x${res.height}`);
			}
		} catch (err) {
			console.error(`✖ Failed to upload ${file}:`, err);
		}
	}

	console.log(`\nAll done! Folder: ${TARGET_FOLDER}`);
}

main().catch((err) => {
	console.error("Upload error:", err);
	process.exit(1);
});
