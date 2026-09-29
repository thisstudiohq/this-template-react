import {
	Badge,
	Box,
	Button,
	Card,
	Flex,
	Spinner,
	Stack,
	Text,
	TextInput,
} from '@sanity/ui'
import { type ChangeEvent, type DragEvent, useRef, useState } from 'react'
import { type ObjectInputProps, set, unset } from 'sanity'

const CLOUD_NAME =
	(typeof process !== 'undefined' &&
		(process.env.SANITY_STUDIO_CLOUDINARY_CLOUD_NAME ||
			process.env.CLOUDINARY_CLOUD_NAME)) ||
	''

const API_KEY =
	(typeof process !== 'undefined' &&
		(process.env.SANITY_STUDIO_CLOUDINARY_API_KEY ||
			process.env.CLOUDINARY_API_KEY)) ||
	''

const API_SECRET =
	(typeof process !== 'undefined' &&
		(process.env.SANITY_STUDIO_CLOUDINARY_API_SECRET ||
			process.env.CLOUDINARY_API_SECRET)) ||
	''

const TARGET_FOLDER =
	(typeof process !== 'undefined' &&
		process.env.SANITY_STUDIO_CLOUDINARY_FOLDER) ||
	'uploads'

interface CloudinaryAssetPayload {
	public_id: string
	secure_url: string
	url: string
	width: number
	height: number
	format: string
	bytes: number
	resource_type: string
	created_at?: string
}

async function computeSha1Signature(
	params: Record<string, string | number>,
	secret: string,
): Promise<string> {
	const sortedKeys = Object.keys(params).sort()
	const serialized = sortedKeys.map((k) => `${k}=${params[k]}`).join('&')
	const stringToSign = `${serialized}${secret}`

	const encoder = new TextEncoder()
	const data = encoder.encode(stringToSign)
	const hashBuffer = await window.crypto.subtle.digest('SHA-1', data)
	const hashArray = Array.from(new Uint8Array(hashBuffer))
	return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function CloudinaryImageInput(props: ObjectInputProps) {
	const { value, onChange, readOnly } = props

	const [isUploading, setIsUploading] = useState(false)
	const [uploadError, setUploadError] = useState<string | null>(null)
	const [isDragging, setIsDragging] = useState(false)
	const [showAdvanced, setShowAdvanced] = useState(false)

	const fileInputRef = useRef<HTMLInputElement | null>(null)

	const asset = value?.asset as CloudinaryAssetPayload | undefined
	const currentUrl = (value?.url as string) || asset?.secure_url || asset?.url
	const currentPublicId = asset?.public_id || (value?.url as string) || ''
	const currentAlt = (value?.alt as string) || ''

	async function uploadFileToCloudinary(file: File) {
		setIsUploading(true)
		setUploadError(null)

		try {
			if (!API_SECRET || !API_KEY || !CLOUD_NAME) {
				throw new Error(
					'Cloudinary credentials are not configured. Please ensure SANITY_STUDIO_CLOUDINARY_CLOUD_NAME, SANITY_STUDIO_CLOUDINARY_API_KEY, and SANITY_STUDIO_CLOUDINARY_API_SECRET are set.',
				)
			}

			const timestamp = Math.round(Date.now() / 1000)
			const signature = await computeSha1Signature(
				{
					folder: TARGET_FOLDER,
					timestamp,
				},
				API_SECRET,
			)

			const formData = new FormData()
			formData.append('file', file)
			formData.append('folder', TARGET_FOLDER)
			formData.append('timestamp', timestamp.toString())
			formData.append('api_key', API_KEY)
			formData.append('signature', signature)

			const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
			const response = await fetch(endpoint, {
				method: 'POST',
				body: formData,
			})

			if (!response.ok) {
				const errorJson = await response.json().catch(() => null)
				throw new Error(
					errorJson?.error?.message ||
						`Upload failed with HTTP status ${response.status}`,
				)
			}

			const result: CloudinaryAssetPayload = await response.json()

			onChange(
				set({
					_type: 'cloudinaryImage',
					asset: {
						public_id: result.public_id,
						secure_url: result.secure_url,
						url: result.url,
						width: result.width,
						height: result.height,
						format: result.format,
						bytes: result.bytes,
						resource_type: result.resource_type,
					},
					url: result.secure_url,
					alt: currentAlt,
				}),
			)
		} catch (err: unknown) {
			console.error('Cloudinary upload error:', err)
			setUploadError(
				err instanceof Error ? err.message : 'Unknown error during upload',
			)
		} finally {
			setIsUploading(false)
			if (fileInputRef.current) {
				fileInputRef.current.value = ''
			}
		}
	}

	function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
		const files = e.target.files
		if (files && files.length > 0) {
			uploadFileToCloudinary(files[0])
		}
	}

	function handleDragOver(e: DragEvent<HTMLDivElement>) {
		e.preventDefault()
		if (!readOnly && !isUploading) {
			setIsDragging(true)
		}
	}

	function handleDragLeave(e: DragEvent<HTMLDivElement>) {
		e.preventDefault()
		setIsDragging(false)
	}

	function handleDrop(e: DragEvent<HTMLDivElement>) {
		e.preventDefault()
		setIsDragging(false)
		if (readOnly || isUploading) return

		const files = e.dataTransfer.files
		if (files && files.length > 0) {
			uploadFileToCloudinary(files[0])
		}
	}

	function handleRemove() {
		onChange(unset())
		setUploadError(null)
	}

	function handleAltChange(e: ChangeEvent<HTMLInputElement>) {
		const newAlt = e.target.value
		onChange(
			set({
				...(value || { _type: 'cloudinaryImage' }),
				alt: newAlt,
			}),
		)
	}

	function handleManualUrlChange(e: ChangeEvent<HTMLInputElement>) {
		const newUrl = e.target.value
		onChange(
			set({
				...(value || { _type: 'cloudinaryImage' }),
				url: newUrl,
			}),
		)
	}

	return (
		<Stack gap={3}>
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*,.gif"
				style={{ display: 'none' }}
				onChange={handleFileChange}
				disabled={readOnly || isUploading}
			/>

			{currentUrl ? (
				<Card padding={3} radius={2} tone="transparent" border>
					<Flex direction={['column', 'row']} gap={3} align="flex-start">
						<Box
							style={{
								width: '120px',
								height: '140px',
								minWidth: '120px',
								borderRadius: '6px',
								overflow: 'hidden',
								backgroundColor: '#111',
								position: 'relative',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<img
								src={currentUrl}
								alt={currentAlt || 'Cloudinary preview'}
								style={{
									width: '100%',
									height: '100%',
									objectFit: 'cover',
									display: 'block',
								}}
							/>
						</Box>

						<Stack gap={2} flex={1}>
							<Flex gap={2} align="center">
								<Badge tone="positive" fontSize={1} padding={2}>
									Cloudinary: {TARGET_FOLDER}
								</Badge>
								{asset?.format && (
									<Badge
										tone={asset.format.toLowerCase() === 'gif' ? 'caution' : 'default'}
										fontSize={1}
										padding={2}
									>
										{asset.format.toUpperCase()}
									</Badge>
								)}
							</Flex>

							<Text size={1} weight="semibold" textOverflow="ellipsis">
								{currentPublicId}
							</Text>

							{asset?.width && asset?.height && (
								<Text size={1} muted>
									{asset.width} × {asset.height} px
									{asset.bytes
										? ` • ${(asset.bytes / 1024).toFixed(0)} KB`
										: ''}
								</Text>
							)}

							<Flex gap={2} paddingTop={2}>
								<Button
									text={isUploading ? 'Uploading...' : 'Replace from computer'}
									tone="primary"
									mode="ghost"
									fontSize={1}
									onClick={() => fileInputRef.current?.click()}
									disabled={readOnly || isUploading}
								/>
								<Button
									text="Remove"
									tone="critical"
									mode="ghost"
									fontSize={1}
									onClick={handleRemove}
									disabled={readOnly || isUploading}
								/>
							</Flex>
						</Stack>
					</Flex>
				</Card>
			) : (
				<Card
					padding={4}
					radius={2}
					tone={isDragging ? 'primary' : 'transparent'}
					border
					style={{
						borderStyle: 'dashed',
						borderWidth: '2px',
						borderColor: isDragging ? '#4f46e5' : '#333',
						textAlign: 'center',
						cursor: 'pointer',
						transition: 'border-color 0.2s, background-color 0.2s',
					}}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
					onClick={() => {
						if (!isUploading && !readOnly) {
							fileInputRef.current?.click()
						}
					}}
				>
					<Flex direction="column" gap={3} align="center">
						{isUploading ? (
							<>
								<Spinner size={3} />
								<Text size={2} weight="medium">
									Uploading to Cloudinary folder "{TARGET_FOLDER}"...
								</Text>
								<Text size={1} muted>
									Please wait while the image is being processed
								</Text>
							</>
						) : (
							<>
								<svg
									width="36"
									height="36"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
									style={{ color: '#888' }}
									aria-hidden="true"
								>
									<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
									<polyline points="17 8 12 3 7 8" />
									<line x1="12" y1="3" x2="12" y2="15" />
								</svg>

								<Button
									text="Upload image or GIF from computer"
									tone="primary"
									fontSize={2}
									padding={3}
									onClick={(e) => {
										e.stopPropagation()
										fileInputRef.current?.click()
									}}
									disabled={readOnly || isUploading}
								/>

								<Text size={1} muted>
									or drag & drop your image or animated GIF here
								</Text>
								<Text size={1} muted>
									Files are automatically stored in Cloudinary folder: &nbsp;
									<Badge tone="positive" fontSize={0} padding={1}>
										{TARGET_FOLDER}
									</Badge>
								</Text>
							</>
						)}
					</Flex>
				</Card>
			)}

			{uploadError && (
				<Card padding={3} radius={2} tone="critical">
					<Text size={1} weight="medium">
						Upload Error: {uploadError}
					</Text>
				</Card>
			)}

			<Stack gap={2}>
				<Text size={1} weight="medium">
					Alt Text (Accessibility & SEO)
				</Text>
				<TextInput
					value={currentAlt}
					placeholder="Describe this image for screen readers and SEO..."
					onChange={handleAltChange}
					disabled={readOnly}
				/>
			</Stack>

			<Box paddingTop={1}>
				<Button
					text={
						showAdvanced
							? 'Hide manual URL / Public ID'
							: 'Manual URL / Public ID (Advanced)'
					}
					mode="bleed"
					fontSize={1}
					onClick={() => setShowAdvanced(!showAdvanced)}
				/>
			</Box>

			{showAdvanced && (
				<Card padding={3} radius={2} tone="transparent" border>
					<Stack gap={2}>
						<Text size={1} weight="medium">
							Direct Cloudinary Image / GIF URL or Public ID
						</Text>
						<TextInput
							value={(value?.url as string) || ''}
							placeholder="e.g. my-folder/artwork.gif or full Cloudinary URL"
							onChange={handleManualUrlChange}
							disabled={readOnly}
						/>
						<Text size={1} muted>
							Enter a public_id or full URL if the image or animated GIF is already on
							Cloudinary.
						</Text>
					</Stack>
				</Card>
			)}
		</Stack>
	)
}
